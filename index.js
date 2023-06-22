const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = 3000;

const customers = require("./src/routes/customers");
const products = require("./src/routes/products");
const carts = require("./src/routes/carts");
const delivery = require("./src/routes/delivery");

app.use("/api/customer", customers);
app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/delivery", delivery);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});