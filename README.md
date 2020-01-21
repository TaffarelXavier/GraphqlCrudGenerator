graphql-crud-generator
==========

A light-weight library that generates ready-to-use GraphQL typedefs and resolvers providing crud operation for mysql, mongodb and elasticsearch. 

<!-- TOC -->

- [Features](#features)
- [Installation](#installation)
- [Loading the module](#loading-and-configuring-the-module)
- [Common Usage](#common-usage)
    - [Dynamic data structure registration](#dynamic-data-structure-registration)
    - [One-time schema building](#one-time-schema-building)
- [API](#api)
    - [registerDataStore](#registermodelname-datastore-structure)
    - [datastore configuration](#datastore-configuration)
    - [registerModel](#registermodelname-datastore-structure)
    - [structure](#model-structure)
    - [buildSchema](#buildschemadatastructure)
- [Database Model Naming](#database-model-naming)
- [License](#license)

<!-- /TOC -->

## Features

- Generate ready-to-use graphql crud type defs generation from a data model
- Generate ready-to-use graphql crud resolvers from a data model 

The generated type defs and resolvers can be used with NodeJS GraphQL http server such as `apollo-server-express`.

## Installation

```sh
$ npm install graphql-crud-generator
```

## Loading the module
```js
const graphqlCrudGenerator = require('graphql-crud-generator');
```

## Common Usage

#### Dynamic data structure registration

```js
const graphqlCrudGenerator = require('graphql-crud-generator'); 
const express = require('express');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');
const PORT = 5000;

graphqlCrudGenerator.registerDataStore('mongo_datastore', graphqlCrudGenerator.databases.MONGO, {
    host: 'localhost',
    db: 'mongo_database_name'
})

graphqlCrudGenerator.registerDataType('Product', 'mongo_datastore', {
    title: 'String!',
    description: 'String',
    price: 'Int'
})

const { typeDefs, resolvers } = graphqlCrudGenerator.buildSchema();
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
const httpServer = http.createServer(app);

httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
```

#### One-time schema building

```js
const express = require('express');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');
const PORT = 5000;

const datastructure = {
    datastores: [{
        name: 'mongo_1',
        type: 'mongodb',
        configuration: {
            host: 'localhost',
            port: '27017',
            db: 'mongo_database_name'
        }
    }, {
        name: 'mysql_1',
        type: 'mysql',
        configuration: {
            host: 'localhost',
            port: 3306,
            db: 'mysql_database_name',
            username: 'user',
            password: 'password'
        }
    }],
    models: [{
        name: 'Product',
        datastore: 'mongo_1',
        structure: {
            title: 'String!',
            description: 'String',
            price: 'Int',
            picture: 'String',
            category: 'Category'
        }
    }, {
        name: 'Category',
        datastore: 'mysql_1',
        structure: {
            title: 'String!',
            description: 'String',
            picture: 'String'
        }
    }]
};

const { typeDefs, resolvers } = graphqlCrudGenerator.buildSchema(datastructure);
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
const httpServer = http.createServer(app);

httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
```

## API

### registerDatastore(name, type, configuration)

- `name` A string representing the name of the datastore
- `type` A string representing the type of the datastore ( elasticsearch, mongo or mysql)
- `configuration` [configuration](#datastore-configuration) describing the datastore access informations

Register a new datastore.

### Datastore Configuration

Map representing the informations to connect to a datasource.

Example : 

```js
{
    [host]: the host of the database server
    [port]: the port of the database server
    [username]: the database connexion username
    [password]: the database connexion password 
    [db]: the name of the database
}
```

### registerModel(name, datastore, structure)

- `name` A string representing the name of the model
- `datastore` The name of the datastore hosting the model
- `structure` [structure](#model-structure) describing the model structure

Register a new data model.

### Model Structure

Map representing the name and type of each attribute of the data model. Each type must be written following the graphQL type format.
Reference to other model types are allowed but nested query and nested mutation operations are not yet supported.

Example :

```js
{
    name: "String!",
    description: "String!",
    price: "Int"
}
```

### buildSchema([dataStructure])

- `dataStructure` [structure](#data-structure)  optional object describing all the data structure

Build the GraphQL type defs and resolvers. If the data structure is not provided, the schema is built from the datastores and data models previously registered programatically.

### Data Structure

Map containing all the datastores and models.

```js
{
    datastores: [an array of datastore objects],
    models: [an array of data model objects]
}
```

Each datastore object must contain the name, type and configuration fields.

```js
{
    name: 'mongo_1',
    type: 'mongo',
    configuration: {
        host: 'localhost',
        port: '27017',
        db: 'mongo_database_name'
    }
}
```

Each model object must contain the name, datastore and structure fields.

```js
{
    name: 'Product',
    datastore: 'mongo_1',
    structure: {
        title: 'String!',
        description: 'String',
        price: 'Int',
        picture: 'String',
        category: 'Category'
    }
}
```

## Database Model Naming

Some databases such as elasticsearch doesn't allow index names starting by a capital letter.
All the database model structures ( table, collection or indexes ) are currently named converting the model name into a snake_case string. 

## License

MIT

[npm-url]: https://www.npmjs.com/package/graphql-crud-generator