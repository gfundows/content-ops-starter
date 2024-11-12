import React, { useState } from 'react';
import { Monitor, Laptop, Printer, Server, Search, Plus, Filter, Database, ShoppingCart, Package, Cpu, Users } from 'lucide-react';
import AssetList from '../components/AssetList';
import AddAssetWizard from '../components/AddAssetWizard';
import StatTile from '../components/StatTile';
import { useAssets } from '../context/AssetContext';

const AssetsPage = () => {
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { assets, activeFilter, setActiveFilter } = useAssets();

  const stats = [
    { 
      Icon: Monitor, 
      label: "Postes de Travail", 
      count: assets.filter(a => a.type === "Ordinateur").length, 
      type: "Ordinateur", 
      bgColor: "bg-blue-500", 
      hoverBgColor: "hover:bg-blue-600", 
      ringColor: "ring-blue-200",
      barColor: "bg-blue-500"
    },
    { 
      Icon: Laptop, 
      label: "Portables", 
      count: assets.filter(a => a.type === "Portable").length, 
      type: "Portable", 
      bgColor: "bg-green-500", 
      hoverBgColor: "hover:bg-green-600", 
      ringColor: "ring-green-200",
      barColor: "bg-green-500"
    },
    { 
      Icon: Database, 
      label: "BAB", 
      count: assets.filter(a => a.type === "BAB").length, 
      type: "BAB", 
      bgColor: "bg-pink-500", 
      hoverBgColor: "hover:bg-pink-600", 
      ringColor: "ring-pink-200",
      barColor: "bg-pink-500"
    },
    { 
      Icon: Printer, 
      label: "Imprimantes", 
      count: assets.filter(a => a.type === "Imprimante").length, 
      type: "Imprimante", 
      bgColor: "bg-purple-500", 
      hoverBgColor: "hover:bg-purple-600", 
      ringColor: "ring-purple-200",
      barColor: "bg-purple-500"
    },
    { 
      Icon: Server, 
      label: "Serveurs", 
      count: assets.filter(a => a.type === "Serveur").length, 
      type: "Serveur", 
      bgColor: "bg-orange-500", 
      hoverBgColor: "hover:bg-orange-600", 
      ringColor: "ring-orange-200",
      barColor: "bg-orange-500"
    },
  ];

  const handleTileClick = (type: string) => {
    setActiveFilter(activeFilter === type ? null : type);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edilians ParkInfo</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez efficacement vos ressources informatiques</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        {stats.map((stat) => (
          <StatTile
            key={stat.type}
            Icon={stat.Icon}
            label={stat.label}
            count={stat.count}
            type={stat.type}
            bgColor={stat.bgColor}
            hoverBgColor={stat.hoverBgColor}
            ringColor={stat.ringColor}
            barColor={stat.barColor}
            isActive={activeFilter === stat.type}
            onClick={() => handleTileClick(stat.type)}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Rechercher par ID, utilisateur, marque, modèle..."
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
              Ajouter
            </button>
          </div>
        </div>
        
        <AssetList searchQuery={searchQuery} />
      </div>

      <AddAssetWizard 
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
      />
    </main>
  );
};

export default AssetsPage;