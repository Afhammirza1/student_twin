function validateSkill(req, res, next) {
  const { level, projects, certifications, skillName } = req.body;

  if (!skillName || typeof skillName !== "string" || !skillName.trim()) {
    return res.status(400).json({ success: false, message: "Skill name is required" });
  }

  const lvl = Number(level);
  if (!Number.isFinite(lvl) || lvl < 1 || lvl > 10) {
    return res.status(400).json({ success: false, message: "Level must be a number between 1 and 10" });
  }

  const proj = Number(projects);
  if (!Number.isFinite(proj) || proj < 0) {
    return res.status(400).json({ success: false, message: "Projects must be a non-negative number" });
  }

  const certs = Number(certifications);
  if (!Number.isFinite(certs) || certs < 0) {
    return res.status(400).json({ success: false, message: "Certifications must be a non-negative number" });
  }

  next();
}

module.exports = validateSkill;

