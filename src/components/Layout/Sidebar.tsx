import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GitPullRequest, Code2, Radar, BookOpen, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/';

const menuItems = [
  { id: '1', label: '待评审列表', icon: GitPullRequest, path: '/reviews' },
  { id: '2', label: '风险雷达', icon: Radar, path: '/radar' },
  { id: '3', label: '团队规则', icon: BookOpen, path: '/rules' },
  { id: '4', label: '评审记录', icon: History, path: '/records' },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-dark-900 border-r border-dark-700/50 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Code2 className="text-primary-400" size={24} />
            <span className="text-lg font-bold gradient-text">CodeReview</span>
          </div>
        )}
        {collapsed && (
          <Code2 className="text-primary-400 mx-auto" size={24} />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-dark-800 transition-colors text-dark-400 hover:text-dark-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary-500/20 text-primary-300 font-medium'
                  : 'text-dark-300 hover:bg-dark-800/60 hover:text-dark-100',
                collapsed && 'justify-center'
              )
            }
          >
            <item.icon size={20} className={cn(
              'transition-transform group-hover:scale-110',
              collapsed ? 'mx-auto' : ''
            )} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-dark-700/50">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm ring-2 ring-primary-500/30">
            TL
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-100 truncate">技术负责人</p>
              <p className="text-xs text-dark-400 truncate">techlead@company.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
