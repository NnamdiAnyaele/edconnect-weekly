class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
    let user = this.data.find(item => item.id == id);
      if (!user) {
        return null
      }
    return user;
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
      let user = this.data.find(item => item.id == id);
      if (!user) {
        return false
      }
      for (let prop in user) {
        obj[prop] = user[prop]
      }
      return true
    }

    delete(id) {
    let user = this.data.find(item => item.id == id);
    if (!user) {
      return false
    }
    let index = this.data.indexOf(user);
    user.splice(index, 1)
    return true
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;