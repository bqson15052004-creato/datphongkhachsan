const Account = require("../../model/account.model");


// [GET] /api/v1/management-hotel/account
module.exports.index = async(req,res) => {
    const accounts = await Account.find({});
    if(!accounts || accounts.length === 0) {
        return res.status(200).json({
            message: "No accounts found"
        })
    }
    res.status(200).json({
        accounts
    })   
}


// [GET] /api/v1/management-hotel/account/my-account/:id_user
module.exports.myAccount = async(req,res) => {
    const { id_user } = req.params;

    const existingAccount = await Account.findOne({
        _id: id_user,
    });

    if(!existingAccount) {
        return res.status(403).json({
            message: "Tài khoản không tồn tại!"
        })
    }
    res.status(200).json({
        account: existingAccount,
        message: "Lấy thông tin tài khoản thành công!"
    });



}