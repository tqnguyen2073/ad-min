import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Tooltip,
  Badge,
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Form,
  message,
  notification
} from 'antd';
import { 
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Camera {
  camera_id: string;
  camera_name: string;
}

interface AddCameraForm {
  name: string;
  location: string;
  ip: string;
}

const API_BASE_URL = 'http://localhost:3636/api';

const CameraManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addCameraForm] = Form.useForm();
  const [addingCamera, setAddingCamera] = useState(false);

  // Fetch cameras from API
  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cameras`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCameras(data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
      message.error('Failed to fetch cameras from server');
      // Fallback to empty array if API is not available
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new camera
  const addCamera = async (values: AddCameraForm) => {
    setAddingCamera(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cameras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camera_name: values.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCamera = await response.json();
      setCameras(prev => [...prev, newCamera]);
      message.success('Camera added successfully');
      setIsAddModalVisible(false);
      addCameraForm.resetFields();
    } catch (error) {
      console.error('Error adding camera:', error);
      message.error('Failed to add camera');
    } finally {
      setAddingCamera(false);
    }
  };

  // Delete camera
  const deleteCamera = async (cameraId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCameras(prev => prev.filter(camera => camera.camera_id !== cameraId));
      message.success('Camera deleted successfully');
    } catch (error) {
      console.error('Error deleting camera:', error);
      message.error('Failed to delete camera');
    }
  };

  // Load cameras on component mount
  useEffect(() => {
    fetchCameras();
  }, []);

  const handleRefresh = () => {
    fetchCameras();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge status="default" text="Unknown" />;
    }
    return (
      <Badge 
        status={getStatusColor(status) as any} 
        text={status.charAt(0).toUpperCase() + status.slice(1)} 
      />
    );
  };

  const getActionMenu = (record: Camera) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        View Camera
      </Menu.Item>
      <Menu.Item key="play" icon={<PlayCircleOutlined />}>
        Start Recording
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />} 
        danger
        onClick={() => {
          Modal.confirm({
            title: 'Delete Camera',
            content: `Are you sure you want to delete camera "${record.camera_name || 'Unnamed Camera'}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteCamera(record.camera_id),
          });
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );
  
  const columns = [
    {
      title: 'Camera',
      dataIndex: 'camera_name',
      key: 'camera_name',
      render: (text: string, record: Camera) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text || 'Unnamed Camera'}</Text>
          <Text type="secondary" className="text-xs">Unknown Location</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Badge status="default" text="Unknown" />,
      filters: [
        { text: 'Online', value: 'online' },
        { text: 'Offline', value: 'offline' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: () => true,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: () => <Text code>Unknown</Text>,
    },
    {
      title: 'Last Seen',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: () => <Text type="secondary">Unknown</Text>,
    },
    {
      title: 'Recording',
      dataIndex: 'recording',
      key: 'recording',
      render: () => (
        <Tag color="default">
          Unknown
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Camera) => (
        <Space>
          <Tooltip title="View Camera">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="Start Recording">
            <Button 
              type="text" 
              icon={<PlayCircleOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Settings">
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              size="small"
            />
          </Tooltip>
          <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              size="small"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];
  
  const filteredData = cameras.filter(camera => {
    const matchesSearch = 
      (camera.camera_name?.toLowerCase() || '').includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all'; // Since we don't have status data, show all
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2}>Camera Management</Title>
          <Text type="secondary">
            Manage and monitor your camera network
          </Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddCamera}
          >
            Add Camera
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card>
        <Space wrap>
          <Search
            placeholder="Search cameras..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">All Status</Option>
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
            <Option value="maintenance">Maintenance</Option>
          </Select>
          <Button icon={<FilterOutlined />}>
            More Filters
          </Button>
        </Space>
      </Card>

      {/* Camera table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="camera_id"
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} cameras`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: 'No cameras found. Add your first camera to get started.',
          }}
        />
      </Card>

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
          onFinish={addCamera}
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
    </div>
  );
};

export default CameraManagement; 