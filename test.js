const core = require('./index')
const { assert, expect } = require('chai');

describe('Build graphQL elements', function() {

    it('Build graphQL resolvers', function(done) {
        const model = {
            name: 'Product',
            structure: {
                title: 'String!',
                description: 'String',
                price: 'Int'
            },
            datastore: core.databases.MONGO
        }

        core.registerModel(model.name, model.structure, model.datastore);

        const { resolvers } = core.buildSchema();
        const expectedResolversQueryNames = ['getProduct','listProduct'];
        const expectedResolversMutationNames = ['createProduct', 'updateProduct','deleteProduct'];
        const resolversKeys = Object.keys(resolvers);

        expect(resolversKeys).to.have.members(['Query', 'Mutation']);
        if(resolvers.Query) expect(Object.keys(resolvers.Query)).to.have.members(expectedResolversQueryNames);
        if(resolvers.Mutation) expect(Object.keys(resolvers.Mutation)).to.have.members(expectedResolversMutationNames);

        done();
    });

    it('Build graphQL typeDefs', function(done) {
        const model = {
            name: 'Product',
            datastore: core.databases.MONGO,
            structure: {
                title: 'String!',
                description: 'String',
                price: 'Int'
            },
        }

        core.registerModel(model.name, model.structure, model.datastore);

        const { typeDefs } = core.buildSchema();
        const expectedTypeDefs = `
            type Query {
                getProduct(id: ID!): Product 
                listProduct: [Product] 
            } 

            type Mutation {
                createProduct(input: ProductInputCreate!):Acknowledgment 
                updateProduct(id: ID!, input: ProductInputUpdate!):Acknowledgment 
                deleteProduct(id: ID!):Acknowledgment
            } 

            type Acknowledgment {id:ID status:String!} 

            type Product {title:String description:String price:Int} 

            input ProductInputCreate {title:String! description:String price:Int} 

            input ProductInputUpdate {title:String description:String price:Int}
        `;
    
        assert.equal(typeDefs.replace(/\n/g,'').replace(/\s/g,'_').replace(/_+/g,''), expectedTypeDefs.replace(/\n/g,'').replace(/\s/g,'_').replace(/_+/g,''));//.replace(/\n/g,' ').replace(/\t/g,' '));
        
        done();
    });
});