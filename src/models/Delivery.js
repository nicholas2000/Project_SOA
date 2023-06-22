const { getDB } = require("../configs/connection");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Delivery extends Model {}

Delivery.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Delivery",
        tableName: "delivery"
    }
)

//sebelum nge sync tolong dibuat database dulu dengan nama yg sama. nama bisa di liat di config/connection.js
//kalau baru awal trs mw nge sync otomatis ke database ini dinyalain selain itu tolong jangan lupa dimatiin
// Delivery.sequelize.sync({force:true});

module.exports = Delivery