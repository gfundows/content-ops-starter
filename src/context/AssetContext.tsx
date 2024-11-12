import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  user: string;
  installDate: string;
  site?: string;
  function?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  operator?: string;
  comments?: string;
  deleted?: boolean;
  ipAddress?: string;
  macAddress?: string;
  service?: string;
}

interface AssetContextType {
  assets: Asset[];
  filteredAssets: Asset[];
  activeFilter: string | null;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, asset: Asset) => void;
  softDeleteAsset: (id: string) => void;
  getNextAssetId: (type: string) => string;
  setActiveFilter: (filter: string | null) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      const loadedAssets = await db.getAllAssets();
      setAssets(loadedAssets);
    };
    loadAssets();
  }, []);

  const filteredAssets = activeFilter
    ? assets.filter(asset => asset.type === activeFilter)
    : assets;

  const getNextAssetId = (type: string): string => {
    const existingIds = assets
      .filter(asset => asset.type === type)
      .map(asset => asset.id);

    if (type === 'Ordinateur') {
      const maxNum = Math.max(...existingIds
        .filter(id => id.startsWith('DA'))
        .map(id => parseInt(id.slice(2)) || 100));
      return `DA${String(maxNum + 1).padStart(4, '0')}`;
    }
    
    if (type === 'Portable') {
      const maxNum = Math.max(...existingIds
        .filter(id => id.startsWith('LA'))
        .map(id => parseInt(id.slice(2)) || 100));
      return `LA${String(maxNum + 1).padStart(4, '0')}`;
    }
    
    if (type === 'BAB') {
      const maxNum = Math.max(...existingIds
        .filter(id => id.startsWith('BB-EDI-'))
        .map(id => parseInt(id.slice(7)) || 10));
      return `BB-EDI-${String(maxNum + 1).padStart(3, '0')}`;
    }

    if (type === 'Imprimante') {
      return `IMP-${existingIds.length + 1}`;
    }

    return `GEN${String(Math.floor(Math.random() * 9000) + 1000)}`;
  };

  const addAsset = async (asset: Asset) => {
    await db.addAsset(asset);
    setAssets(prev => [...prev, asset]);
  };

  const removeAsset = async (id: string) => {
    await db.deleteAsset(id);
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const updateAsset = async (id: string, updatedAsset: Asset) => {
    await db.updateAsset(updatedAsset);
    setAssets(prev => prev.map(asset => asset.id === id ? { ...updatedAsset, deleted: asset.deleted } : asset));
  };

  const softDeleteAsset = async (id: string) => {
    const assetToUpdate = assets.find(a => a.id === id);
    if (assetToUpdate) {
      const updatedAsset = { 
        ...assetToUpdate, 
        deleted: !assetToUpdate.deleted, 
        status: !assetToUpdate.deleted ? 'Hors service' : 'En service' 
      };
      await db.updateAsset(updatedAsset);
      setAssets(prev => prev.map(asset => 
        asset.id === id ? updatedAsset : asset
      ));
    }
  };

  return (
    <AssetContext.Provider value={{ 
      assets, 
      filteredAssets,
      activeFilter,
      addAsset, 
      removeAsset, 
      updateAsset,
      softDeleteAsset,
      getNextAssetId,
      setActiveFilter
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};