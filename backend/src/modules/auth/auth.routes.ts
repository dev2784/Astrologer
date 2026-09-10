import { FastifyInstance } from 'fastify';
import '@fastify/jwt';
import bcrypt from "bcryptjs";
import { prisma } from '../../db';

export async function authRoutes(server: FastifyInstance) {

  // 1. Unified Register Route (Supports Email and/or Phone)
  server.post('/register', async (request, reply) => {
    const { name, email, phone, password } = request.body as any;

    if ((!email && !phone) || (email && typeof email !== 'string') || (phone && typeof phone !== 'string')) {
      return reply.code(400).send({ error: 'Either email or phone number is required' });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            email ? { email } : undefined,
            phone ? { phone } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (existingUser) {
        return reply.code(400).send({ error: 'User with this email or phone already exists' });
      }

      if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
        return reply.code(400).send({ error: 'Password must be at least 8 characters and at most 72 bytes.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      // Force role to USER if registering from mobile/public (prevent admin privilege escalation)
      const assignedRole = 'USER';

      const user = await prisma.user.create({
        data: {
          name: name || null,
          email: email || null,
          phone: phone || null,
          password: hashedPassword,
          role: assignedRole,
        },
      });

      const token = server.jwt.sign({ userId: user.id, role: user.role });

      return reply.code(201).send({
        message: 'User created',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (e) {
      console.error(e);
      return reply.code(400).send({ error: 'Failed to create user' });
    }
  });

  // 2. Unified Login Route (Supports login via Email OR Phone)
  server.post('/login', async (request, reply) => {
    const { email, phone, password } = request.body as any;

    if (!email && !phone) {
      return reply.code(400).send({ error: 'Email or phone is required' });
    }

    if (typeof password !== 'string' || !password) {
      return reply.code(400).send({ error: 'Password is required' });
    }
    // Lookup user by email or phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Sign JWT payload using your Fastify JWT instance
    const token = server.jwt.sign({ userId: user.id, role: user.role });

    return reply.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  });

  // Google login is not configured in either client yet. Never trust a posted email as identity.
  server.post('/google', async (_request, reply) => {
    return reply.code(503).send({ error: 'Google sign-in is not configured. Please use phone/email and password.' });
  });
}
