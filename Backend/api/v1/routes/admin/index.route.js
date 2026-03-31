
const apiVersion = require("../../../../config/constant");
const accountRoute = require("./account.route");
const PRE_ADMIN = "admin";

module.exports = (app) => {

    app.use(`${apiVersion.v1}/${PRE_ADMIN}`, accountRoute);
}
