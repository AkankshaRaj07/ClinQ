const QueueToken = require('../models/QueueToken');

exports.getHistoryByDate = async (req, res) => {
  try {
    const dateParam = req.query.date;
    if (!dateParam) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const patients = await QueueToken.find({ queueDate: dateParam })
      .sort({ tokenNumber: 1 });

    res.json({
      date: dateParam,
      patients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const dateParam = req.query.date;
    if (!dateParam) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const patients = await QueueToken.find({ queueDate: dateParam });

    const totalPatients = patients.length;
    const completedPatients = patients.filter(p => p.status === 'COMPLETED').length;
    const skippedPatients = patients.filter(p => p.status === 'SKIPPED').length;

    let totalDuration = 0;
    let longestConsultation = 0;
    let completedWithDuration = 0;

    patients.forEach(p => {
      if (p.status === 'COMPLETED' && p.consultationDuration) {
        totalDuration += p.consultationDuration;
        if (p.consultationDuration > longestConsultation) {
          longestConsultation = p.consultationDuration;
        }
        completedWithDuration++;
      }
    });

    // Convert total and longest from seconds to minutes for the response
    const averageConsultationTime = completedWithDuration > 0 
      ? Math.round((totalDuration / completedWithDuration) / 60) 
      : 0;
    
    const longestConsultationMins = Math.round(longestConsultation / 60);

    res.json({
      totalPatients,
      completedPatients,
      skippedPatients,
      averageConsultationTime,
      longestConsultation: longestConsultationMins
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
