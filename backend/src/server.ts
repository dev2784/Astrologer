import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors, { fastifyCors } from '@fastify/cors'; // 1. Import the CORS plugin
import { prisma } from './db';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/users.routes';
import { categoryRoutes } from './modules/categories/categories.routes';
import { pujaRoutes } from './modules/pujas/pujas.routes';
import { uploadRoutes } from './modules/uploads/upload.routes';
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { muhuratRoutes } from "./modules/muhurat/muhurat.routes";
import { panchangRoutes } from "./modules/panchang/panchang.routes";
import { reviewRoutes } from './modules/review/review.routes';
import { galleryRoutes } from './modules/gallery/gallery.routes';

import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';

import path from 'path';



const server = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024, // 10 MB body limit
});

// Register Multipart with 10 MB file size limit
server.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file limit
  },
});


// Register static file serving
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// 2. Register CORS before any routes. 
// Register CORS with allowed origins and methods
server.register(fastifyCors, {
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps, curl, or local tools)
    if (!origin) return cb(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'https://vedicapp-nine.vercel.app',
    ];

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return cb(null, true);
    }

    return cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // <--- Added PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

server.register(jwt, { secret: 'super_secret_development_string_123' });
server.register(authRoutes, { prefix: '/auth' });
server.register(userRoutes, { prefix: '/users' });
server.register(categoryRoutes, { prefix: '/categories' });
server.register(pujaRoutes, { prefix: '/pujas' });
server.register(uploadRoutes, { prefix: '/uploads' });
server.register(bookingRoutes, { prefix: '/bookings' });
server.register(muhuratRoutes, { prefix: '/muhurat' });
server.register(panchangRoutes, { prefix: '/panchang' });
server.register(reviewRoutes, { prefix: '/reviews' });
server.register(galleryRoutes, { prefix: '/gallery' });

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