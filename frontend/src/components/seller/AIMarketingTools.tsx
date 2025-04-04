import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Space, message, Spin, Typography } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface AIMarketingToolsProps {
  productId: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
}

const AIMarketingTools: React.FC<AIMarketingToolsProps> = ({ productId }) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    description?: string;
    socialPost?: string;
    emailCampaign?: string;
  }>({});

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      message.error('Failed to fetch product data');
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (type: 'description' | 'socialPost' | 'emailCampaign') => {
    if (!product) return;

    try {
      setLoading(true);
      const response = await axios.post('/api/ai/generate-content', {
        type,
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        },
      });

      setGeneratedContent(prev => ({
        ...prev,
        [type]: response.data.content,
      }));

      message.success(`Generated ${type} successfully!`);
    } catch (error) {
      message.error(`Failed to generate ${type}`);
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  if (!product) return <Spin />;

  return (
    <div className="space-y-6">
      <Title level={2}>AI Marketing Tools</Title>
      <Text>Enhance your product marketing with AI-generated content</Text>

      <Card title="Product Description Enhancement" className="mb-4">
        <Space direction="vertical" className="w-full">
          <Text>Current description:</Text>
          <TextArea
            value={product.description}
            rows={4}
            readOnly
            className="mb-4"
          />
          <Button
            type="primary"
            onClick={() => generateContent('description')}
            loading={loading}
          >
            Generate Enhanced Description
          </Button>
          {generatedContent.description && (
            <div className="mt-4">
              <Text strong>AI-Generated Description:</Text>
              <TextArea
                value={generatedContent.description}
                rows={4}
                readOnly
                className="mb-2"
              />
              <Button
                size="small"
                onClick={() => copyToClipboard(generatedContent.description!)}
              >
                Copy
              </Button>
            </div>
          )}
        </Space>
      </Card>

      <Card title="Social Media Content" className="mb-4">
        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            onClick={() => generateContent('socialPost')}
            loading={loading}
          >
            Generate Social Media Post
          </Button>
          {generatedContent.socialPost && (
            <div className="mt-4">
              <Text strong>AI-Generated Social Post:</Text>
              <TextArea
                value={generatedContent.socialPost}
                rows={4}
                readOnly
                className="mb-2"
              />
              <Button
                size="small"
                onClick={() => copyToClipboard(generatedContent.socialPost!)}
              >
                Copy
              </Button>
            </div>
          )}
        </Space>
      </Card>

      <Card title="Email Marketing Campaign" className="mb-4">
        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            onClick={() => generateContent('emailCampaign')}
            loading={loading}
          >
            Generate Email Campaign
          </Button>
          {generatedContent.emailCampaign && (
            <div className="mt-4">
              <Text strong>AI-Generated Email Campaign:</Text>
              <TextArea
                value={generatedContent.emailCampaign}
                rows={6}
                readOnly
                className="mb-2"
              />
              <Button
                size="small"
                onClick={() => copyToClipboard(generatedContent.emailCampaign!)}
              >
                Copy
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AIMarketingTools;
