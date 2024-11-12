import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Moon, Sun, Home, Server, Monitor, Package, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Clock from './Clock';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                par<span className="text-2xl text-blue-500 inline-block scale-x-[-1]">K</span><span className="text-2xl text-blue-500">I</span>nfo
              </span>
            </div>

            <div className="flex items-center gap-4 ml-8">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="h-5 w-5" />
                Accueil
              </Link>
              <Link 
                to="/users" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/users' 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <User className="h-5 w-5" />
                Utilisateurs
              </Link>
              <Link 
                to="/assets" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/assets' 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Monitor className="h-5 w-5" />
                Matériels
              </Link>
              <Link 
                to="/orders" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/orders' 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bell className="h-5 w-5" />
                Commandes
              </Link>
              <Link 
                to="/inventory" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/inventory' 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Package className="h-5 w-5" />
                Stock
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Clock />
            
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;