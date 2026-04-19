
const authRoute = require("./auth.route");
const hotelRoute = require("./hotel.route");


const apiVersion = require("../../../../config/constant");

const PRE_PARTNER = "partner";


module.exports = (app) => {
    app.use(`${apiVersion.v1}/${PRE_PARTNER}`, authRoute);
    app.use(`${apiVersion.v1}/${PRE_PARTNER}`, hotelRoute);

}
