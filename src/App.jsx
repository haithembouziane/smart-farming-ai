import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { FarmProvider } from './context/FarmContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <FarmProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          {/* Sidebar: sticky on desktop, drawer on mobile */}
          {sidebarOpen ? (
            // Mobile sidebar (drawer)
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} className="md:hidden" />
          ) : (
            // Desktop sidebar
            <aside className="hidden md:block h-screen sticky top-0 overflow-y-auto z-20">
              <Sidebar isOpen={true} setIsOpen={setSidebarOpen} />
            </aside>
          )}
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 overflow-x-hidden">
            <Dashboard />
          </main>
        </div>
      </div>
    </FarmProvider>
  );
}

export default App;