import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children, withSidebar = true }: { children: ReactNode; withSidebar?: boolean }){
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-ink-700">
      <Navbar />
      <div className="flex flex-1">
        {withSidebar && (
          <Sidebar />
        )}
        <main className="flex-1 p-0">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
