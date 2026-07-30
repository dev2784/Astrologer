import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors'; // 1. Import the CORS plugin
import { prisma } from './db';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/users.routes';

const server = Fastify({ logger: true });

// 2. Register CORS before any routes. 
// (Setting origin to true allows all local traffic for development)
server.register(cors, { 
  origin: true,
  credentials: true 
});

server.register(jwt, { secret: 'super_secret_development_string_123' });
server.register(authRoutes, { prefix: '/auth' });
server.register(userRoutes, { prefix: '/users' });

// Basic health check route
server.get('/health', async (request, reply) => {
  return { status: 'System Online' };
});

// Test database route to fetch users
server.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany();
  return { data: users };
});

const start = async () => {
  try {
    await server.listen({ port: 8080, host: '0.0.0.0' });
    console.log('Server listening at http://localhost:8080');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();