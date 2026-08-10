import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authRoutes(server: FastifyInstance) {

  // 1. REGISTER (Phone + Password)
  server.post('/register', async (request, reply) => {
    const { name, phone, email, password } = request.body as {
      name: string;
      phone: string;
      email?: string;
      password?: string;
    };

    if (!phone) {
      return reply.code(400).send({ error: 'Phone number is required' });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ phone }, { email: email || undefined }] },
      });

      if (existingUser) {
        return reply.code(400).send({ error: 'User with this phone or email already exists' });
      }

      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Explicitly lock role to "USER"
      const user = await prisma.user.create({
        data: {
          name,
          phone,
          email: email || null,
          password: hashedPassword,
          role: 'USER', // <--- STRICTLIES LOCKED TO USER
        },
      });

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

      return reply.code(201).send({
        success: true,
        message: 'Registration successful',
        token,
        user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to register user' });
    }
  });

  // 2. LOGIN (Phone + Password)
  server.post('/login', async (request, reply) => {
    const { phone, password } = request.body as { phone: string; password?: string };

    if (!phone) {
      return reply.code(400).send({ error: 'Phone number is required' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { phone } });

      if (!user) {
        return reply.code(404).send({ error: 'Account not found. Please register first.' });
      }

      // Password check if account has a password
      if (user.password && password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return reply.code(401).send({ error: 'Invalid password' });
        }
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

      return reply.send({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to login' });
    }
  });

  // 3. GOOGLE / GMAIL LOGIN & REGISTER (OAuth Sync)
  server.post('/google', async (request, reply) => {
    const { name, email, googleId, avatar } = request.body as {
      name: string;
      email: string;
      googleId: string;
      avatar?: string;
    };

    if (!email) {
      return reply.code(400).send({ error: 'Google Email is required' });
    }

    try {
      // Find user by email or Google ID
      let user = await prisma.user.findFirst({
        where: { OR: [{ email }, { googleId }] },
      });

      // If user doesn't exist, create automatically as "USER"
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            googleId,
            avatar: avatar || null,
            role: 'USER', // <--- ALWAYS USER
          },
        });
      } else if (!user.googleId) {
        // Link Google ID to existing account
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatar: avatar || user.avatar },
        });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

      return reply.send({
        success: true,
        message: 'Google login successful',
        token,
        user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to authenticate with Google' });
    }
  });
}