const express = require('express');
const router = express.Router();
const todoSchema = require('../models/todo');
const user = require('../models/user');
const {createToken,validateToken} = require('../utils/token');


// Get all the todos
router.get('/todos',validateToken, async(req,res)=>{
    try {
        const todos = await todoSchema.find({userID:req.user.id});
        res.status(201).json(todos);
    } catch (error) {
        res.status(500).json({error:`Internal server Error`})
    }
});

// Create a todo
router.post('/todos' ,validateToken, async(req,res)=>{
    const {task, completed} = req.body;
    const userID = await user.findById(req.user.id);
    try {
        const newTodo = new todoSchema({
            task,
            completed,
            userID
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({error:`Internal server Error`})
    }
});

// deletetodo
router.delete('/todos/:id',async(req,res)=>{
    const todoID = req.params.id;

    try {
        await todoSchema.findByIdAndDelete(todoID);
        res.json({ message: 'Todo deleted successfully...' })
    } catch (error) {
        res.status(500).json({error:`Internal server Error`})
    }
});

// updatetodo
router.put('/todos/:id',async(req,res)=>{
    const todoID = req.params.id;
    const {task} = req.body
    try {
        const todo = await todoSchema.findById(todoID);
        if (todo) {
            todo.task = task;
            await todo.save();
            res.json(todo)
        } else {
            res.status(404).json({error:`Todo Not Found`});
        }
    } catch (error) {
        res.status(500).json({error:`Internal server Error`})
    }
});

module.exports = router;