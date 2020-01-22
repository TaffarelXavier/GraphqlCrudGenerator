const { MongoClient, ObjectID } = require('mongodb');

module.exports = {
    operations: {
        create: async (configuration, objectType, object) => {
            return new Promise((resolve, reject) => {
                MongoClient.connect(configuration.host, function(err, db) {
                    if (err) { 
                        resolve({ status: 'failed' }); 
                        return db.close(); 
                    };
                    
                    const dbo = db.db(configuration.db);
                    
                    dbo.collection(objectType).insertOne(object, function(err, res) {
                        if (err) {
                            resolve({ id: id, status: 'failed' });
                        } else {
                            resolve({ id: res.insertedId, status: 'created' });
                        }

                        db.close();
                    });
                });
            })
        },
        update: (configuration, objectType, id, object) => {
            return new Promise((resolve, reject) => {
                MongoClient.connect(configuration.host, function(err, db) {
                    if (err) { 
                        resolve({ status: 'failed' }); 
                        return db.close(); 
                    };

                    const dbo = db.db(configuration.db);
                    const _id = new ObjectID(id);
                    
                    dbo.collection(objectType).findOneAndUpdate({ _id: _id }, { $set: object }, { returnOriginal: false }, function (err, res) {
                        if (err) {
                            resolve({ id: id, status: 'failed' });
                        } else {
                            resolve({ id: id, status: 'updated' });
                        }

                        db.close();
                    })
                });
            })
        },
        get: (configuration, objectType, id) => {
            return new Promise((resolve, reject) => {
                MongoClient.connect(configuration.host, function(err, db) {
                    if (err) { 
                        resolve({ status: 'failed' }); 
                        return db.close(); 
                    };

                    const dbo = db.db(configuration.db);
                    const _id = new ObjectID(id);
                    
                    dbo.collection(objectType).findOne({_id: _id}, function(err, doc) {
                        if (err) throw err;
                        
                        let record = Object.assign({}, {id: doc._id}, doc);
                        delete record._id;
                        
                        resolve(record);
                        
                        db.close();
                    });
                });
            })
        },
        list: (configuration, objectType) => {
            return new Promise((resolve, reject) => {
                MongoClient.connect(configuration.host, function(err, db) {
                    if (err) { 
                        resolve({ status: 'failed' }); 
                        return db.close(); 
                    };

                    const dbo = db.db(configuration.db);
                    
                    dbo.collection(objectType).find({}).toArray(function(err, docs) {
                        if (err) throw err;
                        
                        const records = docs.map((doc) => {
                            let record = Object.assign({}, {id: doc._id}, doc);
                            delete record._id;
                            return record;
                        })

                        resolve(records);
                        
                        db.close();
                    });
                });
            })
        },
        delete: (configuration, objectType, id) => {
            return new Promise((resolve, reject) => {
                MongoClient.connect(configuration.host, function(err, db) {
                    if (err) { 
                        resolve({ status: 'failed' }); 
                        return db.close(); 
                    };

                    const dbo = db.db(configuration.db);
                    const _id = new ObjectID(id);
                    
                    dbo.collection(objectType).deleteOne({ _id: _id }, function (err, res) {
                        if (err) {
                            resolve({ id: id, status: 'failed' });
                        } else {
                            resolve({ id: id, status: 'deleted' });
                        }

                        db.close();
                    })
                });
            })       
        }        
    }
}