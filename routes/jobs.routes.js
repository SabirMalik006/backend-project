const express = require('express');
const router = express.Router();
// const jobController = require('../controller/jobs.controller');
const {postJob , getAllJobs , getJobById, updateJob , deleteJob} = require('../controller/jobs.controller');
// const verifyToken = require('../middleware/authMiddleware');

router.post('/jobs',  postJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id',  deleteJob);

module.exports = router;
