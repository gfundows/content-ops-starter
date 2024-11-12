import React, { createContext, useContext, useState, useEffect } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface User {
  id: string;
  site: string;
  firstName: string;
  lastName: string;
  function: string;
  role: string;
  password: string;
  deleted?: boolean;
}

interface UserDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: {
      'by-site': string;
      'by-role': string;
    };
  };
}

interface UserContextType {
  users: User[];
  filteredUsers: User[];
  activeFilter: string | null;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, user: User) => void;
  softDeleteUser: (id: string) => void;
  getNextUserId: () => string;
  setActiveFilter: (filter: string | null) => void;
}

const INITIAL_USERS: User[] = [
  {
    id: "USR001",
    site: "QUI",
    firstName: "Jean",
    lastName: "Dupont",
    function: "IT",
    role: "Admin",
    password: "encrypted_password_1"
  },
  {
    id: "USR002",
    site: "DAR",
    firstName: "Marie",
    lastName: "Martin",
    function: "RH",
    role: "User",
    password: "encrypted_password_2"
  },
  {
    id: "USR003",
    site: "SFA",
    firstName: "Pierre",
    lastName: "Bernard",
    function: "Production",
    role: "Manager",
    password: "encrypted_password_3"
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

class Database {
  private db: Promise<IDBPDatabase<UserDB>>;
  private initialized: boolean = false;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    const db = await openDB<UserDB>('edilians-users', 1, {
      upgrade(db) {
        const store = db.createObjectStore('users', { keyPath: 'id' });
        store.createIndex('by-site', 'site');
        store.createIndex('by-role', 'role');
      },
    });

    if (!this.initialized) {
      const count = await db.count('users');
      if (count === 0) {
        await Promise.all(INITIAL_USERS.map(user => db.add('users', user)));
      }
      this.initialized = true;
    }

    return db;
  }

  async getAllUsers(): Promise<User[]> {
    return (await this.db).getAll('users');
  }

  async addUser(user: User): Promise<void> {
    return (await this.db).add('users', user);
  }

  async updateUser(user: User): Promise<void> {
    return (await this.db).put('users', user);
  }

  async deleteUser(id: string): Promise<void> {
    return (await this.db).delete('users', id);
  }
}

const db = new Database();

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await db.getAllUsers();
      setUsers(loadedUsers);
    };
    loadUsers();
  }, []);

  const filteredUsers = activeFilter
    ? users.filter(user => user.role === activeFilter)
    : users;

  const getNextUserId = (): string => {
    const maxNum = Math.max(...users.map(user => 
      parseInt(user.id.replace('USR', '')) || 0
    ));
    return `USR${String(maxNum + 1).padStart(3, '0')}`;
  };

  const addUser = async (user: User) => {
    await db.addUser(user);
    setUsers(prev => [...prev, user]);
  };

  const removeUser = async (id: string) => {
    await db.deleteUser(id);
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const updateUser = async (id: string, updatedUser: User) => {
    await db.updateUser(updatedUser);
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...updatedUser, deleted: user.deleted } : user
    ));
  };

  const softDeleteUser = async (id: string) => {
    const userToUpdate = users.find(u => u.id === id);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, deleted: !userToUpdate.deleted };
      await db.updateUser(updatedUser);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      filteredUsers,
      activeFilter,
      addUser, 
      removeUser, 
      updateUser,
      softDeleteUser,
      getNextUserId,
      setActiveFilter
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};