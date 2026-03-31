
const apiVersion = require("../../../../config/constant");
const userRoute = require("./user.route");

module.exports = (app) => {
    app.use(`${apiVersion.v1}`, userRoute);
}
