# 📹 Camera Admin Dashboard

A modern, responsive admin dashboard for camera management built with **React**, **TypeScript**, **Ant Design**, and **Tailwind CSS**.

![Dashboard Preview](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12-blue?logo=ant-design)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue?logo=tailwind-css)

## ✨ Features

- 🔐 **Professional Authentication** - Secure login with Ant Design forms
- 📊 **Interactive Dashboard** - Statistics cards, pie charts, and system health monitoring
- 📹 **Advanced Camera Management** - Table with sorting, filtering, and bulk operations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Enterprise UI/UX** - Beautiful Ant Design components with consistent design language
- 📈 **Real-time Statistics** - Live camera status and system health monitoring
- 🔍 **Smart Search & Filter** - Advanced filtering and search capabilities
- 📋 **Activity Logs** - Recent system activities with status indicators
- 🎯 **Accessibility** - Built-in accessibility features for better user experience

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
```bash
cd ad-min
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Open your browser and navigate to `http://localhost:3000`**

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin`

## 🎨 UI/UX Improvements with Ant Design

### ✨ Enhanced Components

| Component | Before | After |
|-----------|--------|-------|
| **Login** | Basic form | Professional Ant Design form with validation |
| **Layout** | Custom sidebar | Collapsible sidebar with dark theme |
| **Dashboard** | Custom cards | Ant Design Statistic cards with icons |
| **Tables** | HTML table | Ant Design Table with sorting/filtering |
| **Forms** | Basic inputs | Ant Design Form with validation |
| **Navigation** | Custom menu | Ant Design Menu with active states |

### 🎯 Key UI/UX Features

- **Professional Design**: Enterprise-grade components
- **Consistent Theming**: Unified color scheme and spacing
- **Interactive Elements**: Hover effects, loading states, animations
- **Better Typography**: Ant Design Text components
- **Status Indicators**: Badges, tags, and progress bars
- **Responsive Grid**: Ant Design Row/Col system
- **Accessibility**: Built-in ARIA support

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard with Ant Design stats
│   ├── Login.tsx       # Ant Design authentication form
│   ├── Layout.tsx      # Ant Design layout with sidebar
│   └── CameraManagement.tsx # Ant Design table interface
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── App.tsx            # Main app component
└── index.tsx          # Entry point
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Ant Design 5.12** - Professional UI component library
- **@ant-design/icons** - Beautiful icon set
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Chart.js** - Interactive charts and graphs
- **React Chart.js 2** - Chart.js integration for React

## 📊 Dashboard Features

### Statistics Cards
- Total Cameras count with icons
- Active Cameras status with color coding
- Offline Cameras alerts
- System Health percentage with progress

### Interactive Charts
- Camera status distribution pie chart
- Color-coded status indicators
- Hover effects and tooltips

### System Monitoring
- CPU, Memory, Storage usage
- Network status indicators
- Real-time performance metrics

### Recent Activity
- Real-time system events
- Camera status changes
- Motion detection alerts
- Connection issues with status tags

## 📹 Camera Management

### Advanced Table Features
- **Search & Filter**: Find cameras by name, location, or IP
- **Status Monitoring**: Real-time online/offline status with badges
- **Bulk Operations**: Manage multiple cameras at once
- **Action Menus**: Dropdown menus for each camera
- **Pagination**: Handle large datasets efficiently
- **Sorting**: Sort by any column
- **Responsive**: Works on all screen sizes

### Camera Information
- Camera name and location
- IP address with code formatting
- Last seen timestamp
- Recording status with tags
- Connection health indicators

## 🎨 Customization

### Theme Customization
```css
/* Modify Ant Design theme in src/index.css */
.ant-layout-sider {
  background: #001529;
}

.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Component Customization
- Modify any Ant Design component props
- Use custom CSS classes with Tailwind
- Override Ant Design styles as needed

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding New Features

1. **New Pages**: Add routes in `App.tsx`
2. **New Components**: Create in `src/components/`
3. **Styling**: Use Ant Design + Tailwind CSS
4. **Icons**: Import from `@ant-design/icons`

## 🔒 Security

- Default credentials are for development only
- Implement proper authentication for production
- Use environment variables for sensitive data
- Enable HTTPS in production

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**🎉 Enjoy your professional Camera Admin Dashboard with Ant Design!**