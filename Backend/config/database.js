
const express = require('express');
const mongoose = require('mongoose');

module.exports.connect = async () => {
    try{
        mongoose.connect("mongodb+srv://yiwang0508_db_user:9ksYrCL3OuU5tFzF@cluster0.sjssrbu.mongodb.net/Management-Hotel?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Connected to database successfully");
    }

    catch(error) {
        throw new Error("Error connecting to database: " + error.message);
    }
}
