module.exports.create = (req, res, next) => {
  const { name_category_classification, description } = req.body;
  if (!name_category_classification || name_category_classification === "") {
    return res.status(400).json({
      message: "Tên phân loại danh mục không được để trống",
    });
  }
  next();
};
