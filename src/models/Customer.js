const { getDB } = require("../configs/connection");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Customer extends Model {}

Customer.init(
    {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        saldo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Customer",
        tableName: "customers"
    }
)

//sebelum nge sync tolong dibuat database dulu dengan nama yg sama. nama bisa di liat di config/connection.js
//kalau baru awal trs mw nge sync otomatis ke database ini dinyalain selain itu tolong jangan lupa dimatiin
// Customer.sequelize.sync({force:true});

module.exports = Customer;