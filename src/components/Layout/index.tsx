import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/utils/';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-dark-950 bg-grid overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={cn('flex-1 overflow-auto scrollbar-thin p-6', className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
