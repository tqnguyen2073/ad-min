import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Card,
  Row, 
  Col, 
  Statistic, 
  Typography, 
  List, 
  Tag, 
  Button, 
  Space,
  Modal,
  Form,
  Input
} from 'antd';
import { 
  CameraOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useCamera } from '../contexts/CameraContext';

const { Title: AntTitle, Text } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AddCameraFormValues {
  name: string;
  location: string;
  ip: string;
}

const Dashboard: React.FC = () => {
  const { cameras, recentActivity, logs, dailyCameraCounts, addingCamera, addCamera } = useCamera();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLogsModalVisible, setIsLogsModalVisible] = useState(false);
  const [addCameraForm] = Form.useForm<AddCameraFormValues>();

  // Mock data for statistics
  const stats = [
    {
      title: 'Total Cameras',
      value: cameras.length,
      prefix: <CameraOutlined />,
      suffix: '+2.5%',
      color: '#1890ff',
    },
    {
      title: 'Active Cameras',
      value: Math.floor(cameras.length * 0.9), // 90% of total
      prefix: <EyeOutlined />,
      suffix: '+1.2%',
      color: '#52c41a',
    },
    {
      title: 'Offline Cameras',
      value: Math.floor(cameras.length * 0.1), // 10% of total
      prefix: <ExclamationCircleOutlined />,
      suffix: '-0.8%',
      color: '#ff4d4f',
    },
  ];

  // Real data for line chart (cameras in storage per day from DB)
  const lineChartData = {
    labels: dailyCameraCounts.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Cameras in Storage',
        data: dailyCameraCounts.map(item => item.count),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Camera Storage Trend (Last 7 Days)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };


  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleAddCamera = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = () => {
    addCameraForm.submit();
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    addCameraForm.resetFields();
  };

  const handleViewLogs = () => {
    setIsLogsModalVisible(true);
  };

  const handleAddCameraSubmit = async (values: AddCameraFormValues) => {
    await addCamera(values);
    setIsAddModalVisible(false);
    addCameraForm.resetFields();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <AntTitle level={2}>Dashboard</AntTitle>
        <Text type="secondary">
          Overview of your camera management system
        </Text>
      </div>

      {/* Statistics cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and activity section */}
      <Row gutter={[16, 16]}>
        {/* Line Chart */}
        <Col xs={24} lg={12}>
          <Card title="Camera Storage Trend">
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            extra={<Button type="link" onClick={handleViewLogs}>View Logs</Button>}
          >
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item key={item.camera_id}>
                  <List.Item.Meta
                    avatar={<PlusOutlined style={{ color: '#52c41a' }} />}
                    title={
                      <Space>
                        <Text strong>{item.camera_name}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{formatDateTime(item.created_at)}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="large" 
                block
                onClick={handleAddCamera}
              >
                Add Camera
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                size="large" 
                block
                onClick={handleViewLogs}
              >
                View Logs
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Add Camera Modal */}
      <Modal
        title="Add New Camera"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        confirmLoading={addingCamera}
        okText="Add Camera"
        cancelText="Cancel"
      >
        <Form
          form={addCameraForm}
          layout="vertical"
          onFinish={handleAddCameraSubmit}
        >
          <Form.Item
            name="name"
            label="Camera Name"
            rules={[
              { required: true, message: 'Please enter camera name' },
              { min: 2, message: 'Camera name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter camera name" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: 'Please enter camera location' },
              { min: 2, message: 'Location must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter camera location" />
          </Form.Item>
          
          <Form.Item
            name="ip"
            label="IP Address"
            rules={[
              { required: true, message: 'Please enter IP address' },
              { 
                pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Please enter a valid IP address'
              }
            ]}
          >
            <Input placeholder="Enter IP address (e.g., 192.168.1.100)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Logs Modal */}
      <Modal
        title="Camera Creation Logs"
        open={isLogsModalVisible}
        onCancel={() => setIsLogsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLogsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        <List
          dataSource={logs}
          renderItem={(item) => (
            <List.Item key={item.camera_id + item.created_at}>
              <List.Item.Meta
                avatar={<CalendarOutlined style={{ color: '#1890ff' }} />}
                title={
                  <Space>
                    <Text strong>{item.camera_name}</Text>
                    <Tag color="blue">Created</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text>Camera ID: {item.camera_id}</Text>
                    <Text>Created by: {item.created_by}</Text>
                    <Text type="secondary">
                      <ClockCircleOutlined /> {formatDateTime(item.created_at)}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Dashboard; 