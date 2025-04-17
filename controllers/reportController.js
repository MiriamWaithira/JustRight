// controllers/reportController.js (Report Management)
try {
  const report = await Report.create({
    incidentType: req.body.incidentType,
    status: req.body.status,
    description: req.body.description,
    location: req.body.location,
    exactLocation: req.body.exactLocation,
    filePath: req.file?.path,
    publicUserId: req.user.userId
  });
  res.status(201).json(report);
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

// 2. Get reports for current user
const getUserReports = async (req, res) => {
try {
  const reports = await Report.findAll({
    where: { publicUserId: req.user.userId },
    order: [['createdAt', 'DESC']]
  });
  res.json(reports);
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

// 3. Get all reports (for moderators/admins)
const getAllReports = async (req, res) => {
try {
  const reports = await Report.findAll({
    order: [['createdAt', 'DESC']]
  });
  res.json(reports);
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

// 4. Assign report to moderator
const assignReportToModerator = async (req, res) => {
try {
  const report = await Report.findByPk(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  report.moderatorId = req.body.moderatorId;
  report.status = 'assigned';
  await report.save();

  res.json(report);
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

// Export all functions
module.exports = {
createReport,
getUserReports,
getAllReports,
assignReportToModerator
};