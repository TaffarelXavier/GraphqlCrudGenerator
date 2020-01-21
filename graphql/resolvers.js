const database = require('../database');

const build = () => {
    const resolvers = {
        Query: {},
        Mutation: {}
    };

    const models = database.getModels();

    models.forEach((model) => {
        resolvers.Query['get'+model.name] = async (parent, args, context, info) => {
            let record = await database.operations.get(model.datastore, model.dataName, args.id);
            return record;        
        }
        resolvers.Query['list'+model.name] = async (parent, args, context, info) => {
            let records = await database.operations.list(model.datastore, model.dataName);
            return records;                
        }
        resolvers.Mutation['create'+model.name] = async (parent, args, context, info) => {
            let acknowledgment = await database.operations.create(model.datastore, model.dataName, args.input);
            return acknowledgment;        
        }
        resolvers.Mutation['update'+model.name] = async (parent, args, context, info) => {
            let acknowledgment = await database.operations.update(model.datastore, model.dataName, args.id, args.input);
            return acknowledgment;                
        }
        resolvers.Mutation['delete'+model.name] = async (parent, args, context, info) => {
            let acknowledgment = await database.operations.delete(model.datastore, model.dataName, args.id);
            return acknowledgment;        
        }
    });

    return resolvers;
};

module.exports = {
    build: build
}