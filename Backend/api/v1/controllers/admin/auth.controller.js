const Account = require("../../model/account.model");



// [POST] /api/v1/management-hotel/account/register
module.exports.register = async(req,res) => {
    try{
        const {full_name, email, password} = req.body;
        
        const existingAccount = await Account.findOne({
            email
        });

        if(existingAccount) {
            return res.status(400).json({
                message: "Email đã tồn tại!"
            });
        }

        const infoAcccount = {
            full_name,
            email,
            password,
        };
    
        const newAccount = new Account(infoAcccount);
        await newAccount.save();
        res.status(201).json({
            message: "Tạo tài khoản thành công!",
        });

    }
    catch(error){
        res.status(400).json({
            message: "Tạo tài khoản thất bại!",
        });
    }
    
}

// [POST] /api/v1/management-hotel/account/register
module.exports.login = async(req,res) => {
    const {email, password} = req.body;

    const existingAccount = await Account.findOne({
        email,
    });
    if(existingAccount.status === "block"){
        return res.status(403).json({
            message: "Tài khoản đã bị khóa!"
        })
    }
    if(!existingAccount) {
        return res.status(400).json({
            message: "Tài khoản hoặc mật khẩu không đúng!"
        })
    };

    if(existingAccount.password !== password) {
        return res.status(400).json({
            message: "Tài khoản hoặc mật khẩu không đúng!"
        });
    };

    res.status(200).json({
        message: "Đăng nhập thành công!",
    })


    res.json("ok");
}