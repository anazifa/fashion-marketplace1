import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes';
import authRoutes from './routes/authRoutes';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// AI-powered features routes
app.use('/api/ai', aiRoutes);

// Get all products
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all brands
app.get('/api/brands', async (_req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        collections: true,
      },
    });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        password, // Note: In production, hash the password before storing
        firstName,
        lastName,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 