module.exports.register = (req, res, next) => {
  if (req.body.full_name === "" || !req.body.full_name) {
    return res.status(400).json({
      message: "Vui lòng nhập họ tên!",
    });
  }
  if (req.body.email === "" || !req.body.email) {
    return res.status(400).json({
      message: "Vui lòng nhập email!",
    });
  }
  if (req.body.password === "" || !req.body.password) {
    return res.status(400).json({
      message: "Vui lòng nhập mật khẩu!",
    });
  }
  // if(req.body.password !== req.body.confirm_password) {
  //   return res.status(400).json({
  //     message: "Mật khẩu xác nhận không khớp",
  //   });
  // }
  next();
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || !email) {
    return res.status(400).json({
      message: "Vui lòng nhập email!",
    });
  }
  if (password === "" || !password) {
    return res.status(400).json({
      message: "Vui lòng nhập mật khẩu!",
    });
  }
};
