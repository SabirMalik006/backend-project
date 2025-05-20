const express = require('express');
const router = express.Router();
const {postJob,getAllJobs,getJobById,updateJob,deleteJob} = require('../controller/jobs.controller');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Create a job — only employer and admin
router.post('/jobs', authMiddleware, authorizeRoles('employer', 'admin'), postJob);

// Get all jobs — open to all authenticated users (can be public if you want)
router.get('/jobs', getAllJobs);

// Get a specific job by ID — open to all authenticated users
router.get('/jobs/:id', authMiddleware, getJobById);

// Update a job — only employer and admin
router.put('/jobs/:id', authMiddleware, authorizeRoles('employer', 'admin'), updateJob);

// Delete a job — only admin and employer
router.delete('/jobs/:id', authMiddleware, authorizeRoles('admin' , 'employer'), deleteJob);

module.exports = router;
