const database = require('../database');

module.exports =  {
    build: () => {
        const objectTypes = {};
        const inputTypesCreate = {};
        const inputTypesUpdate = {};
        const queryTypes = [];
        const mutationTypes = [];
        const models = database.getModels();

        models.forEach((model) => {
            objectTypes[model.name] = 'type '+model.name+' {'+Object.keys(model.structure)
            .map((key) => {
                return key+':'+ model.structure[key].replace('!', '');
            }).join(' ')+'}';

            inputTypesCreate[model.name] = 'input '+model.name+'InputCreate {'+Object.keys(model.structure)
            .filter(key => ['String','Int','Float','Boolean','String!','Int!','Float!','Boolean!'].indexOf(model.structure[key]) !== -1)
            .map((key) => {
                return key+':'+ model.structure[key];
            }).join(' ')+'}';

            inputTypesUpdate[model.name] = 'input '+model.name+'InputUpdate {'+Object.keys(model.structure)
            .filter(key => ['String','Int','Float','Boolean','String!','Int!','Float!','Boolean!'].indexOf(model.structure[key]) !== -1)
            .map((key) => {
                return key+':'+ model.structure[key].replace('!','');
            }).join(' ')+'}';

            queryTypes.push('get'+model.name+'(id: ID!): ' + model.name);
            queryTypes.push('list'+model.name+': '+'['+model.name+']');
            
            mutationTypes.push('create'+model.name+'(input: '+model.name+'InputCreate!):Acknowledgment');
            mutationTypes.push('update'+model.name+'(id: ID!, input: '+model.name+'InputUpdate!):Acknowledgment');
            mutationTypes.push('delete'+model.name+'(id: ID!):Acknowledgment');
        })

        const acknowledgementType = {
            id: 'ID',
            status: 'String!'
        }

        const queryTypesString = 'type Query {'+queryTypes.join(' ')+'}';
        const mutationTypesString = 'type Mutation {'+mutationTypes.join(' ')+'}';
        const acknowledgmentTypeString = 'type Acknowledgment {'+Object.keys(acknowledgementType).map((key) => {
            return key+':'+ acknowledgementType[key];
        }).join(' ')+'}';

        const inputTypesUpdateString = Object.keys(inputTypesUpdate).map(key => inputTypesUpdate[key]).join(' ');
        const objectTypesString = Object.keys(objectTypes).map(key => objectTypes[key]).join(' ');
        const inputTypesCreateString = Object.keys(inputTypesCreate).map(key => inputTypesCreate[key]).join(' ');
    
        const typeDefs = [
            queryTypesString,
            mutationTypesString,
            acknowledgmentTypeString,
            objectTypesString, 
            inputTypesCreateString, 
            inputTypesUpdateString
        ].join(' ');

        return typeDefs;
    }
};