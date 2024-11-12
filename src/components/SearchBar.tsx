import React, { useState, useEffect, useRef } from 'react';
import { Search, Monitor, User, Package, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../context/AssetContext';
import { useUsers } from '../context/UserContext';

interface SearchResult {
  id: string;
  type: 'asset' | 'user' | 'order' | 'inventory';
  title: string;
  subtitle: string;
  path: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { assets } = useAssets();
  const { users } = useUsers();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search in assets
    assets.forEach(asset => {
      if (
        asset.id.toLowerCase().includes(lowerQuery) ||
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.user.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: asset.id,
          type: 'asset',
          title: asset.name,
          subtitle: `${asset.type} - ${asset.user}`,
          path: '/assets'
        });
      }
    });

    // Search in users
    users.forEach(user => {
      if (
        user.id.toLowerCase().includes(lowerQuery) ||
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: user.id,
          type: 'user',
          title: `${user.firstName} ${user.lastName}`,
          subtitle: `${user.function} - ${user.site}`,
          path: '/users'
        });
      }
    });

    setResults(searchResults.slice(0, 5));
  }, [query, assets, users]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'asset':
        return <Monitor className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'order':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'inventory':
        return <Package className="h-5 w-5 text-orange-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
            >
              {getIcon(result.type)}
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;