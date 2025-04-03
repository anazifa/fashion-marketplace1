import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface DailySales {
  [date: string]: {
    sales: number;
    revenue: number;
    orders: number;
  };
}

interface CategoryPerformance {
  [category: string]: {
    sales: number;
    revenue: number;
    items: number;
  };
}

interface AnalyticsData {
  dailySales: DailySales;
  categoryPerformance: CategoryPerformance;
  totalOrders: number;
  totalRevenue: number;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params: { startDate?: string; endDate?: string } = {};
      
      if (dateRange) {
        params.startDate = dateRange[0]?.format('YYYY-MM-DD');
        params.endDate = dateRange[1]?.format('YYYY-MM-DD');
      }

      const response = await axios.get('/api/seller/analytics', { params });
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>No data available</div>;

  // Transform daily sales data for the chart
  const salesData = Object.entries(data.dailySales).map(([date, stats]) => ({
    date,
    sales: stats.sales,
    revenue: stats.revenue,
    orders: stats.orders,
  }));

  // Transform category performance data for the chart
  const categoryData = Object.entries(data.categoryPerformance).map(([category, stats]) => ({
    category,
    sales: stats.sales,
    revenue: stats.revenue,
    items: stats.items,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          className="border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Total Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{data.totalOrders}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daily Sales Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="#ffc658" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              <Bar dataKey="items" fill="#ffc658" name="Items" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 