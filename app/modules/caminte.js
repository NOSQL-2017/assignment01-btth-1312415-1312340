const Caminte = require('caminte');
const Schema = Caminte.Schema;
const config = {
    driver     : "neo4j", // mariadb
    host       : "localhost",
    port       : "7474"
};

var schema = new Schema(config.driver, config);

module.exports = schema;