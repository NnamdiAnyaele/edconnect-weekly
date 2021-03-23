const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.password = password;
      this.matricNumber = matricNumber;
      this.program = program;
      this.graduationYear = graduationYear;
    }

    getFullName() {
      return `${this.firstname} ${this.lastname}`

    }
}

class Users extends DataModel {
    authenticate(email, password) {
    let user = this.data.find(item => item.email == email && item.password == password);
    if (user) {
      return true
    }
    return false
    }

    getByEmail(email) {
    let user = this.data.find(item => item.email == email)
    if (user) {
      return user
    }
    return null;
    }

    getByMatricNumber(matricNumber) {
    let user = this.data.find(item => item.matricNumber == matricNumber)
    if (user) {
      return user
    }
    return null;
    }

    validate(obj) {
    let emptyProp = Object.values(obj).some(x => (x == null || x == ''));
    let userEmail = this.data.some(myObj => myObj.email == obj.email)
    let userMatric = this.data.some(myObj => myObj.matricNumber == obj.matricNumber)
    if(emptyeProp || userByEmail || userByMatric || obj.password.length < 7) {
      return false
    } else {
        return true
      }
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};