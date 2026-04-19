function calculateScore(data) {
  const levelScore = data.level * 5;
  const projectScore = data.projects * 10;
  const certScore = data.certifications * 8;

  return {
    total: levelScore + projectScore + certScore,
    breakdown: {
      level: levelScore,
      projects: projectScore,
      certifications: certScore,
    },
  };
}

module.exports = { calculateScore };
