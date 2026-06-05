function formatUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id?.toString?.() || user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function formatCalendar(calendar) {
  if (!calendar) {
    return null;
  }

  return {
    _id: calendar._id?.toString?.() || calendar._id,
    name: calendar.name,
    userId: calendar.userId?.toString?.() || calendar.userId,
    createdAt: calendar.createdAt
  };
}

function formatEvent(event) {
  if (!event) {
    return null;
  }

  return {
    _id: event._id?.toString?.() || event._id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    calendarId: event.calendarId?.toString?.() || event.calendarId,
    createdAt: event.createdAt
  };
}

module.exports = {
  formatUser,
  formatCalendar,
  formatEvent
};
