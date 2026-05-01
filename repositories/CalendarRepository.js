const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class CalendarRepository {
  constructor() {
    this.collection = getDB().collection('calendars');
  }

  async create(calendar) {
    return await this.collection.insertOne(calendar);
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async findByUserId(userId) {
    return await this.collection
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async deleteById(id) {
    return await this.collection
      .deleteOne({ _id: new ObjectId(id) });
  }

  async findById(id) {
    return await this.collection
      .findOne({ _id: new ObjectId(id) });
  }

  async nameExists(name, userId, excludeId = null) {
    const query = {
      name,
      userId: new ObjectId(userId)
    };

    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const calendar = await this.collection.findOne(query);
    return !!calendar;
  }
}

module.exports = CalendarRepository;
