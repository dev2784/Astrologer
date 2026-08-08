import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function aboutRoutes(server: FastifyInstance) {

  // 1. GET About Details (Public)
  server.get('/', async (request, reply) => {
    try {
      let about = await prisma.aboutSection.findUnique({
        where: { id: 'default_about' },
      });

      // Default fallback if table is empty
      if (!about) {
        about = await prisma.aboutSection.create({
          data: {
            id: 'default_about',
            name: 'Acharya Rishi Nagar Ji',
            yearsExp: 20,
            pujasDone: 5000,
            whatsappNo: '919340553012',
            descriptionEn: 'Educated from the prestigious Gurukuls of Ujjain, Acharya Ji holds over 20 years of profound experience in Vedic rituals, Astrology, Vastu Shastra, and Karmakand.',
            descriptionHi: 'उज्जैन के प्रतिष्ठित गुरुकुल से शिक्षित, आचार्य जी को वैदिक अनुष्ठान, ज्योतिष, वास्तु शास्त्र और कर्मकांड में 20 से अधिक वर्षों का गहन अनुभव है।',
          },
        });
      }

      return reply.send({ success: true, about });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to fetch about details' });
    }
  });

  // 2. PUT Update About Details (Admin)
  server.put('/', async (request, reply) => {
    const body = request.body as {
      name: string;
      image?: string;
      descriptionEn: string;
      descriptionHi?: string;
      yearsExp: number;
      pujasDone: number;
      whatsappNo: string;
    };

    try {
      const updated = await prisma.aboutSection.upsert({
        where: { id: 'default_about' },
        update: {
          name: body.name,
          image: body.image || null,
          descriptionEn: body.descriptionEn,
          descriptionHi: body.descriptionHi || null,
          yearsExp: Number(body.yearsExp),
          pujasDone: Number(body.pujasDone),
          whatsappNo: body.whatsappNo,
        },
        create: {
          id: 'default_about',
          name: body.name,
          image: body.image || null,
          descriptionEn: body.descriptionEn,
          descriptionHi: body.descriptionHi || null,
          yearsExp: Number(body.yearsExp),
          pujasDone: Number(body.pujasDone),
          whatsappNo: body.whatsappNo,
        },
      });

      return reply.send({ success: true, message: 'About section updated successfully', about: updated });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to update about details' });
    }
  });
}