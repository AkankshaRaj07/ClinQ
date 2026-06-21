const QueueToken = require('../models/QueueToken');
const QueueSettings = require('../models/QueueSettings');
const io = require('../sockets/socketManager');

// Helper: Check and reset daily tokens
const checkDailyReset = async () => {
  let settings = await QueueSettings.findOne();
  if (!settings) {
    settings = await QueueSettings.create({});
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReset = new Date(settings.lastResetDate);
  lastReset.setHours(0, 0, 0, 0);

  if (today > lastReset) {
    // New day, reset token numbering
    settings.nextTokenNumber = 1;
    settings.currentToken = 0;
    settings.lastResetDate = new Date();
    await settings.save();
    
    // Optionally: Mark all WAITING as SKIPPED or leave them? 
    // Usually a new day means fresh queue. We'll leave it simple for MVP.
  }
  return settings;
};

// Helper: Calculate Wait Time
const calculateWaitTime = async () => {
  const settings = await QueueSettings.findOne();
  const defaultSeconds = settings ? settings.defaultConsultationTime : 600;

  const lastCompleted = await QueueToken.find({ status: 'COMPLETED' })
    .sort({ completedAt: -1 })
    .limit(10);

  if (lastCompleted.length === 0) {
    return defaultSeconds; // fallback to 10 minutes (600s)
  }

  const totalDuration = lastCompleted.reduce((acc, curr) => acc + (curr.consultationDuration || defaultSeconds), 0);
  return Math.floor(totalDuration / lastCompleted.length);
};

// Helper: Broadcast current state
const broadcastQueueState = async () => {
  try {
    const settings = await QueueSettings.findOne();
    const waitingCount = await QueueToken.countDocuments({ status: 'WAITING' });
    const activeQueue = await QueueToken.find({ status: { $in: ['WAITING', 'CALLED'] } }).sort({ tokenNumber: 1 });
    const currentlyCalledToken = activeQueue.find(t => t.status === 'CALLED') || null;
    const averageConsultationTime = await calculateWaitTime();

    io.getIO().emit('QUEUE_UPDATED', {
      currentToken: settings ? settings.currentToken : 0,
      waitingCount,
      activeQueue,
      averageConsultationTime,
      currentlyCalledToken
    });
  } catch (error) {
    console.error('Error broadcasting state:', error);
  }
};

exports.joinQueue = async (req, res) => {
  try {
    const { patientName, phone } = req.body;
    
    // Check for daily reset before generating token
    let settings = await checkDailyReset();

    // Atomically increment token number
    settings = await QueueSettings.findOneAndUpdate(
      {},
      { $inc: { nextTokenNumber: 1 } },
      { new: true, upsert: true }
    );

    const token = await QueueToken.create({
      patientName,
      phone,
      tokenNumber: settings.nextTokenNumber - 1, // since we incremented it
      status: 'WAITING'
    });

    await broadcastQueueState();
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentState = async (req, res) => {
  try {
    let settings = await checkDailyReset();
    
    const waitingCount = await QueueToken.countDocuments({ status: 'WAITING' });
    const activeQueue = await QueueToken.find({ status: { $in: ['WAITING', 'CALLED'] } }).sort({ tokenNumber: 1 });
    const currentlyCalledToken = activeQueue.find(t => t.status === 'CALLED') || null;
    const averageConsultationTime = await calculateWaitTime();

    res.json({
      currentToken: settings.currentToken,
      waitingCount,
      averageConsultationTime,
      activeQueue,
      currentlyCalledToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTokenTracking = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const token = await QueueToken.findOne({ tokenNumber: Number(tokenNumber), status: { $in: ['WAITING', 'CALLED'] } });
    
    if (!token) {
      return res.status(404).json({ error: 'Token not found or no longer active' });
    }

    if (token.status === 'CALLED') {
      return res.json({ tokenNumber: token.tokenNumber, status: 'CALLED', peopleAhead: 0, estimatedWaitTime: 0 });
    }

    // WAITING token
    const peopleAhead = await QueueToken.countDocuments({
      status: 'WAITING',
      tokenNumber: { $lt: token.tokenNumber }
    });

    const averageTime = await calculateWaitTime();
    const estimatedWaitTime = (peopleAhead + 1) * averageTime; // +1 to account for the person currently CALLED

    res.json({
      tokenNumber: token.tokenNumber,
      status: token.status,
      peopleAhead,
      estimatedWaitTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.callNext = async (req, res) => {
  try {
    const activeToken = await QueueToken.findOne({ status: 'CALLED' });
    if (activeToken) {
      return res.status(400).json({ error: 'Complete or Skip the current token before calling the next patient.' });
    }

    // Find the next waiting token (smallest tokenNumber)
    const nextToken = await QueueToken.findOneAndUpdate(
      { status: 'WAITING' },
      { $set: { status: 'CALLED', calledAt: new Date() } },
      { sort: { tokenNumber: 1 }, new: true }
    );

    if (!nextToken) {
      return res.status(404).json({ error: 'No waiting patients.' });
    }

    // Update currentToken in settings
    await QueueSettings.findOneAndUpdate({}, { currentToken: nextToken.tokenNumber });

    await broadcastQueueState();
    res.json(nextToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const token = await QueueToken.findById(tokenId);
    
    if (!token || token.status !== 'CALLED') {
      return res.status(400).json({ error: 'Token is not currently CALLED.' });
    }

    const completedAt = new Date();
    const durationSeconds = Math.floor((completedAt.getTime() - new Date(token.calledAt).getTime()) / 1000);

    token.status = 'COMPLETED';
    token.completedAt = completedAt;
    token.consultationDuration = durationSeconds > 0 ? durationSeconds : 0;
    await token.save();

    await broadcastQueueState();
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.skipToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const token = await QueueToken.findById(tokenId);

    if (!token || !['WAITING', 'CALLED'].includes(token.status)) {
      return res.status(400).json({ error: 'Token cannot be skipped from current state.' });
    }

    token.status = 'SKIPPED';
    await token.save();

    // If we skipped the currently CALLED token, we might need to reset currentToken setting? 
    // Usually currentToken stays the same until Call Next is hit again, which is fine.

    await broadcastQueueState();
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetQueue = async (req, res) => {
  try {
    let settings = await QueueSettings.findOne();
    if (!settings) {
      settings = await QueueSettings.create({});
    }
    
    // Mark all WAITING and CALLED tokens as SKIPPED
    await QueueToken.updateMany({ status: { $in: ['WAITING', 'CALLED'] } }, { status: 'SKIPPED' });

    settings.nextTokenNumber = 1;
    settings.currentToken = 0;
    settings.lastResetDate = new Date();
    await settings.save();

    await broadcastQueueState();
    res.json({ message: 'Queue reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
