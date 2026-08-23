const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Ensure db file exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], predictions: [] }, null, 2));
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (err) {
    return { users: [], predictions: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
  }
}
Schema.Types = { ObjectId: String };
Schema.ObjectId = String;

class Query {
  constructor(promise, modelName) {
    this.promise = promise;
    this.modelName = modelName;
    this.includePasswordHash = false;
  }
  
  select(fields) {
    if (typeof fields === 'string') {
      if (fields.includes('+passwordHash')) {
        this.includePasswordHash = true;
      }
    }
    return this;
  }
  
  sort(field) {
    this.promise = this.promise.then(results => {
      if (Array.isArray(results) && field) {
        const key = field.startsWith('-') ? field.slice(1) : field;
        const multiplier = field.startsWith('-') ? -1 : 1;
        return [...results].sort((a, b) => {
          const valA = a[key] !== undefined ? a[key] : '';
          const valB = b[key] !== undefined ? b[key] : '';
          if (valA < valB) return -1 * multiplier;
          if (valA > valB) return 1 * multiplier;
          return 0;
        });
      }
      return results;
    });
    return this;
  }
  
  then(resolve, reject) {
    return this.promise.then(res => {
      const clean = (item) => {
        if (!item) return item;
        if (this.modelName === 'User' && !this.includePasswordHash) {
          const copy = { ...item };
          delete copy.passwordHash;
          return copy;
        }
        return item;
      };
      if (Array.isArray(res)) {
        return res.map(clean);
      }
      return clean(res);
    }).then(resolve, reject);
  }
  
  catch(reject) {
    return this.promise.catch(reject);
  }
}

const registeredModels = {};

function createModel(modelName, schema) {
  const collectionName = modelName.toLowerCase() + 's';

  class Model {
    constructor(data) {
      Object.assign(this, data);
    }

    async save() {
      const db = readDB();
      const collection = db[collectionName] || [];
      if (!this._id) {
        this._id = Math.random().toString(36).substring(2, 15);
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        collection.push(JSON.parse(JSON.stringify(this)));
      } else {
        const index = collection.findIndex(item => item._id === this._id);
        this.updatedAt = new Date().toISOString();
        const plainObject = JSON.parse(JSON.stringify(this));
        if (index !== -1) {
          collection[index] = plainObject;
        } else {
          collection.push(plainObject);
        }
      }
      db[collectionName] = collection;
      writeDB(db);
      return this;
    }

    async deleteOne() {
      if (!this._id) return;
      const db = readDB();
      const collection = db[collectionName] || [];
      const index = collection.findIndex(item => item._id === this._id);
      if (index !== -1) {
        collection.splice(index, 1);
        db[collectionName] = collection;
        writeDB(db);
      }
    }

    static find(query = {}) {
      const promise = Promise.resolve().then(() => {
        const db = readDB();
        const collection = db[collectionName] || [];
        return collection
          .filter(item => {
            for (const key in query) {
              if (item[key] !== query[key]) return false;
            }
            return true;
          })
          .map(item => new Model(item));
      });
      return new Query(promise, modelName);
    }

    static findOne(query = {}) {
      const promise = Promise.resolve().then(() => {
        const db = readDB();
        const collection = db[collectionName] || [];
        const found = collection.find(item => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        return found ? new Model(found) : null;
      });
      return new Query(promise, modelName);
    }

    static findById(id) {
      const promise = Promise.resolve().then(() => {
        if (!id) return null;
        const db = readDB();
        const collection = db[collectionName] || [];
        const found = collection.find(item => item._id === id.toString());
        return found ? new Model(found) : null;
      });
      return new Query(promise, modelName);
    }

    static async create(data) {
      const instance = new Model(data);
      return instance.save();
    }
  }

  return Model;
}

function model(modelName, schema) {
  if (!schema) {
    if (registeredModels[modelName]) {
      return registeredModels[modelName];
    }
    throw new Error(`Model ${modelName} is not registered`);
  }
  
  if (registeredModels[modelName]) {
    return registeredModels[modelName];
  }

  const Model = createModel(modelName, schema);
  registeredModels[modelName] = Model;
  return Model;
}

const connection = {
  host: 'mock-in-memory-db'
};

const mockMongoose = {
  Schema,
  model,
  connection,
  connect: async (uri) => {
    console.log('Mock Mongoose connected successfully (JSON file database).');
    return {
      connection
    };
  }
};

module.exports = mockMongoose;
