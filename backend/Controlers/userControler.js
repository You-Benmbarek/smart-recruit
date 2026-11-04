const userModel = require('../Models/userModel');

module.exports = {
    createUser: async (req, res) => {
        try { const newUser = new userModel(req.body);
            await newUser.save();
            res.status(201).json({message: 'User created successfully', data: newUser});
        } catch (error) {
            res.status(500).json({message: 'Error creating user' + error.message});
        }       
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find();
            if (users.length === 0) {
                res.status(404).json({message: 'No users found', data: null});
            }
            res.status(201).json({message: 'Users retrieved successfully', data: users});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving users' + error.message});
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                res.status(404).json({message: 'User not found', data: null});
            }
            res.status(201).json({message: 'User retrieved successfully', data: user});
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