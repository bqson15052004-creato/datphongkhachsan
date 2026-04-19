const Partner = require("../../model/partner.model");

module.exports.register = async (req, res, next) => {
  const { name_bussiness, id_tax, address_bussiness, email, password } =
    req.body;

  if (!name_bussiness || name_bussiness === "") {
    return res.status(400).json("Vui lòng nhập tên doanh nghiệp");
  }

  if (!id_tax || id_tax === "") {
    return res.status(400).json("Vui lòng nhập mã số thuế");
  }

  if (!address_bussiness || address_bussiness === "") {
    return res.status(400).json("Vui lòng nhập địa chỉ doanh nghiệp");
  }
  if (!email || email === "") {
    return res.status(400).json("Vui lòng nhập email");
  }
  if (!password || password === "") {
    return res.status(400).json("Vui lòng nhập mật khẩu");
  }
  next();
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailPartner = await Partner.findOne({
    email,
  });

  if (!emailPartner) {
    return res.status(400).json({
      message: "Tài khoản hoặc mật khẩu không đúng!",
    });
  }

  if (emailPartner.status === "block") {
    return res.status(403).json({
      message: "Tài khoản đã bị khóa!",
    });
  }

  if (emailPartner.password !== password) {
    return res.status(400).json({
      message: "Tài khoản hoặc mật khẩu không đúng!",
    });
  }
  next();
};
