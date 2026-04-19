const { createEvents } = require("ics");

function generateICS(roadmap) {
  const today = new Date();

  const events = roadmap.map((item) => {
    const date = new Date();
    date.setDate(today.getDate() + item.day);

    return {
      title: item.task,
      start: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        10,
        0,
      ],
      duration: { hours: 2 },
    };
  });

  return new Promise((resolve, reject) => {
    createEvents(events, (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
}

module.exports = { generateICS };
