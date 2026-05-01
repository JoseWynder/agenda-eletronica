class Event {
  constructor({ title, description, startTime, endTime, calendarId }) {
    this.title = title;
    this.description = description;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.calendarId = calendarId;
  }
}

module.exports = Event;
