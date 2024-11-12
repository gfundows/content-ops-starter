import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import StatTile from '../components/StatTile';

interface Order {
  id: string;
  brand: string;
  reference: string;
  quantity: number;
  status: 'pending' | 'in-progress' | 'validated' | 'received';
  date: string;
}

// Données de test
const MOCK_ORDERS: Order[] = [
  { id: 'CMD001', brand: 'Dell', reference: 'OPTIPLEX-5090', quantity: 5, status: 'pending', date: '2024-03-15' },
  { id: 'CMD002', brand: 'HP', reference: 'ELITEDESK-800', quantity: 3, status: 'in-progress', date: '2024-03-14' },
  { id: 'CMD003', brand: 'Lenovo', reference: 'THINKPAD-T14', quantity: 2, status: 'validated', date: '2024-03-13' },
  { id: 'CMD004', brand: 'Dell', reference: 'LATITUDE-5420', quantity: 4, status: 'received', date: '2024-03-12' },
  { id: 'CMD005', brand: 'HP', reference: 'PROBOOK-450', quantity: 6, status: 'pending', date: '2024-03-11' },
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Order | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const stats = [
    {
      Icon: Package,
      label: "Commandes souhaitées",
      count: MOCK_ORDERS.filter(o => o.status === 'pending').length,
      type: "pending",
      bgColor: "bg-blue-500",
      hoverBgColor: "hover:bg-blue-600",
      ringColor: "ring-blue-200",
      barColor: "bg-blue-500"
    },
    {
      Icon: Clock,
      label: "Commandes en cours",
      count: MOCK_ORDERS.filter(o => o.status === 'in-progress').length,
      type: "in-progress",
      bgColor: "bg-yellow-500",
      hoverBgColor: "hover:bg-yellow-600",
      ringColor: "ring-yellow-200",
      barColor: "bg-yellow-500"
    },
    {
      Icon: CheckCircle,
      label: "Commandes validées",
      count: MOCK_ORDERS.filter(o => o.status === 'validated').length,
      type: "validated",
      bgColor: "bg-green-500",
      hoverBgColor: "hover:bg-green-600",
      ringColor: "ring-green-200",
      barColor: "bg-green-500"
    },
    {
      Icon: Truck,
      label: "Commandes reçues",
      count: MOCK_ORDERS.filter(o => o.status === 'received').length,
      type: "received",
      bgColor: "bg-purple-500",
      hoverBgColor: "hover:bg-purple-600",
      ringColor: "ring-purple-200",
      barColor: "bg-purple-500"
    }
  ];

  const handleTileClick = (type: string) => {
    setActiveFilter(activeFilter === type ? null : type);
  };

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders = MOCK_ORDERS
    .filter(order => {
      if (activeFilter) {
        return order.status === activeFilter;
      }
      return true;
    })
    .filter(order => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.brand.toLowerCase().includes(query) ||
        order.reference.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const valueA = String(a[sortField]).toLowerCase();
      const valueB = String(b[sortField]).toLowerCase();

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

  const SortButton = ({ field, label }: { field: keyof Order, label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Commandes</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivez l'état de vos commandes</p>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par ID, marque, référence..."
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              Nouvelle commande
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="id" label="ID" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="brand" label="Marque" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="reference" label="Référence" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="quantity" label="Quantité" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="status" label="Statut" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <SortButton field="date" label="Date" />
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.brand}</td>
                  <td className="py-3 px-4">{order.reference}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                      order.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                      order.status === 'validated' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                    }`}>
                      {order.status === 'pending' ? 'Souhaitée' :
                       order.status === 'in-progress' ? 'En cours' :
                       order.status === 'validated' ? 'Validée' :
                       'Reçue'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default OrdersPage;