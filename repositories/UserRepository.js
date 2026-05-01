const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

class UserRepository {
  constructor() {
    this.collection = getDB().collection('users');
  }

  async create(user) {
    return await this.collection.insertOne(user);
  }

  async updateById(id, data) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async deleteByEmail(email) {
    return await this.collection.deleteOne({ email });
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  async emailExists(email, excludeId = null) {
    const query = { email };

    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const user = await this.collection.findOne(query);
    return !!user;
  }
}

module.exports = UserRepository;