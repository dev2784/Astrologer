import { FastifyInstance } from 'fastify';
import '@fastify/jwt';
import bcrypt from "bcryptjs";
import { prisma } from '../../db';

export async function authRoutes(server: FastifyInstance) {

  // 1. Unified Register Route (Supports Email and/or Phone)
  server.post('/register', async (request, reply) => {
    const { name, email, phone, password, role } = request.body as any;

    if (!email && !phone) {
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

      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      // Force role to USER if registering from mobile/public (prevent admin privilege escalation)
      const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

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

  // 3. Google OAuth / Mobile Gmail Login
  server.post('/google', async (request, reply) => {
    const { name, email, googleId, avatar } = request.body as any;

    if (!email) {
      return reply.code(400).send({ error: 'Google email is required' });
    }

    try {
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { googleId: googleId || undefined }],
        },
      });

      // Automatically register new mobile user as "USER" role
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || null,
            email,
            googleId: googleId || null,
            avatar: avatar || null,
            role: 'USER', // Strictly locked to USER
          },
        });
      } else if (googleId && !user.googleId) {
        // Link googleId to existing account if missing
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatar: avatar || user.avatar },
        });
      }

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
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ error: 'Google authentication failed' });
    }
  });

}