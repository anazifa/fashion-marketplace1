import express from 'express';
import { AIService } from '../services/aiService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate product description
router.post('/generate-description', authenticateToken, async (req, res) => {
  try {
    const { productName, brandName } = req.body;
    const description = await AIService.generateProductDescription(productName, brandName);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate product description' });
  }
});

// Generate social media copy
router.post('/generate-social-media', authenticateToken, async (req, res) => {
  try {
    const { productName, brandName, price } = req.body;
    const posts = await AIService.generateSocialMediaCopy(productName, brandName, price);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate social media copy' });
  }
});

// Analyze product performance
router.get('/analyze-product/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const analysis = await AIService.analyzeProductPerformance(productId);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze product performance' });
  }
});

// Get personalized product recommendations
router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await AIService.generateProductRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router; 