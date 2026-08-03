import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function categoryRoutes(server: FastifyInstance) {
  
  // 1. Get categories sorted alphabetically by nameEn, with dynamic search and batch loading
  server.get('/', async (request, reply) => {
    const { search = '', skip = '0', take = '10' } = request.query as {
      search?: string;
      skip?: string;
      take?: string;
    };

    const skipNum = parseInt(skip, 10) || 0;
    const takeNum = parseInt(take, 10) || 10;

    const whereClause: any = {};
    if (search && search.trim().length >= 3) {
      const term = search.trim();
      whereClause.OR = [
        { nameEn: { contains: term, mode: 'insensitive' } },
        { nameHi: { contains: term, mode: 'insensitive' } },
        { descriptionEn: { contains: term, mode: 'insensitive' } },
        { descriptionHi: { contains: term, mode: 'insensitive' } },
        {
          subcategories: {
            some: {
              OR: [
                { nameEn: { contains: term, mode: 'insensitive' } },
                { nameHi: { contains: term, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    try {
      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          where: whereClause,
          include: { 
            subcategories: {
              orderBy: { nameEn: 'asc' } // Optional: sorts subcategories alphabetically too
            } 
          },
          skip: skipNum,
          take: takeNum,
          orderBy: { nameEn: 'asc' }, // <-- Forces ascending alphabetical order by English name
        }),
        prisma.category.count({ where: whereClause }),
      ]);

      return reply.send({ categories, total, hasMore: skipNum + categories.length < total });
    } catch (error) {
      console.error('Fetch categories error:', error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 2. Create Category
  server.post('/', async (request, reply) => {
    const body = request.body as {
      nameEn?: string;
      nameHi?: string;
      descriptionEn?: string;
      descriptionHi?: string;
    };

    if (!body.nameEn || !body.nameHi) {
      return reply.code(400).send({ error: 'Both English and Hindi names are required.' });
    }

    const slug = body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      const category = await prisma.category.create({
        data: { 
          nameEn: body.nameEn, 
          nameHi: body.nameHi, 
          slug, 
          descriptionEn: body.descriptionEn || null, 
          descriptionHi: body.descriptionHi || null 
        },
      });
      return reply.code(201).send({ message: 'Category created successfully', category });
    } catch (error) {
      return reply.code(400).send({ error: 'Category name or slug already exists in database.' });
    }
  });

  // 3. Update Category
  server.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      nameEn?: string;
      nameHi?: string;
      descriptionEn?: string;
      descriptionHi?: string;
    };

    try {
      const updateData: any = {};
      if (body.nameEn) {
        updateData.nameEn = body.nameEn;
        updateData.slug = body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (body.nameHi) updateData.nameHi = body.nameHi;
      if (body.descriptionEn !== undefined) updateData.descriptionEn = body.descriptionEn;
      if (body.descriptionHi !== undefined) updateData.descriptionHi = body.descriptionHi;

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      });
      return reply.send({ message: 'Category updated successfully', category });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to update category.' });
    }
  });

  // 4. Delete Category (Cascade deletes related subcategories if set up, or handles deletion)
  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.category.delete({ where: { id } });
      return reply.send({ message: 'Category deleted successfully' });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to delete category.' });
    }
  });

  // 5. Create Subcategory
  server.post('/subcategories', async (request, reply) => {
    const body = request.body as {
      nameEn?: string;
      nameHi?: string;
      categoryId?: string;
    };

    if (!body.nameEn || !body.nameHi || !body.categoryId) {
      return reply.code(400).send({ error: 'English name, Hindi name, and Category ID are required.' });
    }

    const slug = body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      const subcategory = await prisma.subcategory.create({
        data: { nameEn: body.nameEn, nameHi: body.nameHi, slug, categoryId: body.categoryId },
      });
      return reply.code(201).send({ message: 'Subcategory created successfully', subcategory });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to create subcategory.' });
    }
  });

  // 6. Update Subcategory
  server.put('/subcategories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      nameEn?: string;
      nameHi?: string;
    };

    try {
      const updateData: any = {};
      if (body.nameEn) {
        updateData.nameEn = body.nameEn;
        updateData.slug = body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (body.nameHi) updateData.nameHi = body.nameHi;

      const subcategory = await prisma.subcategory.update({
        where: { id },
        data: updateData,
      });
      return reply.send({ message: 'Subcategory updated successfully', subcategory });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to update subcategory.' });
    }
  });

  // 7. Delete Subcategory
  server.delete('/subcategories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.subcategory.delete({ where: { id } });
      return reply.send({ message: 'Subcategory deleted successfully' });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to delete subcategory.' });
    }
  });
}