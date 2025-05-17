const { Job } = require('../models');

// ✅ Create Job
const postJob = async (req, res) => {
  try {
    const { title, location, salary, description } = req.body;

    if (!title || !location || !salary || !description) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const newJob = await Job.create({
      title,
      location,
      salary,
      description, // JWT token se aata hai
      createdAt: new Date()
    });

    res.status(201).json({ status: 'success', data: newJob });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json({ status: 'success', data: jobs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ Update Job
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, location, salary, description } = req.body;

  try {
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    // Optional: Only owner can update
    if (job.userId !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    await job.update({ title, location, salary, description });

    res.json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ Delete Job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    // Optional: Only owner can delete
    if (job.userId !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    await job.destroy();

    res.json({ status: 'success', message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { postJob, getAllJobs, updateJob, deleteJob };
