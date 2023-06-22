const { getDB } = require("../configs/connection");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Cart extends Model {}

Cart.init(
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
        timestamps: false,
        paranoid: false,
        modelName: "Cart",
        tableName: "carts"
    }
)

//sebelum nge sync tolong dibuat database dulu dengan nama yg sama. nama bisa di liat di config/connection.js
//kalau baru awal trs mw nge sync otomatis ke database ini dinyalain selain itu tolong jangan lupa dimatiin
// Cart.sequelize.sync({force:true});

module.exports = Cart