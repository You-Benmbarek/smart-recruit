const Candidate = require("../Models/candidateModel");
const prepareUser = require("./userControler").prepareUser;
const fs = require('fs');
const path = require('path');

module.exports = {
    createCandidate: async (req, res) => {
        try { 
            
            const userData = await prepareUser(req);
            const candidateData = new Candidate({
                ...userData,
                role: 'Candidate',
                photo: req.file ? req.file.path : null,
                diplom: req.body.diplom,
                speciality: req.body.speciality,
            });
           
            await candidateData.save();
            res.status(201).json({message: 'Candidate created successfully ', data: candidateData});
        } catch (error) {
            res.status(500).json({message: 'Error creating candidate ' + error.message});
        } 
    },

    getAllCandidates: async (req, res) => {
        try {
            const candidates = await Candidate.find().select('-password');
            if (candidates.length === 0) {
                res.status(200).json({message: 'No candidates found', data: null});
            }
            res.status(200).json({message: 'Candidates retrieved successfully', data: candidates});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving candidates' + error.message});
        }
    },

    getCandidateById: async (req, res) => {
        try {
            const candidate = await Candidate.findById(req.params.id).select('-password');
            if (!candidate) {
                res.status(404).json({message: 'Candidate not found', data: null});
            }
            res.status(200).json({message: 'Candidate retrieved successfully', data: candidate});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving candidate' + error.message});
        }
    },  

    updateCandidate: async (req, res) => {
        try { 
            const candidate = await Candidate.findById(req.params.id);
            if (!candidate) {
                res.status(404).json({message: 'Candidate not found', data: null});
            }
            const updatedData = {
                ...req.body,
                photo: req.file ? req.file.path : candidate.photo,
            };
            if (req.file) {
                // Delete the old photo if it exists
                if (candidate.photo) {
                    const oldPhotoPath = path.join(__dirname, '..', candidate.photo);
                    fs.unlink(oldPhotoPath, (err) => {
                        if (err) {
                            console.error('Error deleting old photo:', err);
                        }
                    });
                }
                updatedData.photo = req.file.path;
                

            }

            const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, updatedData, {new: true});
            res.status(201).json({message: 'Candidate updated successfully', data: updatedCandidate});
        } catch (error) {
            if (req.file) fs.unlink(req.file.path, () => {}); // Delete the uploaded file if there's an error
            res.status(500).json({message: 'Error updating candidate' + error.message});
        }
    },

    deleteCandidate: async (req, res) => {
        try {
            const candidate = await Candidate.findByIdAndDelete(req.params.id); 
            if (!candidate) {
                res.status(404).json({message: 'Candidate not found', data: null});
            }
            res.status(200).json({message: 'Candidate deleted successfully', data: candidate});
        } catch (error) {
            res.status(500).json({message: 'Error deleting candidate' + error.message});
        }
    }
};


