const Caminte = require('caminte');
const Schema = Caminte.Schema;
const config = {
    driver     : "neo4j",
    host       : process.env.DATABASE4_HOST || "localhost",
    port       : "7474"
};

var schema = new Schema(config.driver, config);

module.exports = schema;