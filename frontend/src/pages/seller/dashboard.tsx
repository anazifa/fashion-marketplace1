import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, Table, Tabs } from 'antd';
import { DollarOutlined, ShoppingOutlined, StarOutlined, ShopOutlined } from '@ant-design/icons';
import Analytics from '../../components/seller/Analytics';
import AIMarketingTools from '../../components/seller/AIMarketingTools';

interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  averageRating: number;
  totalOrders: number;
  revenue: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
  reviews: number;
  brand: {
    name: string;
  };
  price: number;
}

const { TabPane } = Tabs;

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, productsResponse] = await Promise.all([
        axios.get('/api/seller/stats'),
        axios.get('/api/seller/top-products'),
      ]);
      setStats(statsResponse.data);
      setTopProducts(productsResponse.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Brand',
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toFixed(2)}`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span>
          <StarOutlined style={{ color: '#faad14' }} /> {rating.toFixed(1)}
        </span>
      ),
    },
    {
      title: 'Reviews',
      dataIndex: 'reviews',
      key: 'reviews',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductPerformance) => (
        <a onClick={() => setSelectedProduct(record.id)}>View Details</a>
      ),
    },
  ];

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.revenue}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={stats.averageRating}
              precision={1}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Analytics" key="1">
          <Analytics />
        </TabPane>
        <TabPane tab="Top Products" key="2">
          <Card title="Top Performing Products">
            <Table
              columns={columns}
              dataSource={topProducts}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>

      {selectedProduct && (
        <div className="mt-6">
          <AIMarketingTools productId={selectedProduct} />
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 