import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { AllouiIcon } from '../icons';
import Link from 'next/link';

// Main navigation items for the unified dashboard
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'teacher',
    href: '/',
    description: 'Your coaching command center'
  },
  {
    id: 'modules',
    label: 'Learning Path',
    icon: 'rules',
    href: '/modules',
    description: 'Interactive coaching modules'
  },
  {
    id: 'scenarios',
    label: 'Video Scenarios',
    icon: 'video',
    href: '/scenarios',
    description: 'Interactive coaching challenges'
  },
  {
    id: 'community',
    label: 'Community Forum',
    icon: 'communication',
    href: '/community',
    description: 'Connect with fellow coaches'
  },
  {
    id: 'toolkit',
    label: 'Coach\'s Toolkit',
    icon: 'basketball',
    href: '/toolkit',
    description: 'Practice plans, drills, and tools',
    submenu: [
      { label: 'Drill Builder', href: '/tools/drill-builder', icon: 'strategy' },
      { label: 'Practice Builder', href: '/tools/practice-builder', icon: 'calendar' },
      { label: 'Drill Library', href: '/tools/drill-library', icon: 'movement' },
      { label: 'Strategy Planner', href: '/tools/strategy', icon: 'strategy' },
      { label: 'Player Evaluation', href: '/tools/evaluation', icon: 'communication' }
    ]
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'communication',
    href: '/community',
    description: 'Connect with fellow coaches'
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: 'trophy',
    href: '/progress',
    description: 'Track your coaching development'
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: 'science',
    href: '/resources',
    description: 'Additional coaching materials'
  }
];

// Quick access items that appear in the header
const quickAccessItems = [
  {
    id: 'certificates',
    label: 'Certificates',
    icon: 'trophy',
    href: '/certificates'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'teacher',
    href: '/profile'
  }
];

export function DashboardNavigation({ variant = 'header', onItemClick, currentPath }) {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState(new Set());

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Header variant - horizontal navigation
  if (variant === 'header') {
    return (
      <nav className="flex items-center space-x-1">
        {navigationItems.slice(0, 4).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                active
                  ? 'bg-basketball-orange-light/10 dark:bg-basketball-orange-dark/10 text-basketball-orange-light dark:text-basketball-orange-dark'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <AllouiIcon 
                name={item.icon} 
                size="sm" 
                variant={active ? 'gold' : 'secondary'} 
              />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
        
        {/* More menu for additional items */}
        <div className="relative group">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
            <AllouiIcon name="hand-signal" size="sm" variant="secondary" />
            <span className="hidden lg:inline">More</span>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              {navigationItems.slice(4).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  <AllouiIcon name={item.icon} size="sm" variant="secondary" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-600 mt-1 pt-1">
                {quickAccessItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    <AllouiIcon name={item.icon} size="sm" variant="secondary" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Sidebar variant - vertical navigation
  if (variant === 'sidebar') {
    return (
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Coach's Navigation
          </h2>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems.has(item.id);

              return (
                <div key={item.id}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        active
                          ? 'bg-basketball-orange-light/10 dark:bg-basketball-orange-dark/10 text-basketball-orange-light dark:text-basketball-orange-dark'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      onClick={() => onItemClick?.(item)}
                    >
                      <AllouiIcon 
                        name={item.icon} 
                        size="md" 
                        variant={active ? 'gold' : 'secondary'} 
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                    
                    {hasSubmenu && (
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <AllouiIcon 
                          name="arrow-right" 
                          size="sm" 
                          className={`transform transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <div className="ml-12 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <AllouiIcon name={subItem.icon} size="sm" variant="secondary" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quick Access Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            <div className="space-y-1">
              {quickAccessItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <AllouiIcon name={item.icon} size="sm" variant="secondary" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Mobile variant - bottom navigation
  if (variant === 'mobile') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex">
          {navigationItems.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${
                  active
                    ? 'text-basketball-orange-light dark:text-basketball-orange-dark'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => onItemClick?.(item)}
              >
                <AllouiIcon 
                  name={item.icon} 
                  size="sm" 
                  variant={active ? 'gold' : 'secondary'} 
                />
                <span className="text-xs font-medium mt-1 text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return null;
}

export default DashboardNavigation;