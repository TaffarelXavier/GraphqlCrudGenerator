const utils = require('../utils');
const datastores = {};
const models = {};
const helpers = require('./helpers');

module.exports = {
    registerDatastore: (name, type, configuration) => {
        datastores[name] = { type, configuration };
    },
    registerModel: (name, structure, datastore) => {
        models[name] = {
            name: name,
            dataName: utils.camelCaseToSnakeCase(name),
            structure: structure,
            datastore: datastore
        };
    },
    getDatastores: () => {
        return datastores;
    },
    getModels: () => {
        return Object.values(models);
    },
    operations: {
        create: async (datastore, objectType, object) => {
           return await helpers[datastores[datastore].type].operations.create(datastores[datastore].configuration, objectType, object);
        },
        update: async (datastore, objectType, id, object) => {
            return await helpers[datastores[datastore].type].operations.update(datastores[datastore].configuration, objectType, id, object);
        },
        get: async (datastore, objectType, id) => {
            return await helpers[datastores[datastore].type].operations.get(datastores[datastore].configuration, objectType, id);        
        },
        list: async (datastore, objectType) => {
            return await helpers[datastores[datastore].type].operations.list(datastores[datastore].configuration, objectType);
        },
        delete: async (datastore, objectType, id) => {
            return await helpers[datastores[datastore].type].operations.delete(datastores[datastore].configuration, objectType, id);       
        }
    }
}