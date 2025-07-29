import { Link, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';

const Header = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/import', label: 'Import', icon: 'folder' as const },
    { path: '/list', label: 'List', icon: 'list' as const },
    { path: '/recommend', label: 'Recommend', icon: 'music' as const },
    { path: '/history', label: 'History', icon: 'history' as const },
    { path: '/settings', label: 'Settings', icon: 'settings' as const },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="mic" color="inherit" size="medium" />
            <h1 className="text-xl font-bold">カラオケオートレコメンド</h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon name={item.icon} color="inherit" size="small" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* モバイルメニューボタン（後で実装） */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <span className="sr-only">メニューを開く</span>
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 