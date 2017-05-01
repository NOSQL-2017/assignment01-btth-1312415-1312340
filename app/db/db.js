const Sequelize = require('sequelize');
if(process.env.DATABASE_URL){
    var sequelize = new Sequelize(process.env.DATABASE_URL);
}else{
    var sequelize = new Sequelize('user', 'user', '123456', {
        host: 'localhost',
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
}
sequelize
    .authenticate()
    .then(function(err) {
        console.log('connected to database 1');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = sequelize;

