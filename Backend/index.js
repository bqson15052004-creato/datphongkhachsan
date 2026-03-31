const express = require("express");
const app = express();
const PORT = 3000;
const database = require("./config/database");
const routerAdmin = require("./api/v1/routes/admin/index.route");
const routerClient = require("./api/v1/routes/client/index.route");

database.connect();

routerAdmin(app);
routerClient(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

