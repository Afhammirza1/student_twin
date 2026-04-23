function calculateScore(data) {
  const levelScore = data.level * 5;
  const projectScore = data.projects * 10;
  const certScore = data.certifications * 8;

  const rawTotal = levelScore + projectScore + certScore;
  const total = Math.min(100, rawTotal); // cap at 100

  return {
    total,
    breakdown: {
      level: levelScore,
      projects: projectScore,
      certifications: certScore,
      rawTotal, // useful for debugging
    },
  };
}

module.exports = { calculateScore };
