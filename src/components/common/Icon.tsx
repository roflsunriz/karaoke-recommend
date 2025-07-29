/*!
 * © roflsunriz - 2025 カラオケオートレコメンド
 * 共通アイコンコンポーネント
 */

import React from 'react';
import {
  MusicNote,
  Mic,
  Folder,
  History,
  ViewList,
  Settings,
  Casino,
  ArrowBack,
  CheckCircle,
  Warning,
  SentimentDissatisfied,
  BarChart,
  Info,
  Delete,
  AccessTime,
  Refresh,
  Lock,
  Bolt,
  PhoneAndroid,
  Album,
  CalendarToday,
} from '@mui/icons-material';

type IconName =
  | 'music'
  | 'mic'
  | 'folder'
  | 'history'
  | 'list'
  | 'settings'
  | 'dice'
  | 'back'
  | 'check'
  | 'warning'
  | 'sad'
  | 'chart'
  | 'info'
  | 'delete'
  | 'time'
  | 'refresh'
  | 'lock'
  | 'bolt'
  | 'phone'
  | 'album'
  | 'calendar';

interface IconProps {
  name: IconName;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit';
  size?: 'small' | 'medium' | 'large';
}

const colorMap = {
  primary: 'text-blue-600',
  secondary: 'text-purple-600',
  success: 'text-green-600',
  warning: 'text-orange-600',
  error: 'text-red-600',
  info: 'text-gray-600',
  inherit: '',
};

const sizeMap = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-4xl',
};

const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  color = 'inherit', 
  size = 'medium' 
}) => {
  const iconMap = {
    music: MusicNote,
    mic: Mic,
    folder: Folder,
    history: History,
    list: ViewList,
    settings: Settings,
    dice: Casino,
    back: ArrowBack,
    check: CheckCircle,
    warning: Warning,
    sad: SentimentDissatisfied,
    chart: BarChart,
    info: Info,
    delete: Delete,
    time: AccessTime,
    refresh: Refresh,
    lock: Lock,
    bolt: Bolt,
    phone: PhoneAndroid,
    album: Album,
    calendar: CalendarToday,
  };

  const IconComponent = iconMap[name];
  const colorClass = colorMap[color];
  const sizeClass = sizeMap[size];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent 
      className={`${colorClass} ${sizeClass} ${className}`.trim()}
    />
  );
};

export default Icon; 