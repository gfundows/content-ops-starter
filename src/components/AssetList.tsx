import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Check, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { useAssets } from '../context/AssetContext';

type SortField = 'id' | 'user' | 'brand' | 'model' | 'status' | 'operator' | null;
type SortDirection = 'asc' | 'desc';

interface AssetListProps {
  searchQuery: string;
}

const AssetList: React.FC<AssetListProps> = ({ searchQuery }) => {
  const { filteredAssets, updateAsset, softDeleteAsset } = useAssets();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const searchAssets = (assets: any[]) => {
    if (!searchQuery) return assets;
    
    const query = searchQuery.toLowerCase();
    return assets.filter(asset => {
      return (
        asset.id.toLowerCase().includes(query) ||
        asset.user.toLowerCase().includes(query) ||
        (asset.brand || '').toLowerCase().includes(query) ||
        (asset.model || '').toLowerCase().includes(query) ||
        (asset.operator || '').toLowerCase().includes(query) ||
        (asset.comments || '').toLowerCase().includes(query) ||
        (asset.service || '').toLowerCase().includes(query) ||
        (asset.site || '').toLowerCase().includes(query)
      );
    });
  };

  const sortedAssets = searchAssets([...filteredAssets]).sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    if (sortField === 'user') {
      valueA = a.user.toLowerCase();
      valueB = b.user.toLowerCase();
    } else {
      valueA = (a[sortField] || '').toLowerCase();
      valueB = (b[sortField] || '').toLowerCase();
    }

    if (sortDirection === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  const handleEdit = (asset: any) => {
    setEditingId(asset.id);
    setEditForm(asset);
  };

  const handleSave = () => {
    updateAsset(editingId!, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getRowClassName = (asset: any) => {
    if (asset.deleted) return 'border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 bg-red-100 dark:bg-red-900/30 line-through';
    if (asset.status === 'Hors service') return 'border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 bg-red-100 dark:bg-red-900/30';
    return 'border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700';
  };

  const SortButton = ({ field, label }: { field: SortField, label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="id" label="ID" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="status" label="Statut" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="user" label="Utilisateur" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="brand" label="Marque" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="model" label="Modèle" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="operator" label="Opérateur" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Commentaires</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date d'installation</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-gray-200">
          {sortedAssets.map((asset) => (
            <tr key={asset.id} className={getRowClassName(asset)}>
              <td className="py-3 px-4">{asset.id}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  asset.type === 'Ordinateur' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                  asset.type === 'Portable' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                  asset.type === 'Imprimante' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' :
                  asset.type === 'BAB' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200' :
                  'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
                }`}>
                  {asset.type}
                </span>
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="En service">En service</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Hors service">Hors service</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    asset.status === 'En service' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                    asset.status === 'En maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                  }`}>
                    {asset.status}
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <input
                    type="text"
                    value={editForm.user}
                    onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : asset.user}
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <input
                    type="text"
                    value={editForm.brand}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : asset.brand}
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : asset.model}
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <select
                    value={editForm.operator}
                    onChange={(e) => setEditForm({ ...editForm, operator: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="MNO">MNO</option>
                    <option value="FBO">FBO</option>
                    <option value="MPA">MPA</option>
                    <option value="AME">AME</option>
                    <option value="SMZ">SMZ</option>
                  </select>
                ) : asset.operator}
              </td>
              <td className="py-3 px-4">
                <div className="relative group">
                  <div className="truncate max-w-[150px]">
                    {editingId === asset.id ? (
                      <input
                        type="text"
                        value={editForm.comments}
                        onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : asset.comments}
                  </div>
                  {asset.comments && (
                    <div className="absolute hidden group-hover:block z-50 bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 text-white text-sm rounded shadow-lg">
                      {asset.comments}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                {editingId === asset.id ? (
                  <input
                    type="date"
                    value={editForm.installDate}
                    onChange={(e) => setEditForm({ ...editForm, installDate: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : asset.installDate}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {editingId === asset.id ? (
                    <>
                      <button 
                        onClick={handleSave}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 dark:text-green-400"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {!asset.deleted && (
                        <button 
                          onClick={() => handleEdit(asset)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                      {asset.deleted ? (
                        <button 
                          onClick={() => softDeleteAsset(asset.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Restaurer"
                        >
                          <RotateCcw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => softDeleteAsset(asset.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;