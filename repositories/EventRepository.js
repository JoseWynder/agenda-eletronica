const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class EventRepository {
  constructor() {
    this.collection = getDB().collection('events');
  }

  async create(event) {
    return await this.collection.insertOne(event);
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: new ObjectId(id)
    });
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async findByCalendarId(calendarId) {
    return await this.collection
      .find({ calendarId: new ObjectId(calendarId) })
      .toArray();
  }

  async deleteById(id) {
    return await this.collection
      .deleteOne({ _id: new ObjectId(id) });
  }

  async hasConflict(calendarId, startTime, endTime, excludeId = null) {
    const query = {
      calendarId: new ObjectId(calendarId),
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    };

    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const conflict = await this.collection.findOne(query);
    return !!conflict;
  }
}

module.exports = EventRepository;
