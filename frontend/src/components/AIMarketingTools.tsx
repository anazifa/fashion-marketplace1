import React, { useState } from 'react';
import axios from 'axios';

interface AIMarketingToolsProps {
  productId: string;
  productName: string;
  brandName: string;
  price: number;
}

export const AIMarketingTools: React.FC<AIMarketingToolsProps> = ({
  productId,
  productName,
  brandName,
  price,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const generateDescription = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:3001/api/ai/generate-description', {
        productName,
        brandName,
      });
      setGeneratedContent({ type: 'description', content: response.data.description });
    } catch (err) {
      setError('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const generateSocialMedia = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:3001/api/ai/generate-social-media', {
        productName,
        brandName,
        price,
      });
      setGeneratedContent({ type: 'social', content: response.data.posts });
    } catch (err) {
      setError('Failed to generate social media content');
    } finally {
      setLoading(false);
    }
  };

  const analyzePerformance = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:3001/api/ai/analyze-product/${productId}`);
      setGeneratedContent({ type: 'analysis', content: response.data });
    } catch (err) {
      setError('Failed to analyze product performance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Marketing Tools</h2>
      
      <div className="space-y-4">
        <button
          onClick={generateDescription}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Generate Product Description
        </button>

        <button
          onClick={generateSocialMedia}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Generate Social Media Posts
        </button>

        <button
          onClick={analyzePerformance}
          disabled={loading}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          Analyze Performance
        </button>

        {loading && <div className="text-center">Generating...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {generatedContent && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-2">
              {generatedContent.type === 'description' && 'Generated Description'}
              {generatedContent.type === 'social' && 'Social Media Posts'}
              {generatedContent.type === 'analysis' && 'Performance Analysis'}
            </h3>
            
            {generatedContent.type === 'description' && (
              <p className="whitespace-pre-wrap">{generatedContent.content}</p>
            )}
            
            {generatedContent.type === 'social' && (
              <div className="space-y-4">
                {generatedContent.content.map((post: string, index: number) => (
                  <div key={index} className="p-3 bg-white rounded shadow">
                    {post}
                  </div>
                ))}
              </div>
            )}
            
            {generatedContent.type === 'analysis' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold">Total Sales</div>
                    <div>{generatedContent.content.metrics.totalSales}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Average Rating</div>
                    <div>{generatedContent.content.metrics.averageRating.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Reviews</div>
                    <div>{generatedContent.content.metrics.reviewCount}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-bold mb-2">AI Insights</div>
                  <p className="whitespace-pre-wrap">{generatedContent.content.insights}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 