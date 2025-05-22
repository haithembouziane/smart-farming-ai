import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  Home, 
  BarChart2, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  Droplets, 
  Sprout, 
  CloudRain 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const menuItems = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Analytics', icon: BarChart2, current: false },
    { name: 'Schedule', icon: Calendar, current: false },
    { name: 'Resources', icon: Droplets, current: false },
    { name: 'Crop Management', icon: Sprout, current: false },
    { name: 'Weather', icon: CloudRain, current: false },
    { name: 'Alerts', icon: AlertTriangle, current: false },
    { name: 'Settings', icon: Settings, current: false },
  ];

  return (
    <>
      {/* Overlay for mobile only */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-20 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar: fixed on mobile, static on md+ */}
      <div 
        ref={sidebarRef}
        className={`z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform
          md:static md:translate-x-0 md:flex md:flex-col md:h-screen
          fixed top-0 left-0 bottom-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-primary-600">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">Farm AI</span>
          </div>
          <button
            className="md:hidden rounded-md text-white hover:text-gray-200 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <div className="mt-5 flex-1 h-0 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`${
                    item.current
                      ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 ease-in-out`}
                >
                  <Icon 
                    className={`mr-4 h-5 w-5 ${
                      item.current 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`} 
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-center">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Smart Farming Model v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;