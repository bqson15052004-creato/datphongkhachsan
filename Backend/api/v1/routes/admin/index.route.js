
const apiVersion = require("../../../../config/constant");
const accountRoute = require("./account.route");
const classificationRoute = require("./category-classification.route");
const systemDirectoryRoute = require("./system-directory.route");
const authRoute = require("./auth.route");




const PRE_ADMIN = "admin";

module.exports = (app) => {
    app.use(`${apiVersion.v1}/${PRE_ADMIN}`, accountRoute);
    app.use(`${apiVersion.v1}/${PRE_ADMIN}`, authRoute);
    app.use(`${apiVersion.v1}/${PRE_ADMIN}`, classificationRoute);
    app.use(`${apiVersion.v1}/${PRE_ADMIN}`, systemDirectoryRoute);


}
