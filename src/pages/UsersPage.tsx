import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import UserList from '../components/UserList';
import AddUserWizard from '../components/AddUserWizard';
import { useUsers } from '../context/UserContext';

const UsersPage = () => {
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { activeFilter, setActiveFilter } = useUsers();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez les accès et les permissions des utilisateurs</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, prénom, site..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {activeFilter && (
              <button 
                onClick={() => setActiveFilter(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <Filter className="h-5 w-5" />
                Tout afficher
              </button>
            )}
            <button 
              onClick={() => setIsAddWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              Ajouter un utilisateur
            </button>
          </div>
        </div>
        
        <UserList searchQuery={searchQuery} />
      </div>

      <AddUserWizard 
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
      />
    </main>
  );
};

export default UsersPage;