const MONGO = 'mongo';
const ELASTICSEARCH = 'elasticsearch';
const MYSQL = 'mysql';
const databases = { MONGO, ELASTICSEARCH, MYSQL };
const typedefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const database = require('./database');

const registerDatastore = (name, type, configuration) => {
    database.registerDatastore(name, type, configuration);
};

const registerDatastores = (datastores) => {
    datastores.forEach((datastore) => {
        registerDatastore(datastore.name, datastore.type, datastore.configuration);
    });    
};

const registerModel = (name, structure, datastore) => {
    database.registerModel(name, structure, datastore);
};

const registerModels = (models) => {
    models.forEach((model) => {
        registerModel(model.name, model.structure, model.datastore);
    });    
};

const buildTypeDefs = () => {
    return typedefs.build();
};

const buildResolvers = () => {
    return resolvers.build();
};

const buildSchema = (datastructure) => {
    if(datastructure) {
        registerDatastores(datastructure.datastores);
        registerModels(datastructure.models);
    }
    
    return {
        typeDefs: buildTypeDefs(),
        resolvers: buildResolvers()
    }
};

module.exports = {
    databases: databases,
    registerDatastore: registerDatastore,
    registerModel: registerModel,
    buildSchema: buildSchema
}