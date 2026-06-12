import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Settings, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    {
      id: '1',
      title: '新的代码评审请求',
      message: '张三提交了新的代码需要评审',
      read: false,
      time: '5分钟前',
    },
    {
      id: '2',
      title: '问题已修复',
      message: '李四修复了分配的阻断级问题',
      read: false,
      time: '30分钟前',
    },
    {
      id: '3',
      title: '评审超时提醒',
      message: '评审单 #PR-2024-0156 超过24小时未处理',
      read: true,
      time: '2小时前',
    },
  ];

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-6 bg-dark-900/80 backdrop-blur-sm border-b border-dark-700/50',
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
          <input
            type="text"
            placeholder="搜索评审单、问题、文件..."
            className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700/50 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors text-dark-400 hover:text-dark-100"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-severity-blocker text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-dark-800 rounded-xl shadow-2xl border border-dark-700/50 z-50 animate-slide-down">
              <div className="p-4 border-b border-dark-700/50 flex items-center justify-between">
                <h3 className="font-semibold text-dark-100">通知</h3>
                <button className="text-xs text-primary-400 hover:text-primary-300">全部标记已读</button>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-b border-dark-700/30 hover:bg-dark-700/30 transition-colors cursor-pointer',
                      !notification.read && 'bg-primary-500/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('w-2 h-2 mt-2 rounded-full flex-shrink-0', !notification.read ? 'bg-primary-500' : 'bg-dark-600')} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-dark-100">{notification.title}</p>
                          {!notification.read && <Check size={14} className="text-primary-400" />}
                        </div>
                        <p className="text-sm text-dark-400 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-dark-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="p-2 rounded-lg hover:bg-dark-800 transition-colors text-dark-400 hover:text-dark-100">
          <Settings size={20} />
        </button>
        <div ref={userMenuRef} className="relative ml-2">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-medium ring-2 ring-primary-500/30">
              TL
            </div>
            <ChevronDown size={16} className="text-dark-400" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-xl shadow-2xl border border-dark-700/50 z-50 animate-slide-down">
              <div className="p-3 border-b border-dark-700/50">
                <p className="text-sm font-medium text-dark-100">技术负责人</p>
                <p className="text-xs text-dark-400">techlead@company.com</p>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:bg-dark-700/50 rounded-md transition-colors">
                  个人资料
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:bg-dark-700/50 rounded-md transition-colors">
                  账户设置
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-severity-blocker hover:bg-severity-blocker/10 rounded-md transition-colors">
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
