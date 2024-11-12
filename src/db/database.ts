import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../../parkinfo.db'));

// Initialize database with tables
db.exec(`
  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    user TEXT NOT NULL,
    installDate TEXT NOT NULL,
    site TEXT,
    function TEXT,
    brand TEXT,
    model TEXT,
    serialNumber TEXT,
    operator TEXT,
    comments TEXT,
    deleted INTEGER DEFAULT 0,
    ipAddress TEXT,
    macAddress TEXT,
    service TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    site TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    function TEXT NOT NULL,
    role TEXT NOT NULL,
    password TEXT NOT NULL,
    deleted INTEGER DEFAULT 0
  );
`);

// Prepare statements
const getAllAssets = db.prepare('SELECT * FROM assets');
const getAssetById = db.prepare('SELECT * FROM assets WHERE id = ?');
const addAsset = db.prepare(`
  INSERT INTO assets (
    id, name, type, status, user, installDate, site, function,
    brand, model, serialNumber, operator, comments, deleted,
    ipAddress, macAddress, service
  ) VALUES (
    @id, @name, @type, @status, @user, @installDate, @site, @function,
    @brand, @model, @serialNumber, @operator, @comments, @deleted,
    @ipAddress, @macAddress, @service
  )
`);
const updateAsset = db.prepare(`
  UPDATE assets SET
    name = @name, type = @type, status = @status, user = @user,
    installDate = @installDate, site = @site, function = @function,
    brand = @brand, model = @model, serialNumber = @serialNumber,
    operator = @operator, comments = @comments, deleted = @deleted,
    ipAddress = @ipAddress, macAddress = @macAddress, service = @service
  WHERE id = @id
`);
const deleteAsset = db.prepare('DELETE FROM assets WHERE id = ?');

const getAllUsers = db.prepare('SELECT * FROM users');
const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const addUser = db.prepare(`
  INSERT INTO users (
    id, site, firstName, lastName, function, role, password, deleted
  ) VALUES (
    @id, @site, @firstName, @lastName, @function, @role, @password, @deleted
  )
`);
const updateUser = db.prepare(`
  UPDATE users SET
    site = @site, firstName = @firstName, lastName = @lastName,
    function = @function, role = @role, password = @password,
    deleted = @deleted
  WHERE id = @id
`);
const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');

// Export database operations
export const dbOperations = {
  assets: {
    getAll: () => getAllAssets.all(),
    getById: (id: string) => getAssetById.get(id),
    add: (asset: any) => addAsset.run(asset),
    update: (asset: any) => updateAsset.run(asset),
    delete: (id: string) => deleteAsset.run(id)
  },
  users: {
    getAll: () => getAllUsers.all(),
    getById: (id: string) => getUserById.get(id),
    add: (user: any) => addUser.run(user),
    update: (user: any) => updateUser.run(user),
    delete: (id: string) => deleteUser.run(id)
  }
};