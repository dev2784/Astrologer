import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';
import { cleanRichText, cleanPuja } from '../../rich-text';

export async function pujaRoutes(server: FastifyInstance) {
  
  // 1. Get Pujas with search, batch loading (load more), and sorting
  server.get('/', async (request, reply) => {
    const { search = '', skip = '0', take = '10', subcategoryId } = request.query as {
      search?: string;
      subcategoryId?: string;
      skip?: string;
      take?: string;
    };

    const skipNum = Math.max(0, parseInt(skip, 10) || 0);
    const takeNum = Math.min(100, Math.max(1, parseInt(take, 10) || 10));

    const whereClause: any = {};
    if (subcategoryId) whereClause.subcategoryId = subcategoryId;
    if (search && search.trim().length >= 3) {
      const term = search.trim();
      whereClause.OR = [
        { titleEn: { contains: term, mode: 'insensitive' } },
        { titleHi: { contains: term, mode: 'insensitive' } },
        { placeOfPuja: { contains: term, mode: 'insensitive' } },
      ];
    }

    try {
      const [pujas, total] = await Promise.all([
        prisma.puja.findMany({
          where: whereClause,
          include: { category: true, subcategory: true, faqs: true },
          skip: skipNum,
          take: takeNum,
          orderBy: { titleEn: 'asc' },
        }),
        prisma.puja.count({ where: whereClause }),
      ]);

      return reply.send({ pujas: pujas.map(cleanPuja), total, hasMore: skipNum + pujas.length < total });
    } catch (error) {
      console.error('Fetch pujas error:', error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 2. Get Single Puja by ID
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const puja = await prisma.puja.findUnique({
        where: { id },
        include: {
          category: true,
          subcategory: true,
          faqs: true,
        },
      });

      if (!puja) {
        return reply.code(404).send({ error: 'Puja not found' });
      }

      return reply.send({ puja: cleanPuja(puja) });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 3. Create Puja
  server.post('/', async (request, reply) => {
    const body = request.body as any;
    const slug = body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      const puja = await prisma.puja.create({
        data: {
          titleEn: body.titleEn,
          titleHi: body.titleHi,
          slug,
          categoryId: body.categoryId,
          subcategoryId: body.subcategoryId || null,
          imageUrl: body.imageUrl || null,
          placeOfPuja: body.placeOfPuja,
          noOfYajman: body.noOfYajman,
          estimatedTime: body.estimatedTime,
          charges: body.charges, // <--- Include charges
          samagri: cleanRichText(body.samagri),
          about: cleanRichText(body.about),
          benefits: cleanRichText(body.benefits),
          faqs: {
            create: (body.faqs || []).map((faq: any) => ({
              questionEn: faq.questionEn,
              answerEn: faq.answerEn,
              questionHi: faq.questionHi || '',
              answerHi: faq.answerHi || '',
            })),
          },
        },
        include: { faqs: true },
      });
      return reply.code(201).send({ message: 'Puja created successfully', puja });
    } catch (error) {
      console.error('Create puja error:', error);
      return reply.code(400).send({ error: 'Failed to create puja.' });
    }
  });

  // 4. Update Puja
  server.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    try {
      // FAQ replacement is nested in the update: all changes commit or roll back together.

      const puja = await prisma.puja.update({
        where: { id },
        data: {
          titleEn: body.titleEn,
          titleHi: body.titleHi,
          slug: body.titleEn ? body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined,
          categoryId: body.categoryId,
          subcategoryId: body.subcategoryId || null,
          imageUrl: body.imageUrl || null,
          placeOfPuja: body.placeOfPuja,
          noOfYajman: body.noOfYajman,
          estimatedTime: body.estimatedTime,
          charges: body.charges, // <--- Include charges
          samagri: cleanRichText(body.samagri),
          about: cleanRichText(body.about),
          benefits: cleanRichText(body.benefits),
          faqs: {
            deleteMany: {},
            create: (body.faqs || []).map((faq: any) => ({
              questionEn: faq.questionEn,
              answerEn: faq.answerEn,
              questionHi: faq.questionHi || '',
              answerHi: faq.answerHi || '',
            })),
          },
        },
        include: { faqs: true },
      });

      return reply.send({ message: 'Puja updated successfully', puja });
    } catch (error) {
      console.error('Update puja error:', error);
      return reply.code(400).send({ error: 'Failed to update puja.' });
    }
  });

  // 5. Delete Puja
  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.puja.delete({ where: { id } });
      return reply.send({ message: 'Puja deleted successfully' });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to delete puja.' });
    }
  });

  // 6. GET Puja by Slug
  server.get('/slug/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    try {
      const puja = await prisma.puja.findUnique({
        where: { slug },
        include: { category: true, subcategory: true, faqs: true },
      });

      if (!puja) return reply.code(404).send({ error: 'Puja not found' });
      return reply.send({ puja: cleanPuja(puja) });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
});
  // 7. Get pujas by subcategoryId
server.get('/subcategory/:subcategoryId', async (request, reply) => {
  const { subcategoryId } = request.params as {
    subcategoryId: string;
  };

  try {
    const pujas = await prisma.puja.findMany({
      where: { subcategoryId },
      include: {
        category: true,
        subcategory: true,
        faqs: true,
      },
    });

    if (pujas.length === 0) {
      return reply.code(404).send({
        error: 'No pujas found for this subcategory',
      });
    }

    return reply.send({ pujas: pujas.map(cleanPuja) });
  } catch (error) {
    console.error('Fetch pujas by subcategory error:', error);

    return reply.code(500).send({
      error: 'Internal Server Error',
    });
  }
});
}