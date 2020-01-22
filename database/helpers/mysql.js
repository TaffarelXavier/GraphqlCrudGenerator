const mysql = require('mysql');


module.exports = {
    operations: {
        create: async (configuration, objectType, object) => {
            return new Promise((resolve, reject) => {
                const con = mysql.createConnection({
                    host: configuration.host,
                    user: configuration.user,
                    password: configuration.password,
                    port: configuration.port || 3306,
                    database: configuration.db
                });

                con.connect(function(err) {
                    if (err) throw err;
                    
                    const sql = 'INSERT INTO '+objectType+' ('+Object.keys(object).join(',')+') VALUES ('+Object.keys(object).map(key => "'"+object[key]+"'").join(',')+')';
                    
                    con.query(sql, function (err, result) {
                        if (err) {
                            resolve({ status: 'failed' }); 
                        } else {
                            resolve(Object.assign({}, { id: result.insertId, status: 'created'}));
                        }

                        con.close();
                    });
                });
            })
        },
        update: async (configuration, objectType, id, object) => {
            return new Promise((resolve, reject) => {
                const con = mysql.createConnection({
                    host: configuration.host,
                    user: configuration.user,
                    password: configuration.password,
                    port: configuration.port || 3306,
                    database: configuration.db
                });

                con.connect(function(err) {
                    if (err) throw err;

                    const sql = 'UPDATE '+objectType+' SET '+Object.keys(object).map(key => key+"="+"'"+object[key]+"'").join(' AND ')+' WHERE id = '+id;
                    
                    con.query(sql, function (err, updateResult) {
                        if (err) {
                            resolve({ status: 'failed' }); 
                        } else {
                            resolve(Object.assign({}, { id: id, status: 'updated'}));
                        }

                        con.close();
                    })
                });
            })
        },
        get: async (configuration, objectType, id) => {
            return new Promise((resolve, reject) => {
                var con = mysql.createConnection({
                    host: configuration.host,
                    user: configuration.user,
                    password: configuration.password,
                    port: configuration.port || 3306,
                    database: configuration.db
                });

                con.connect(function(err) {
                    if (err) throw err;
                    
                    con.query('SELECT * FROM '+objectType+' WHERE id = '+id, function (err, result) {
                        if (err) throw err;

                        resolve(result && result.length ? result[0] : null);

                        con.close();
                    });
                });
            });
        },
        list: async (configuration, objectType) => {
            return new Promise((resolve, reject) => {
                var con = mysql.createConnection({
                    host: configuration.host,
                    user: configuration.user,
                    password: configuration.password,
                    port: configuration.port || 3306,
                    database: configuration.db
                });

                con.connect(function(err) {
                    if (err) {
                        resolve([]);

                        con.close();
                    } else {
                        con.query('SELECT * FROM '+objectType, function (err, result, fields) {
                            if (err) {
                                resolve([]);
                            } else {
                                resolve(result);
                            }
                            
                            con.close();
                        });
                    }
                  });
            });
        },
        delete: async (configuration, objectType, id) => {
            return new Promise((resolve, reject) => {
                var con = mysql.createConnection({
                    host: configuration.host,
                    user: configuration.user,
                    password: configuration.password,
                    port: configuration.port || 3306,
                    database: configuration.db
                });

                con.connect(function(err) {
                    if (err) throw err;

                    var sql = 'DELETE FROM '+objectType+' WHERE id = '+id;

                    con.query(sql, function (err, result, fields) {
                        if (err) {
                            resolve({ status: 'failed' }); 
                        } else {
                            resolve(Object.assign({}, { id: id, status: 'deleted'}));
                        }

                        con.close();
                    });
                });
            })
        }        
    }
}