import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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
  Progress,
  Divider
} from 'antd';
import { 
  CameraOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';

const { Title: AntTitle, Text } = Typography;

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard: React.FC = () => {
  // Mock data for statistics
  const stats = [
    {
      title: 'Total Cameras',
      value: 24,
      prefix: <CameraOutlined />,
      suffix: '+2.5%',
      color: '#1890ff',
    },
    {
      title: 'Active Cameras',
      value: 22,
      prefix: <EyeOutlined />,
      suffix: '+1.2%',
      color: '#52c41a',
    },
    {
      title: 'Offline Cameras',
      value: 2,
      prefix: <ExclamationCircleOutlined />,
      suffix: '-0.8%',
      color: '#ff4d4f',
    },
    {
      title: 'System Health',
      value: 91.7,
      prefix: <CheckCircleOutlined />,
      suffix: '%',
      suffix2: '+0.3%',
      color: '#722ed1',
    },
  ];

  // Mock data for pie chart
  const pieChartData = {
    labels: ['Online', 'Offline', 'Maintenance', 'Recording'],
    datasets: [
      {
        data: [22, 2, 1, 18],
        backgroundColor: [
          '#52c41a', // Green
          '#ff4d4f', // Red
          '#faad14', // Yellow
          '#1890ff', // Blue
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Camera Status Distribution',
        font: {
          size: 16,
        },
      },
    },
  };

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      camera: 'Camera-001',
      event: 'Motion detected',
      time: '2 minutes ago',
      status: 'success',
      icon: <PlayCircleOutlined style={{ color: '#52c41a' }} />,
    },
    {
      id: 2,
      camera: 'Camera-015',
      event: 'Connection restored',
      time: '5 minutes ago',
      status: 'success',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    },
    {
      id: 3,
      camera: 'Camera-008',
      event: 'Storage full',
      time: '12 minutes ago',
      status: 'warning',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    },
    {
      id: 4,
      camera: 'Camera-022',
      event: 'Offline',
      time: '1 hour ago',
      status: 'error',
      icon: <PauseCircleOutlined style={{ color: '#ff4d4f' }} />,
    },
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success">Success</Tag>;
      case 'warning':
        return <Tag color="warning">Warning</Tag>;
      case 'error':
        return <Tag color="error">Error</Tag>;
      default:
        return <Tag>Info</Tag>;
    }
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
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
              {stat.suffix2 && (
                <Text type="secondary" className="text-sm">
                  {stat.suffix2}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and activity section */}
      <Row gutter={[16, 16]}>
        {/* Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Camera Status Distribution">
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            extra={<Button type="link">View All</Button>}
          >
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={
                      <Space>
                        <Text strong>{item.camera}</Text>
                        {getStatusTag(item.status)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{item.event}</Text>
                        <Text type="secondary" className="text-xs">
                          <ClockCircleOutlined /> {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="System Performance">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>CPU Usage</Text>
                <Progress percent={45} status="active" />
              </div>
              <div>
                <Text>Memory Usage</Text>
                <Progress percent={68} status="active" />
              </div>
              <div>
                <Text>Storage Usage</Text>
                <Progress percent={82} status="exception" />
              </div>
              <div>
                <Text>Network Status</Text>
                <Progress percent={95} status="success" />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="large" 
                block
              >
                Add Camera
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                size="large" 
                block
              >
                View Logs
              </Button>
              <Button 
                icon={<UserOutlined />} 
                size="large" 
                block
              >
                Manage Users
              </Button>
              <Button 
                icon={<BarChartOutlined />} 
                size="large" 
                block
              >
                Analytics
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 