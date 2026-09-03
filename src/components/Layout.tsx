import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children, withSidebar = true }: { children: React.ReactNode; withSidebar?: boolean }){
  return (
    <div className="min-h-screen flex flex-col bg-midnight-900 text-midnight-50">
      <Navbar />
      <div className="flex flex-1">
        {withSidebar && (
          <Sidebar />
        )}
        <main className="flex-1 p-6 bg-midnight-800/60 backdrop-blur-sm">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
