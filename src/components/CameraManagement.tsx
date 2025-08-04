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
  Avatar,
  Dropdown,
  Menu
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
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  ip: string;
  lastSeen: string;
  recording: boolean;
}

const CameraManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Mock camera data
  const cameras: Camera[] = [
    {
      id: 'CAM-001',
      name: 'Front Entrance',
      location: 'Building A - Main Entrance',
      status: 'online',
      ip: '192.168.1.101',
      lastSeen: '2 minutes ago',
      recording: true,
    },
    {
      id: 'CAM-002',
      name: 'Parking Lot',
      location: 'Building A - Parking Area',
      status: 'online',
      ip: '192.168.1.102',
      lastSeen: '1 minute ago',
      recording: true,
    },
    {
      id: 'CAM-003',
      name: 'Back Door',
      location: 'Building A - Rear Exit',
      status: 'offline',
      ip: '192.168.1.103',
      lastSeen: '1 hour ago',
      recording: false,
    },
    {
      id: 'CAM-004',
      name: 'Lobby',
      location: 'Building A - Main Lobby',
      status: 'online',
      ip: '192.168.1.104',
      lastSeen: '30 seconds ago',
      recording: true,
    },
    {
      id: 'CAM-005',
      name: 'Server Room',
      location: 'Building B - IT Department',
      status: 'maintenance',
      ip: '192.168.1.105',
      lastSeen: '5 minutes ago',
      recording: false,
    },
    {
      id: 'CAM-006',
      name: 'Loading Dock',
      location: 'Building B - Loading Area',
      status: 'online',
      ip: '192.168.1.106',
      lastSeen: '45 seconds ago',
      recording: true,
    },
  ];

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
      <Menu.Item key="play" icon={record.recording ? <PauseCircleOutlined /> : <PlayCircleOutlined />}>
        {record.recording ? 'Pause Recording' : 'Start Recording'}
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Camera',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Camera) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" className="text-xs">{record.location}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
      filters: [
        { text: 'Online', value: 'online' },
        { text: 'Offline', value: 'offline' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value: boolean | React.Key, record: Camera) => record.status === value,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Last Seen',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Recording',
      dataIndex: 'recording',
      key: 'recording',
      render: (recording: boolean) => (
        <Tag color={recording ? 'success' : 'default'}>
          {recording ? 'Yes' : 'No'}
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
          <Tooltip title={record.recording ? 'Pause Recording' : 'Start Recording'}>
            <Button 
              type="text" 
              icon={record.recording ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="small"
              style={{ color: record.recording ? '#ff4d4f' : '#52c41a' }}
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
      camera.name.toLowerCase().includes(searchText.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchText.toLowerCase()) ||
      camera.ip.includes(searchText);
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
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
            onClick={() => setLoading(true)}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
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
          rowKey="id"
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
        />
      </Card>
    </div>
  );
};

export default CameraManagement; 