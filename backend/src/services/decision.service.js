function shouldUseAI(useAI, feature) {
  if (!useAI) return false;

  const allowed = ["roadmap", "recommendation"];
  return allowed.includes(feature);
}

module.exports = { shouldUseAI };
