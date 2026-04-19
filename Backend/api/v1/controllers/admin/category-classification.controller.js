const CategoryClassification = require("../../model/category-classification.model");

// [GET] /api/v1/management-hotel/category-classification
module.exports.index = async(req,res) => {
    const categoryClassifications = await CategoryClassification.find({});
    if(!categoryClassifications || categoryClassifications.length === 0) {
        return res.status(200).json({
            message: "Phân loại danh mục trống"
        })
    }
    res.status(200).json({
        categoryClassifications,
        message: "Lấy phân loại danh mục thành công"
    });
}

// [POST] /api/v1/management-hotel/category-classification/create
module.exports.create = async(req,res) => {
    const { name_category_classification, description } = req.body;
    
    const existingClassification = await CategoryClassification.findOne({
        name_category_classification
    });

    if(existingClassification) {
        return res.status(400).json({
            message: "Tên phân loại danh mục đã tồn tại"
        });
    }

    const newClassification = new CategoryClassification({
        name_category_classification,
        description: description || "",
    });

    await newClassification.save();
    res.status(201).json({
        message: "Tạo phân loại danh mục thành công"
    });
}

