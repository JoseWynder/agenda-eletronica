const { getDB } = require('../database');
const { assertObjectId } = require('../utils/objectId');

class UserRepository {
  constructor() {
    this.collection = getDB().collection('users');
  }

  async create(user) {
    return await this.collection.insertOne(user);
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: assertObjectId(id, 'id') },
      { $set: data }
    );
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findById(id) {
    return await this.collection.findOne({ _id: assertObjectId(id, 'id') });
  }

  async deleteByEmail(email) {
    return await this.collection.deleteOne({ email });
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: assertObjectId(id, 'id') });
  }

  async emailExists(email, excludeId = null) {
    const query = { email };

    if (excludeId) {
      query._id = { $ne: assertObjectId(excludeId, 'id') };
    }

    const user = await this.collection.findOne(query);
    return !!user;
  }
}

module.exports = UserRepository;
