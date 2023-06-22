const Sequelize = require("sequelize");
const db = new Sequelize('proyek_soa','root','',
    {
        host: 'localhost',
        port: 3306, 
        dialect: "mysql",
        logging: true,
        timezone: "+07:00",
    }
);
module.exports = {
    initDB: () => {
        return db.authenticate();
    },
    getDB: () => {
        return db;
    },
};