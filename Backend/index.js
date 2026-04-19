const express = require("express");
const app = express();
const PORT = 3000;
const database = require("./config/database");
const routerAdmin = require("./api/v1/routes/admin/index.route");
const routerClient = require("./api/v1/routes/client/index.route");
const routerPartner = require("./api/v1/routes/partner/index.route");




// body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());


database.connect();

routerAdmin(app);
routerClient(app);
routerPartner(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

