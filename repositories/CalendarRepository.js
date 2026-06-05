const { getDB } = require('../database');
const { assertObjectId } = require('../utils/objectId');

class CalendarRepository {
  constructor() {
    this.collection = getDB().collection('calendars');
  }

  async create(calendar) {
    return await this.collection.insertOne(calendar);
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: assertObjectId(id, 'id') },
      { $set: data }
    );
  }

  async findByUserId(userId) {
    return await this.collection
      .find({ userId: assertObjectId(userId, 'userId') })
      .toArray();
  }

  async deleteById(id) {
    return await this.collection
      .deleteOne({ _id: assertObjectId(id, 'id') });
  }

  async findById(id) {
    return await this.collection
      .findOne({ _id: assertObjectId(id, 'id') });
  }

  async nameExists(name, userId, excludeId = null) {
    const query = {
      name,
      userId: assertObjectId(userId, 'userId')
    };

    if (excludeId) {
      query._id = { $ne: assertObjectId(excludeId, 'id') };
    }

    const calendar = await this.collection.findOne(query);
    return !!calendar;
  }
}

module.exports = CalendarRepository;
