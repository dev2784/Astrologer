import { FastifyInstance } from 'fastify';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Configure Cloudinary explicitly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadRoutes(server: FastifyInstance) {
  server.post('/', async (request, reply) => {
    // Safety check: ensure env vars exist
    if (!process.env.CLOUDINARY_API_KEY) {
      console.error('Cloudinary API key is missing in process.env!');
      return reply.code(500).send({ error: 'Cloudinary credentials missing' });
    }

    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    const buffer = await data.toBuffer();

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'pujas' },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return resolve(reply.code(500).send({ error: 'Cloudinary upload failed' }));
          }
          return resolve(reply.code(201).send({ url: result.secure_url }));
        }
      );
      uploadStream.end(buffer);
    });
  });
}