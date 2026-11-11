const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
    createUser: async (req, res) => {
        try { 
            const existingUser = await userModel.findOne({email: req.body.email});
            if (existingUser) {
                res.status(400).json({message: 'Email already exists'});
            }
            const newUser = new userModel(req.body);
            newUser.password = await bcrypt.hash(newUser.password, 10);
            await newUser.save();
            res.status(201).json({message: 'User created successfully', data: newUser});
        } catch (error) {
            res.status(500).json({message: 'Error creating user' + error.message});
        }       
    },

    prepareUser: async (req) => {
        
            const user = await userModel.findOne({email: req.body.email});
            if (user) {
                const err = new Error('Email already exists');
                err.status = 400;
                throw err;
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
             // Objet simple, pas un document Mongoose
        return {
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        telephone: req.body.telephone,
        };
                 
    },



    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find().select('-password');
            if (users.length === 0) {
                res.status(200).json({message: 'No users found', data: null});
            }
            res.status(200).json({message: 'Users retrieved successfully', data: users});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving users' + error.message});
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id).select('-password');
            if (!user) {
                res.status(404).json({message: 'User not found', data: null});
            }
            res.status(200).json({message: 'User retrieved successfully', data: user});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving user' + error.message});
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if (!user) {
                res.status(404).json({message: 'User not found', data: null});
            }
            res.status(201).json({message: 'User updated successfully', data: user});
        } catch (error) {
            res.status(500).json({message: 'Error updating user' + error.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findByIdAndDelete(req.params.id);   
            if (!user) {
                res.status(404).json({message: 'User not found', data: null});
            }
            res.status(201).json({message: 'User deleted successfully', data: user});
        } catch (error) {
            res.status(500).json({message: 'Error deleting user' + error.message});
        }
    }

}