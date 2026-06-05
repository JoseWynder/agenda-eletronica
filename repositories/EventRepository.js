const { getDB } = require('../database');
const { assertObjectId } = require('../utils/objectId');

class EventRepository {
  constructor() {
    this.collection = getDB().collection('events');
  }

  async create(event) {
    return await this.collection.insertOne(event);
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: assertObjectId(id, 'id')
    });
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: assertObjectId(id, 'id') },
      { $set: data }
    );
  }

  async findByCalendarId(calendarId) {
    return await this.collection
      .find({ calendarId: assertObjectId(calendarId, 'calendarId') })
      .toArray();
  }

  async deleteById(id) {
    return await this.collection
      .deleteOne({ _id: assertObjectId(id, 'id') });
  }

  async hasConflict(calendarId, startTime, endTime, excludeId = null) {
    const query = {
      calendarId: assertObjectId(calendarId, 'calendarId'),
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    };

    if (excludeId) {
      query._id = { $ne: assertObjectId(excludeId, 'id') };
    }

    const conflict = await this.collection.findOne(query);
    return !!conflict;
  }
}

module.exports = EventRepository;
