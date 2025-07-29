import Icon from '../common/Icon';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-gray-400">
            © roflsunriz - 2025 カラオケオートレコメンド - ローカルデータのみ使用
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Icon name="lock" color="inherit" size="small" />
              プライバシー保護
            </span>
            <span className="flex items-center gap-1">
              <Icon name="bolt" color="inherit" size="small" />
              高速動作
            </span>
            <span className="flex items-center gap-1">
              <Icon name="phone" color="inherit" size="small" />
              レスポンシブ対応
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 