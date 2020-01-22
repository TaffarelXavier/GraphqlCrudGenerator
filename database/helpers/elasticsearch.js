const fetch = require('node-fetch');

module.exports = {
    operations: {
        create: async (configuration, objectType, object) => {
            const url = configuration.host + ':' + configuration.port + '/' + objectType + '/_doc';
            const response = await fetch(url, {
                method: 'post',
                body:    JSON.stringify(object),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json());
            
            if(!response.result || response.result !== 'created') return { status: 'failed' };
            
            return Object.assign({id: response._id}, { status: 'created' });
        },
        update: async (configuration, objectType, id, object) => {
            const url = configuration.host + ':' + configuration.port + '/' + objectType + '/_update/' + id;
            const response = await fetch(url, {
                method: 'post',
                body:    JSON.stringify({doc : object }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json());
            
            if(!response.result || response.result !== 'updated') return { status: 'failed' };
            
            return Object.assign({id: response._id}, { status: 'updated' });
        },
        get: async (configuration, objectType, id) => {
            const url = configuration.host + ':' + configuration.port + '/' + objectType + '/_doc/'+id;
            const response = await fetch(url, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json());
            
            if(response.found) return Object.assign({ id: response._id }, response._source)
            
            return null;
        },
        list: async (configuration, objectType) => {
            const url = configuration.host + ':' + configuration.port + '/' + objectType + '/_search';
            const response = await fetch(url, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json());
            
            if(response && response.hits && response.hits.hits) return response.hits.hits.map(hit => Object.assign({ id: hit._id }, hit._source));
            
            return [];
        },
        delete: async (configuration, objectType, id) => {
            const url = configuration.host + ':' + configuration.port + '/' + objectType + '/_doc/'+id;
            const response = await fetch(url, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json());
            
            if(!response.result || response.result !== 'deleted') return { status: 'failed' };
            
            return Object.assign({id: response._id}, { status: 'deleted' });
        }        
    }
}