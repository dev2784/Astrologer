import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function galleryRoutes(server: FastifyInstance) {

  // 1. GET All Gallery Items (Public)
  server.get('/', async (request, reply) => {
    try {
      const items = await prisma.gallery.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
      });
      return reply.send({ success: true, items });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to fetch gallery items' });
    }
  });

  // 2. POST Add New Gallery Item (Admin)
  server.post('/', async (request, reply) => {
    const { titleEn, titleHi, imageUrl } = request.body as {
      titleEn: string;
      titleHi?: string;
      imageUrl: string;
    };

    if (!titleEn || !imageUrl) {
      return reply.code(400).send({ error: 'Title and image URL are required' });
    }

    try {
      const item = await prisma.gallery.create({
        data: {
          titleEn,
          titleHi: titleHi || null,
          imageUrl,
        },
      });
      return reply.code(201).send({ success: true, item });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to create gallery item' });
    }
  });

  // 3. DELETE Gallery Item (Admin)
  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.gallery.delete({ where: { id } });
      return reply.send({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to delete gallery item' });
    }
  });
}