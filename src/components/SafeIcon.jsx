// src/components/SafeIcon.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Map common icon names to their Lucide equivalents
const iconMap = {
  // Navigation
  'Menu': LucideIcons.Menu,
  'X': LucideIcons.X,
  'ArrowLeft': LucideIcons.ArrowLeft,
  'ArrowRight': LucideIcons.ArrowRight,
  'ChevronLeft': LucideIcons.ChevronLeft,
  'ChevronRight': LucideIcons.ChevronRight,
  
  // Actions
  'Plus': LucideIcons.Plus,
  'Edit': LucideIcons.Edit,
  'Edit2': LucideIcons.Edit2,
  'Trash2': LucideIcons.Trash2,
  'Save': LucideIcons.Save,
  'Check': LucideIcons.Check,
  'CheckCircle': LucideIcons.CheckCircle,
  'Circle': LucideIcons.Circle,
  'AlertCircle': LucideIcons.AlertCircle,
  'Info': LucideIcons.Info,
  'AlertTriangle': LucideIcons.AlertTriangle,
  
  // User
  'User': LucideIcons.User,
  'Users': LucideIcons.Users,
  'UserCheck': LucideIcons.UserCheck,
  'Lock': LucideIcons.Lock,
  'Key': LucideIcons.Key,
  'Mail': LucideIcons.Mail,
  'LogOut': LucideIcons.LogOut,
  
  // Dashboard
  'LayoutDashboard': LucideIcons.LayoutDashboard,
  'Home': LucideIcons.Home,
  'Settings': LucideIcons.Settings,
  'FileText': LucideIcons.FileText,
  'FileCheck': LucideIcons.FileCheck,
  'Briefcase': LucideIcons.Briefcase,
  'Zap': LucideIcons.Zap,
  'TrendingUp': LucideIcons.TrendingUp,
  'TrendingDown': LucideIcons.TrendingDown,
  'BarChart': LucideIcons.BarChart,
  'Palette': LucideIcons.Palette,
  
  // UI
  'Bell': LucideIcons.Bell,
  'Star': LucideIcons.Star,
  'Heart': LucideIcons.Heart,
  'Eye': LucideIcons.Eye,
  'EyeOff': LucideIcons.EyeOff,
  'RefreshCw': LucideIcons.RefreshCw,
  'Download': LucideIcons.Download,
  'Upload': LucideIcons.Upload,
  'Clock': LucideIcons.Clock,
  'Calendar': LucideIcons.Calendar,
  'Search': LucideIcons.Search,
  
  // Panels
  'PanelLeftClose': LucideIcons.PanelLeftClose,
  'PanelLeftOpen': LucideIcons.PanelLeftOpen,
  'Shield': LucideIcons.Shield,
  'Database': LucideIcons.Database,
  'Cloud': LucideIcons.Cloud,
  'MessageSquare': LucideIcons.MessageSquare,
};

class SafeIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.warn('Icon rendering error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Icon error details:', {
      error: error.toString(),
      props: this.props,
      errorInfo
    });
  }

  render() {
    const { name, size = 24, className = '', color, strokeWidth = 2, ...restProps } = this.props;

    // If there was an error, show a fallback
    if (this.state.hasError) {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          {...restProps}
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="2"
            stroke={color || 'currentColor'}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </svg>
      );
    }

    try {
      // Try to get icon from our map first
      let IconComponent = iconMap[name];
      
      // If not in map, try to get directly from Lucide
      if (!IconComponent && LucideIcons[name]) {
        IconComponent = LucideIcons[name];
      }
      
      // If still no icon, show a placeholder
      if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            {...restProps}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={color || 'currentColor'}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <text
              x="12"
              y="12"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={color || 'currentColor'}
            >
              ?
            </text>
          </svg>
        );
      }

      // Render the icon
      return (
        <IconComponent
          size={size}
          className={className}
          color={color}
          strokeWidth={strokeWidth}
          {...restProps}
        />
      );
    } catch (error) {
      console.error(`Failed to render icon "${name}":`, error);
      // Return a simple fallback
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          {...restProps}
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="2"
            stroke={color || 'currentColor'}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </svg>
      );
    }
  }
}

export default SafeIcon;