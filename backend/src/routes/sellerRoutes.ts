import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, requireSeller } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get seller dashboard stats
router.get('/stats', auth, requireSeller, async (req, res) => {
  try {
    const userId = req.user?.userId;

    // Get total revenue
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: userId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((orderSum, item) => {
          return orderSum + item.price * item.quantity;
        }, 0)
      );
    }, 0);

    // Get total orders
    const totalOrders = orders.length;

    // Get total products
    const totalProducts = await prisma.product.count({
      where: {
        sellerId: userId,
      },
    });

    // Get average rating
    const products = await prisma.product.findMany({
      where: {
        sellerId: userId,
      },
      include: {
        reviews: true,
      },
    });

    const averageRating =
      products.reduce((sum, product) => {
        return (
          sum +
          product.reviews.reduce((reviewSum, review) => {
            return reviewSum + review.rating;
          }, 0) /
            (product.reviews.length || 1)
        );
      }, 0) / (products.length || 1);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      averageRating,
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ error: 'Failed to fetch seller stats' });
  }
});

// Get top performing products
router.get('/top-products', auth, requireSeller, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const products = await prisma.product.findMany({
      where: {
        sellerId: userId,
      },
      include: {
        orderItems: {
          include: {
            order: true,
          },
        },
        reviews: true,
      },
    });

    const productPerformance = products.map((product) => {
      const totalSales = product.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalRevenue = product.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const averageRating =
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        (product.reviews.length || 1);

      return {
        id: product.id,
        name: product.name,
        totalSales,
        totalRevenue,
        averageRating,
      };
    });

    // Sort by total revenue
    productPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Get top 5 products
    res.json(productPerformance.slice(0, 5));
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Get sales analytics
router.get('/analytics', auth, requireSeller, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              brand: {
                userId: userId,
              },
            },
          },
        },
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate daily sales
    const dailySales = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          sales: 0,
          revenue: 0,
          orders: 0,
        };
      }
      acc[date].sales += order.items.reduce((sum, item) => sum + item.quantity, 0);
      acc[date].revenue += order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { sales: number; revenue: number; orders: number }>);

    // Calculate category performance
    const categoryPerformance = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const category = item.product.category.name;
        if (!acc[category]) {
          acc[category] = {
            sales: 0,
            revenue: 0,
            items: 0,
          };
        }
        acc[category].sales += item.quantity;
        acc[category].revenue += item.price * item.quantity;
        acc[category].items += 1;
      });
      return acc;
    }, {} as Record<string, { sales: number; revenue: number; items: number }>);

    res.json({
      dailySales,
      categoryPerformance,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router; 