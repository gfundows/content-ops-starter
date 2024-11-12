import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Check, X, ArrowUpDown, RotateCcw, Eye, EyeOff, Mail } from 'lucide-react';
import { useUsers } from '../context/UserContext';

type SortField = 'id' | 'lastName' | 'firstName' | 'site' | 'function' | 'role' | 'password' | null;
type SortDirection = 'asc' | 'desc';

interface UserListProps {
  searchQuery: string;
}

interface PasswordVisibility {
  [key: string]: boolean;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, user }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const emailBody = `
Bonjour,

Un compte a été créé pour ${user.firstName} ${user.lastName}.

Informations du compte :
- Identifiant : ${user.id}
- Mot de passe temporaire : ${user.password}

Merci de demander à l'utilisateur de changer son mot de passe dès sa première connexion.

Cordialement,
L'équipe IT
  `;

  const handleSend = () => {
    setSending(true);
    // Simuler l'envoi d'email
    setTimeout(() => {
      setSending(false);
      onClose();
      // Vous pouvez ajouter une notification de succès ici
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Envoyer les informations de connexion
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email du responsable
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              readOnly
              value={emailBody}
              className="w-full h-48 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={!recipientEmail || sending}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              sending || !recipientEmail ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {sending ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserList: React.FC<UserListProps> = ({ searchQuery }) => {
  const { filteredUsers, updateUser, softDeleteUser } = useUsers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [emailModalUser, setEmailModalUser] = useState<any>(null);

  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));

    if (!passwordVisibility[userId]) {
      setTimeout(() => {
        setPasswordVisibility(prev => ({
          ...prev,
          [userId]: false
        }));
      }, 30000);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const searchUsers = (users: any[]) => {
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => {
      return (
        user.id.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.site.toLowerCase().includes(query) ||
        user.function.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  };

  const sortedUsers = searchUsers([...filteredUsers]).sort((a, b) => {
    if (!sortField) return 0;
    
    const valueA = a[sortField]?.toLowerCase() || '';
    const valueB = b[sortField]?.toLowerCase() || '';

    if (sortDirection === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const handleSave = () => {
    updateUser(editingId!, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleMenu = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleEmailClick = (user: any) => {
    setEmailModalUser(user);
    setOpenMenuId(null);
  };

  const getRowClassName = (user: any) => {
    if (user.deleted) return 'border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 bg-red-100 dark:bg-red-900/30 line-through';
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
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="site" label="Site" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="lastName" label="Nom" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="firstName" label="Prénom" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="function" label="Fonction" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <SortButton field="role" label="Droits" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Mot de passe
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-gray-200">
          {sortedUsers.map((user) => (
            <tr key={user.id} className={getRowClassName(user)}>
              <td className="py-3 px-4">{user.id}</td>
              <td className="py-3 px-4">
                {editingId === user.id ? (
                  <select
                    value={editForm.site}
                    onChange={(e) => setEditForm({ ...editForm, site: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {['QUI', 'DAR', 'SFA', 'SGA'].map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                ) : user.site}
              </td>
              <td className="py-3 px-4">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : user.lastName}
              </td>
              <td className="py-3 px-4">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : user.firstName}
              </td>
              <td className="py-3 px-4">
                {editingId === user.id ? (
                  <select
                    value={editForm.function}
                    onChange={(e) => setEditForm({ ...editForm, function: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {['IT', 'RH', 'Production', 'Direction', 'Commercial', 'Marketing'].map(func => (
                      <option key={func} value={func}>{func}</option>
                    ))}
                  </select>
                ) : user.function}
              </td>
              <td className="py-3 px-4">
                {editingId === user.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  }`}>
                    {user.role}
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {passwordVisibility[user.id] ? user.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(user.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {passwordVisibility[user.id] ? (
                      <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {editingId === user.id ? (
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
                      {!user.deleted && (
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                      {user.deleted ? (
                        <button 
                          onClick={() => softDeleteUser(user.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Restaurer"
                        >
                          <RotateCcw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => softDeleteUser(user.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                      <div className="relative">
                        <button 
                          onClick={() => toggleMenu(user.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        {openMenuId === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => handleEmailClick(user)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-lg"
                            >
                              <Mail className="h-4 w-4" />
                              Envoyer un email
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {emailModalUser && (
        <EmailModal
          isOpen={!!emailModalUser}
          onClose={() => setEmailModalUser(null)}
          user={emailModalUser}
        />
      )}
    </div>
  );
};

export default UserList;