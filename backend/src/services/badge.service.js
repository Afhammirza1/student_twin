function calculateBadges(student, skills) {
  const badges = [];

  // Streak-based badges
  if (student.streak >= 3) badges.push({ id: "streak_3", name: "3-Day Streak", icon: "🔥", color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" });
  if (student.streak >= 7) badges.push({ id: "streak_7", name: "7-Day Survivor", icon: "🌋", color: "text-red-500 bg-red-100 dark:bg-red-900/30" });
  if (student.streak >= 30) badges.push({ id: "streak_30", name: "Consistency King", icon: "👑", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" });

  // XP-based badges
  if (student.xp >= 50) badges.push({ id: "xp_50", name: "Initiate", icon: "🌱", color: "text-green-500 bg-green-100 dark:bg-green-900/30" });
  if (student.xp >= 250) badges.push({ id: "xp_250", name: "Rising Star", icon: "🌟", color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" });
  if (student.xp >= 1000) badges.push({ id: "xp_1k", name: "Grandmaster", icon: "🏆", color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" });

  // GitHub / Open Source badges
  if (student.github_username) {
    badges.push({ id: "gh_linked", name: "Open-Sourcerer", icon: "🐙", color: "text-gray-700 bg-gray-200 dark:text-gray-300 dark:bg-gray-800" });
  }

  // Skill-based badges
  if (skills && skills.length > 0) {
    const masters = skills.filter(s => s.score >= 80);
    masters.forEach(m => {
      badges.push({ id: `master_${m.skill_id}`, name: `${m.skill_name || 'Skill'} Master`, icon: "⚔️", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 flex-shrink-0" });
    });
  }

  return badges;
}

module.exports = { calculateBadges };
