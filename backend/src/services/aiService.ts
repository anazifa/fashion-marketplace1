import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  // Generate product descriptions using AI
  static async generateProductDescription(productName: string, brandName: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional fashion product description writer. Create engaging, SEO-friendly descriptions."
          },
          {
            role: "user",
            content: `Write a compelling product description for ${productName} by ${brandName}. Include key features, materials, and style notes.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating product description:', error);
      throw new Error('Failed to generate product description');
    }
  }

  // Generate marketing copy for social media
  static async generateSocialMediaCopy(productName: string, brandName: string, price: number): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a social media marketing expert. Create engaging posts for Instagram, Twitter, and Facebook."
          },
          {
            role: "user",
            content: `Create 3 different social media posts promoting ${productName} by ${brandName} priced at $${price}.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      return completion.choices[0].message.content?.split('\n\n') || [];
    } catch (error) {
      console.error('Error generating social media copy:', error);
      throw new Error('Failed to generate social media copy');
    }
  }

  // Analyze product performance and provide recommendations
  static async analyzeProductPerformance(productId: string): Promise<any> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          reviews: true,
          orderItems: true,
        },
      });

      if (!product) throw new Error('Product not found');

      // Calculate key metrics
      const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
      const reviewCount = product.reviews.length;

      // Generate AI insights
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a fashion retail analytics expert. Provide actionable insights based on product performance data."
          },
          {
            role: "user",
            content: `Analyze the following product performance data and provide recommendations:
              Product: ${product.name}
              Total Sales: ${totalSales}
              Average Rating: ${averageRating}
              Review Count: ${reviewCount}
              Price: $${product.price}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return {
        metrics: {
          totalSales,
          averageRating,
          reviewCount,
        },
        insights: completion.choices[0].message.content,
      };
    } catch (error) {
      console.error('Error analyzing product performance:', error);
      throw new Error('Failed to analyze product performance');
    }
  }

  // Generate personalized product recommendations
  static async generateProductRecommendations(userId: string): Promise<any[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: {
                    include: {
                      category: true,
                      brand: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) throw new Error('User not found');

      // Analyze user's purchase history
      const categories = new Map();
      const brands = new Map();

      user.orders.forEach(order => {
        order.items.forEach(item => {
          const category = item.product.category.name;
          const brand = item.product.brand.name;
          
          categories.set(category, (categories.get(category) || 0) + 1);
          brands.set(brand, (brands.get(brand) || 0) + 1);
        });
      });

      // Find similar products
      const recommendedProducts = await prisma.product.findMany({
        where: {
          OR: [
            { category: { name: { in: Array.from(categories.keys()) } } },
            { brand: { name: { in: Array.from(brands.keys()) } } },
          ],
        },
        include: {
          brand: true,
          category: true,
        },
        take: 10,
      });

      return recommendedProducts;
    } catch (error) {
      console.error('Error generating product recommendations:', error);
      throw new Error('Failed to generate product recommendations');
    }
  }
} 