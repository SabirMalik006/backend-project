const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobs.controller');
// const verifyToken = require('../middleware/authMiddleware');

router.post('/jobs',  jobController.postJob);
router.get('/jobs', jobController.getAllJobs);
router.put('/jobs/:id',  jobController.updateJob);
router.delete('/jobs/:id',  jobController.deleteJob);

module.exports = router;
