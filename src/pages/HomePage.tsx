import React from 'react';
import { Users, Monitor, Bell, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssets } from '../context/AssetContext';
import { useUsers } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import TypewriterText from '../components/TypewriterText';

const MenuTile: React.FC<{
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  available?: boolean;
  stats?: React.ReactNode;
}> = ({ to, icon, title, description, bgColor, available = false, stats }) => (
  <Link 
    to={to}
    className={`${bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden group`}
  >
    <div className="flex items-start justify-between">
      <div className="text-white">
        <div className="text-xl font-bold mb-2">{title}</div>
        <p className="text-sm opacity-90">{description}</p>
        {stats}
        {!available && title !== "Utilisateurs" && (
          <div className="mt-3 inline-flex items-center text-sm bg-white/20 px-2 py-1 rounded">
            Bientôt disponible
          </div>
        )}
      </div>
      <div className="text-white/80">
        {icon}
      </div>
    </div>
    <ArrowRight className="absolute bottom-4 right-4 h-6 w-6 text-white opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
  </Link>
);

const HomePage = () => {
  const { assets } = useAssets();
  const { users } = useUsers();
  
  const activeEquipment = assets.filter(asset => !asset.deleted && asset.status === 'En service').length;
  const activeUsers = users.filter(user => !user.deleted).length;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-8">
          <TypewriterText text="parKInfo" />
        </div>
        
        <div className="w-full mb-12">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <MenuTile
            to="/users"
            icon={<Users className="h-8 w-8" />}
            title="Utilisateurs"
            description="Gérez les utilisateurs et leurs accès"
            bgColor="bg-gradient-to-br from-purple-500 to-purple-700"
            available={true}
            stats={
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-white/20 px-2 py-1 rounded text-sm">
                  {activeUsers} utilisateurs actifs
                </div>
              </div>
            }
          />
          
          <MenuTile
            to="/assets"
            icon={<Monitor className="h-8 w-8" />}
            title="Matériels"
            description="Gérez votre parc informatique"
            bgColor="bg-gradient-to-br from-blue-500 to-blue-700"
            available={true}
            stats={
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-white/20 px-2 py-1 rounded text-sm">
                  {activeEquipment} équipements actifs
                </div>
              </div>
            }
          />
          
          <MenuTile
            to="/orders"
            icon={<Bell className="h-8 w-8" />}
            title="Commandes"
            description="Suivez vos commandes en cours"
            bgColor="bg-gradient-to-br from-green-500 to-green-700"
          />
          
          <MenuTile
            to="/inventory"
            icon={<Package className="h-8 w-8" />}
            title="Stock"
            description="Gérez votre inventaire"
            bgColor="bg-gradient-to-br from-orange-500 to-orange-700"
          />
        </div>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">Version de la base de données: 1.0</p>
        </div>
      </div>
    </main>
  );
};

export default HomePage;