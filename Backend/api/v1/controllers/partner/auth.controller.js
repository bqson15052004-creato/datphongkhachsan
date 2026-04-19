const Partner = require("../../model/partner.model");
const jwt = require("jsonwebtoken");

// let refreshTokens = [];


// [POST] /api/v1/management-hotel/partner/auth/register
module.exports.register = async (req,res) => {
    try{

        const {name_bussiness, id_tax, address_bussiness, email, password} = req.body;
        
        const existPartner = await Partner.findOne({
            email
        });
        if(existPartner) {
            return res.status(400).json({
                message: "Email đã tồn tại!",
            });
        }
    
        const newPartner = new Partner({
            name_bussiness,
            id_tax, 
            address_bussiness,
            email,
            password,
        });
    
        await newPartner.save();
    
        
        res.status(201).json({
            message: "Đăng ký tài khoản thành công!",
        });
    }

    catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Lỗi hệ thống!",
        })
    }
}   


// module.exports.hotel = async (req,res) => {
//     const authorization = req.headers.authorization;
//     const token = authorization.split(" ")[1];

//     if(!token) {
//         return res.status(401).json({
//             message: "Không có token truy cập!",
//         });
//     }

//     jwt.verify(token, "ACCESS_TOKEN_SECRET", (error, data) => {
//         if(error) {
//             return res.sendStatus(403);
//         }
//         console.log(data);
//         return res.sendStatus(200);

//     });

// }


// module.exports.refreshToken = async (req,res) => {
//     const token = req.body.token;

//     if(!token) {
//         return res.status(401).json({
//             message: "Không có token truy cập!",
//         });
//     }

//     if(!refreshTokens.includes(token)) {
//         return res.status(403).json({
//             message: "Token không hợp lệ 1!",
//         });
//     }

//     jwt.verify(token, "REFRESH_TOKEN_SECRET", (error, data) => {
//         if(error) {
//             return res.status(403).json({
//                 message: "Token không hợp lệ 2!",
//             });
//         }

//         const accessToken = jwt.sign({email: data.email}, "ACCESS_TOKEN_SECRET", {expiresIn: "30s"});
//         res.status(200).json({
//             accessToken,
//         });
//     })

// }





// [POST] /api/v1/management-hotel/partner/auth/login
module.exports.login = async (req,res) => {
    const {email, password} = req.body;
    
    // const accessToken = jwt.sign(req.body, "ACCESS_TOKEN_SECRET", {expiresIn: "30s"});

    // const refreshToken = jwt.sign(req.body, "REFRESH_TOKEN_SECRET");
    // refreshTokens.push(refreshToken);
    // console.log(refreshTokens);
    res.status(200).json({
        message: "Đăng nhập thành công!",  
        // accessToken,
        // refreshToken,
    });

}