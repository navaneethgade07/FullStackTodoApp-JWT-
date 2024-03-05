const express = require('express');
const router = express.Router();
const todoSchema = require('../models/todo');
const user = require('../models/user');
const {createToken,validateToken} = require('../utils/token');

// Get all the todos
router.get('/todos',validateToken, async(req,res)=>{
    try {
        const todos = await todoSchema.find({userID:req.user.id});
        res.status(2
