module.exports.create = (req, res, next) => {
  const { name_system_directory, id_category_classification, description } = req.body;

  if (!name_system_directory || name_system_directory === "") {
    return res.status(400).json({
      message: "Tên danh mục hệ thống không được để trống!",
    });
  }

  if (!id_category_classification) {
    return res.status(400).json({
      message: "Hãy chọn phân loại danh mục hệ thống!",
    });
  }
  next();
};
