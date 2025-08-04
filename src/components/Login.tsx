import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Alert,
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  CameraOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const success = await login(values.username, values.password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md px-4">
        <Card 
          className="shadow-2xl border-0"
          bodyStyle={{ padding: '40px' }}
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CameraOutlined className="text-2xl text-blue-600" />
            </div>
            <Title level={2} className="mb-2">
              Camera Admin Dashboard
            </Title>
            <Text type="secondary">
              Sign in to your admin account
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                autoComplete="current-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-medium"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary" className="text-xs">
              Default credentials: admin / admin
            </Text>
          </Divider>

          <div className="text-center">
            <Space direction="vertical" size="small">
              <Text type="secondary" className="text-xs">
                For demonstration purposes only
              </Text>
              <Text type="secondary" className="text-xs">
                © 2024 Camera Admin Dashboard
              </Text>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login; 