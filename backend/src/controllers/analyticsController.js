const QueueToken = require('../models/QueueToken');

exports.getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokensToday = await QueueToken.find({ joinedAt: { $gte: today } });

    const totalPatientsToday = tokensToday.length;
    const completedPatients = tokensToday.filter(t => t.status === 'COMPLETED').length;
    const skippedPatients = tokensToday.filter(t => t.status === 'SKIPPED').length;

    const completedTokens = tokensToday.filter(t => t.status === 'COMPLETED' && t.consultationDuration);
    
    let averageConsultationTime = 0; // in seconds
    if (completedTokens.length > 0) {
      const totalDuration = completedTokens.reduce((acc, curr) => acc + curr.consultationDuration, 0);
      averageConsultationTime = Math.floor(totalDuration / completedTokens.length);
    }

    res.json({
      totalPatientsToday,
      completedPatients,
      skippedPatients,
      averageConsultationTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
