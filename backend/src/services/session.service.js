const {
  createSession,
  getSessionById,
  endSession,
  getSessions,
  getTodayFocusTime,
} = require("../models/session.model");

const { findStudentByUserId } = require("../models/student.model");

async function startSession(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const session = await createSession(student.id, new Date());

  return session;
}

async function stopSession(sessionId) {
  // Fetch session to calculate real duration
  const session = await getSessionById(sessionId);
  if (!session) throw new Error("Session not found");

  if (session.end_time) throw new Error("Session already stopped");

  const endTime = new Date();
  const duration = Math.floor(
    (endTime - new Date(session.start_time)) / 60000
  );

  const updated = await endSession(sessionId, endTime, duration);

  return updated;
}

async function getAllSessions(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  return await getSessions(student.id);
}

async function getFocusTimeToday(userId) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student not found");

  const totalMinutes = await getTodayFocusTime(student.id);

  return {
    totalMinutes,
    message: `You studied ${totalMinutes} minutes today`,
  };
}

module.exports = {
  startSession,
  stopSession,
  getAllSessions,
  getFocusTimeToday,
};
