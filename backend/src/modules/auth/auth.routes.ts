import { FastifyInstance } from 'fastify';
import '@fastify/jwt'; // <-- This tells TypeScript about server.jwt
import bcrypt from "bcryptjs";
import { prisma } from '../../db';

export async function authRoutes(server: FastifyInstance) {
  // 1. Register Route
  server.post('/register', async (request, reply) => {
    // Note: We will add strict Zod schema validation later
    const { email, password } = request.body as any; 
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
      return reply.code(201).send({ message: 'User created', userId: user.id });
    } catch (e) {
      return reply.code(400).send({ error: 'Email already exists' });
    }
  });

  // 2. Login Route
  server.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Sign the JWT payload with the user ID and role
    const token = server.jwt.sign({ userId: user.id, role: user.role });
    return { token };
  });
}