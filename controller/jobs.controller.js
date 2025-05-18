require('dotenv').config(); // Load .env variables

const Job = require('../models').Job;
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Get secret from .env

// Create Job
const postJob = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'fail', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { title, location, salary, description } = req.body;

    if (!title || !location || !salary || !description) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const newJob = await Job.create({
      title,
      location,
      salary,
      description,
      userId: decoded.id, // Set userId from token
      createdAt: new Date()
    });

    res.status(201).json({ status: 'success', data: newJob });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Jobs (No token needed to list all jobs)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json({ status: 'success', data: jobs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }
    res.json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Job
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, location, salary, description , category } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    // if (job.userId !== decoded.id) {
    //   return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    // }

    await job.update({ title, location, salary, description , category });

    res.json({ status: 'success', data: job });
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    // if (job.userId !== decoded.id) {
    //   return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    // }

    await job.destroy();

    res.json({ status: 'success', message: 'Job deleted successfully' });
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

module.exports = { postJob, getAllJobs , getJobById, updateJob, deleteJob };
