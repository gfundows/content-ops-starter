import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAssets } from '../context/AssetContext';

interface FormData {
  type: string;
  site: string;
  name: string;
  brand: string;
  model: string;
  service: string;
  ipAddress: string;
  macAddress: string;
  serialNumber: string;
  operator: string;
  comments: string;
  installDate: string;
}

const OPERATORS = ['MNO', 'FBO', 'MPA', 'AME', 'SMZ'];

const SITES = ['QUI', 'DAR', 'SFA', 'SGA'];

const SERVICES = ['Direction', 'Comptabilité', 'RH', 'IT', 'Production', 'Qualité'];

const initialFormData: FormData = {
  type: '',
  site: '',
  name: '',
  brand: '',
  model: '',
  service: '',
  ipAddress: '',
  macAddress: '',
  serialNumber: '',
  operator: '',
  comments: '',
  installDate: new Date().toISOString().split('T')[0]
};

const AddAssetWizard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { addAsset, getNextAssetId } = useAssets();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newAsset = {
      id: getNextAssetId(formData.type),
      type: formData.type,
      name: formData.type === 'Imprimante' ? `IMP-${formData.site}-${formData.service}` : `${formData.brand} ${formData.model}`,
      status: 'En service',
      user: formData.type === 'Imprimante' ? formData.service : `${formData.name}`,
      installDate: formData.installDate,
      site: formData.site,
      brand: formData.brand,
      model: formData.model,
      serialNumber: formData.serialNumber,
      operator: formData.operator,
      comments: formData.comments,
      ipAddress: formData.ipAddress,
      macAddress: formData.macAddress,
      service: formData.service
    };
    
    addAsset(newAsset);
    onClose();
    setFormData(initialFormData);
    setStep(1);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!isOpen) return null;

  const renderPrinterForm = () => (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={formData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un site</option>
              {SITES.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un service</option>
              {SERVICES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: HP, Canon, Epson..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: LaserJet Pro M404dn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
            <input
              type="text"
              value={formData.ipAddress}
              onChange={(e) => handleInputChange('ipAddress', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 192.168.1.100"
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de série</label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opérateur</label>
            <select
              value={formData.operator}
              onChange={(e) => handleInputChange('operator', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un opérateur</option>
              {OPERATORS.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires</label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Informations complémentaires..."
            />
          </div>
        </>
      )}
    </div>
  );

  const renderDefaultForm = () => (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'équipement</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="Ordinateur">Poste de travail</option>
              <option value="Portable">Portable</option>
              <option value="Imprimante">Imprimante</option>
              <option value="BAB">BAB</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={formData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un site</option>
              {SITES.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'installation</label>
            <input
              type="date"
              value={formData.installDate}
              onChange={(e) => handleInputChange('installDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de série</label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opérateur</label>
            <select
              value={formData.operator}
              onChange={(e) => handleInputChange('operator', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un opérateur</option>
              {OPERATORS.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires</label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {formData.type === 'Imprimante' ? 'Ajouter une imprimante' : 'Ajouter un nouvel équipement'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-24 h-1 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          {!formData.type && step === 1 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'équipement</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un type</option>
                <option value="Ordinateur">Poste de travail</option>
                <option value="Portable">Portable</option>
                <option value="Imprimante">Imprimante</option>
                <option value="BAB">BAB</option>
              </select>
            </div>
          ) : formData.type === 'Imprimante' ? (
            renderPrinterForm()
          ) : (
            renderDefaultForm()
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={step === 1 ? onClose : prevStep}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {step === 1 ? 'Annuler' : 'Précédent'}
          </button>
          <button
            onClick={step === 3 ? handleSubmit : nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {step === 3 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetWizard;