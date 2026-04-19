const systemDirectory = require('../../model/system-directory.model');

// [GET] /api/v1/admin/system-directory
module.exports.index = async (req,res) => {
    const systemDirectories = await systemDirectory.find();
    if(!systemDirectories || systemDirectories.length === 0) {
        return res.status(400).json({
            message: "Danh mục hệ thống trống!"
        });
    };
    res.status(200).json({
        systemDirectories,
        message: "Lấy danh mục hệ thống thành công!"
    });
}

// [POST] /api/v1/admin/system-directory/create
module.exports.create = async (req,res) => {
    const { name_system_directory, id_category_classification, description } = req.body;
    

    const newSystemDirectory = new systemDirectory({
        name_system_directory,
        id_category_classification,
        description: description || ""
    });

    await newSystemDirectory.save();

    res.status(201).json({
        systemDirectory: newSystemDirectory,
        message: "Tạo danh mục hệ thống thành công!"
    });
}