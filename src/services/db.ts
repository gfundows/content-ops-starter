import { openDB, DBSchema, IDBPDatabase } from 'idb';

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

interface AssetDB extends DBSchema {
  assets: {
    key: string;
    value: Asset;
    indexes: {
      'by-type': string;
      'by-status': string;
      'by-site': string;
    };
  };
}

const SITES = ['QUI', 'DAR', 'SFA', 'SGA'];
const FUNCTIONS = ['Direction', 'Comptabilité', 'RH', 'IT', 'Production', 'Qualité', 'Commercial', 'Marketing'];
const OPERATORS = ['MNO', 'FBO', 'MPA', 'AME', 'SMZ'];
const STATUSES = ['En service', 'En maintenance', 'Hors service'];

const INITIAL_DATA: Asset[] = [
  // Postes de travail (DA)
  {
    id: "DA0100",
    name: "Dell OptiPlex 5090",
    type: "Ordinateur",
    status: "En service",
    user: "Jean Dupont",
    installDate: "2023-06-15",
    site: "QUI",
    function: "IT",
    brand: "Dell",
    model: "OptiPlex 5090",
    serialNumber: "DOPT5090-001",
    operator: "MNO"
  },
  {
    id: "DA0101",
    name: "HP EliteDesk 800 G6",
    type: "Ordinateur",
    status: "En service",
    user: "Sophie Martin",
    installDate: "2023-07-20",
    site: "DAR",
    function: "Comptabilité",
    brand: "HP",
    model: "EliteDesk 800 G6",
    serialNumber: "HPED800-002",
    operator: "FBO"
  },
  {
    id: "DA0102",
    name: "Lenovo ThinkCentre M70q",
    type: "Ordinateur",
    status: "En maintenance",
    user: "Pierre Dubois",
    installDate: "2023-08-10",
    site: "SFA",
    function: "RH",
    brand: "Lenovo",
    model: "ThinkCentre M70q",
    serialNumber: "LTC70Q-003",
    operator: "MPA"
  },
  {
    id: "DA0103",
    name: "Dell OptiPlex 7090",
    type: "Ordinateur",
    status: "En service",
    user: "Marie Leroy",
    installDate: "2023-09-05",
    site: "SGA",
    function: "Direction",
    brand: "Dell",
    model: "OptiPlex 7090",
    serialNumber: "DOPT7090-004",
    operator: "AME"
  },
  {
    id: "DA0104",
    name: "HP ProDesk 600 G6",
    type: "Ordinateur",
    status: "En service",
    user: "Lucas Bernard",
    installDate: "2023-10-12",
    site: "QUI",
    function: "Production",
    brand: "HP",
    model: "ProDesk 600 G6",
    serialNumber: "HPPD600-005",
    operator: "SMZ"
  },
  // Portables (LA)
  {
    id: "LA0100",
    name: "HP EliteBook 850 G8",
    type: "Portable",
    status: "En service",
    user: "Emma Petit",
    installDate: "2023-06-20",
    site: "DAR",
    function: "Commercial",
    brand: "HP",
    model: "EliteBook 850 G8",
    serialNumber: "HPEB850-001",
    operator: "MNO"
  },
  {
    id: "LA0101",
    name: "Dell Latitude 5520",
    type: "Portable",
    status: "En maintenance",
    user: "Thomas Richard",
    installDate: "2023-07-25",
    site: "SFA",
    function: "Marketing",
    brand: "Dell",
    model: "Latitude 5520",
    serialNumber: "DL5520-002",
    operator: "FBO"
  },
  {
    id: "LA0102",
    name: "Lenovo ThinkPad X1",
    type: "Portable",
    status: "En service",
    user: "Julie Moreau",
    installDate: "2023-08-15",
    site: "SGA",
    function: "Direction",
    brand: "Lenovo",
    model: "ThinkPad X1",
    serialNumber: "LTP-X1-003",
    operator: "MPA"
  },
  {
    id: "LA0103",
    name: "HP ProBook 450 G8",
    type: "Portable",
    status: "En service",
    user: "Antoine Durand",
    installDate: "2023-09-10",
    site: "QUI",
    function: "IT",
    brand: "HP",
    model: "ProBook 450 G8",
    serialNumber: "HPPB450-004",
    operator: "AME"
  },
  {
    id: "LA0104",
    name: "Dell Latitude 7420",
    type: "Portable",
    status: "Hors service",
    user: "Sarah Lambert",
    installDate: "2023-10-05",
    site: "DAR",
    function: "RH",
    brand: "Dell",
    model: "Latitude 7420",
    serialNumber: "DL7420-005",
    operator: "SMZ"
  },
  // BAB Systems
  {
    id: "BB-EDI-010",
    name: "BAB System X1",
    type: "BAB",
    status: "En service",
    user: "Production Line 1",
    installDate: "2024-01-15",
    site: "SGA",
    function: "Production",
    brand: "BAB Systems",
    model: "X1",
    serialNumber: "BABX1-001",
    operator: "MNO"
  },
  {
    id: "BB-EDI-011",
    name: "BAB System X2",
    type: "BAB",
    status: "En maintenance",
    user: "Production Line 2",
    installDate: "2024-01-20",
    site: "QUI",
    function: "Production",
    brand: "BAB Systems",
    model: "X2",
    serialNumber: "BABX2-002",
    operator: "FBO"
  },
  {
    id: "BB-EDI-012",
    name: "BAB System X1 Pro",
    type: "BAB",
    status: "En service",
    user: "Production Line 3",
    installDate: "2024-02-01",
    site: "DAR",
    function: "Production",
    brand: "BAB Systems",
    model: "X1 Pro",
    serialNumber: "BABX1P-003",
    operator: "MPA"
  },
  // Imprimantes
  {
    id: "IMP-QUI-IT",
    name: "HP LaserJet Pro",
    type: "Imprimante",
    status: "En service",
    user: "Service IT",
    installDate: "2024-01-10",
    site: "QUI",
    service: "IT",
    brand: "HP",
    model: "LaserJet Pro M404dn",
    serialNumber: "HPLJ-2024-001",
    operator: "AME",
    ipAddress: "192.168.1.100"
  },
  {
    id: "IMP-DAR-PROD",
    name: "Xerox WorkCentre",
    type: "Imprimante",
    status: "En service",
    user: "Service Production",
    installDate: "2024-01-15",
    site: "DAR",
    service: "Production",
    brand: "Xerox",
    model: "WorkCentre 6515",
    serialNumber: "XWC-2024-002",
    operator: "SMZ",
    ipAddress: "192.168.2.100"
  }
];

// Générer plus de postes de travail
for (let i = 5; i < 20; i++) {
  const site = SITES[Math.floor(Math.random() * SITES.length)];
  const func = FUNCTIONS[Math.floor(Math.random() * FUNCTIONS.length)];
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  INITIAL_DATA.push({
    id: `DA0${100 + i}`,
    name: `Poste de travail ${100 + i}`,
    type: "Ordinateur",
    status: status,
    user: `Utilisateur ${100 + i}`,
    installDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    site: site,
    function: func,
    brand: ["Dell", "HP", "Lenovo"][Math.floor(Math.random() * 3)],
    model: ["OptiPlex 5090", "EliteDesk 800 G6", "ThinkCentre M70q"][Math.floor(Math.random() * 3)],
    serialNumber: `WS${100 + i}-${Math.random().toString(36).substring(7)}`,
    operator: operator
  });
}

// Générer plus de portables
for (let i = 5; i < 20; i++) {
  const site = SITES[Math.floor(Math.random() * SITES.length)];
  const func = FUNCTIONS[Math.floor(Math.random() * FUNCTIONS.length)];
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  INITIAL_DATA.push({
    id: `LA0${100 + i}`,
    name: `Portable ${100 + i}`,
    type: "Portable",
    status: status,
    user: `Utilisateur ${200 + i}`,
    installDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    site: site,
    function: func,
    brand: ["Dell", "HP", "Lenovo"][Math.floor(Math.random() * 3)],
    model: ["Latitude 5520", "EliteBook 850 G8", "ThinkPad X1"][Math.floor(Math.random() * 3)],
    serialNumber: `LT${100 + i}-${Math.random().toString(36).substring(7)}`,
    operator: operator
  });
}

// Générer plus de BAB
for (let i = 3; i < 10; i++) {
  const site = SITES[Math.floor(Math.random() * SITES.length)];
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  INITIAL_DATA.push({
    id: `BB-EDI-${String(10 + i).padStart(3, '0')}`,
    name: `BAB System ${10 + i}`,
    type: "BAB",
    status: status,
    user: `Production Line ${i + 1}`,
    installDate: `2024-${String(Math.floor(Math.random() * 2) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    site: site,
    function: "Production",
    brand: "BAB Systems",
    model: ["X1", "X2", "X1 Pro"][Math.floor(Math.random() * 3)],
    serialNumber: `BAB${10 + i}-${Math.random().toString(36).substring(7)}`,
    operator: operator
  });
}

class Database {
  private db: Promise<IDBPDatabase<AssetDB>>;
  private initialized: boolean = false;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    const db = await openDB<AssetDB>('edilians-parkinfo', 1, {
      upgrade(db) {
        const store = db.createObjectStore('assets', { keyPath: 'id' });
        store.createIndex('by-type', 'type');
        store.createIndex('by-status', 'status');
        store.createIndex('by-site', 'site');
      },
    });

    if (!this.initialized) {
      const count = await db.count('assets');
      if (count === 0) {
        await Promise.all(INITIAL_DATA.map(asset => db.add('assets', asset)));
      }
      this.initialized = true;
    }

    return db;
  }

  async getAllAssets(): Promise<Asset[]> {
    return (await this.db).getAll('assets');
  }

  async addAsset(asset: Asset): Promise<void> {
    return (await this.db).add('assets', asset);
  }

  async updateAsset(asset: Asset): Promise<void> {
    return (await this.db).put('assets', asset);
  }

  async deleteAsset(id: string): Promise<void> {
    return (await this.db).delete('assets', id);
  }

  async getAssetsByType(type: string): Promise<Asset[]> {
    return (await this.db).getAllFromIndex('assets', 'by-type', type);
  }

  async getAssetsBySite(site: string): Promise<Asset[]> {
    return (await this.db).getAllFromIndex('assets', 'by-site', site);
  }
}

export const db = new Database();