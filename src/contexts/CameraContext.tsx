import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';

interface Camera {
  camera_id: string;
  camera_name: string;
  created_at?: string;
  ipaddress?: string;
  location_name?: string;
}

interface CameraLog {
  camera_id: string;
  camera_name: string;
  created_at: string;
  event: string;
  created_by: string;
}

interface DailyCameraCount {
  date: string;
  count: number;
}

interface AddCameraForm {
  name: string;
  location: string;
  ip: string;
}

interface CameraContextType {
  cameras: Camera[];
  recentActivity: CameraLog[];
  logs: CameraLog[];
  dailyCameraCounts: DailyCameraCount[];
  loading: boolean;
  addingCamera: boolean;
  fetchCameras: () => Promise<void>;
  addCamera: (values: AddCameraForm) => Promise<void>;
  deleteCamera: (cameraId: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3636/api';

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};

interface CameraProviderProps {
  children: ReactNode;
}

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to generate last 7 days of dates
const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(getDateString(date));
  }
  return dates;
};

// Helper function to calculate daily camera counts
const calculateDailyCameraCounts = (cameras: Camera[]): DailyCameraCount[] => {
  const last7Days = getLast7Days();
  const counts: DailyCameraCount[] = [];

  last7Days.forEach(date => {
    // Count all cameras created on or before this date
    const camerasOnDate = cameras.filter(camera => {
      if (!camera.created_at) return false;
      const cameraDate = getDateString(new Date(camera.created_at));
      return cameraDate <= date;
    });
    counts.push({
      date,
      count: camerasOnDate.length
    });
  });

  return counts;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [recentActivity, setRecentActivity] = useState<CameraLog[]>([]);
  const [logs, setLogs] = useState<CameraLog[]>([]);
  const [dailyCameraCounts, setDailyCameraCounts] = useState<DailyCameraCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingCamera, setAddingCamera] = useState(false);

  // Update daily camera counts when cameras change
  useEffect(() => {
    const counts = calculateDailyCameraCounts(cameras);
    setDailyCameraCounts(counts);
  }, [cameras]);

  // Fetch cameras from API
  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cameras`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure each camera has ipaddress and location_name
      setCameras(data.map((cam: any) => ({
        ...cam,
        ipaddress: cam.ipaddress || '',
        location_name: cam.location_name || '',
      })));
    } catch (error) {
      console.error('Error fetching cameras:', error);
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
          ipaddress: values.ip,
          location_name: values.location,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCamera = await response.json();
      setCameras(prev => [...prev, {
        ...newCamera,
        ipaddress: newCamera.ipaddress || '',
        location_name: newCamera.location_name || '',
      }]);
      message.success('Camera added successfully');

      // Add to recent activity and logs in memory
      const now = new Date();
      const logEntry: CameraLog = {
        camera_id: newCamera.camera_id,
        camera_name: newCamera.camera_name || 'Unnamed Camera',
        created_at: now.toISOString(),
        event: 'Camera created',
        created_by: 'admin',
      };
      setRecentActivity(prev => [logEntry, ...prev].slice(0, 5));
      setLogs(prev => [logEntry, ...prev]);
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

  const value: CameraContextType = {
    cameras,
    recentActivity,
    logs,
    dailyCameraCounts,
    loading,
    addingCamera,
    fetchCameras,
    addCamera,
    deleteCamera,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
};
