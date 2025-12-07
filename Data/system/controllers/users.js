const UsersModel = require('../database/models/users');

class UsersController {
  constructor(api) {
    this.api = api;
  }

  isValidName(name) {
    if (!name || name.trim() === '') return false;
    const lower = name.toLowerCase();
    if (lower === 'facebook' || lower === 'facebook user' || lower.includes('facebook user')) return false;
    if (lower === 'unknown' || lower === 'user') return false;
    return true;
  }

  async getNameUser(userID) {
    try {
      const cached = UsersModel.getName(userID);
      if (this.isValidName(cached)) {
        return cached;
      }
      
      const info = await this.api.getUserInfo(userID);
      if (info && info[userID]) {
        const name = info[userID].name;
        const firstName = info[userID].firstName;
        const alternateName = info[userID].alternateName;
        
        if (this.isValidName(name)) {
          UsersModel.setName(userID, name);
          return name;
        }
        if (this.isValidName(firstName)) {
          UsersModel.setName(userID, firstName);
          return firstName;
        }
        if (this.isValidName(alternateName)) {
          UsersModel.setName(userID, alternateName);
          return alternateName;
        }
      }
      if (cached && cached !== 'Unknown') return cached;
      return 'User';
    } catch (error) {
      const cached = UsersModel.getName(userID);
      if (this.isValidName(cached)) return cached;
      return 'User';
    }
  }

  async refreshUserName(userID) {
    try {
      const info = await this.api.getUserInfo(userID);
      if (info && info[userID]) {
        const name = info[userID].name;
        const firstName = info[userID].firstName;
        const alternateName = info[userID].alternateName;
        
        if (this.isValidName(name)) {
          UsersModel.setName(userID, name);
          return name;
        }
        if (this.isValidName(firstName)) {
          UsersModel.setName(userID, firstName);
          return firstName;
        }
        if (this.isValidName(alternateName)) {
          UsersModel.setName(userID, alternateName);
          return alternateName;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  get(userID) {
    return UsersModel.get(userID);
  }

  create(userID, name = '') {
    return UsersModel.create(userID, name);
  }

  update(userID, data) {
    return UsersModel.update(userID, data);
  }

  ban(userID, reason = '') {
    return UsersModel.ban(userID, reason);
  }

  unban(userID) {
    return UsersModel.unban(userID);
  }

  isBanned(userID) {
    return UsersModel.isBanned(userID);
  }

  getAll() {
    return UsersModel.getAll();
  }

  getBanned() {
    return UsersModel.getAll().filter(u => u.banned === 1);
  }

  getData(userID) {
    return UsersModel.getData(userID);
  }

  setData(userID, data) {
    return UsersModel.setData(userID, data);
  }
}

module.exports = UsersController;
