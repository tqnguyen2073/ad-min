import React, { useState } from 'react';
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
  Dropdown,
  Menu,
  Modal,
  Form,
  List
} from 'antd';
import { 
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useCamera } from '../contexts/CameraContext';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface AddCameraForm {
  name: string;
  location: string;
  ip: string;
}

interface Camera {
  camera_id: string;
  camera_name: string;
  created_at?: string;
}

const CameraManagement: React.FC = () => {
  const { cameras, recentActivity, logs, loading, addingCamera, fetchCameras, addCamera, deleteCamera } = useCamera();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLogsModalVisible, setIsLogsModalVisible] = useState(false);
  const [addCameraForm] = Form.useForm<AddCameraForm>();

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

  const handleViewLogs = () => {
    setIsLogsModalVisible(true);
  };

  const handleAddCameraSubmit = async (values: AddCameraForm) => {
    await addCamera(values);
    setIsAddModalVisible(false);
    addCameraForm.resetFields();
  };



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
      render: (_: unknown, record: Camera) => (
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
          <Button 
            icon={<FileTextOutlined />}
            onClick={handleViewLogs}
          >
            View Logs
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

      {/* Camera table and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera table */}
        <div className="lg:col-span-2">
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
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card title="Recent Activity">
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
        </div>
      </div>

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

export default CameraManagement; 