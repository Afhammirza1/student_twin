function validateSkill(req, res, next) {
  const { level, projects, certifications, skillName } = req.body;

  if (!skillName) {
    return res.status(400).json({ success: false, message: "Skill name required" });
  }

  if (level < 1 || level > 10) {
    return res.status(400).json({ success: false, message: "Level must be 1–10" });
  }

  if (projects < 0) {
    return res.status(400).json({ success: false, message: "Projects cannot be negative" });
  }

  if (certifications < 0) {
    return res.status(400).json({ success: false, message: "Certifications cannot be negative" });
  }

  next();
}

module.exports = validateSkill;
