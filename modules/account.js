const { localAccountDB } = require("../instances")
const { createSalt, encryptPassword } = require("./encrypt")
const { v4 } = require('uuid');

const createUuid = () => {
  const token = v4().split('-');
  return token[2] + token[1] + token[0] + token[3] + token[4];
}

const createAccount = (email, id, password) => {
  try {
    const salt = createSalt();
    const encryptedPassword = encryptPassword(password, salt);

    const account = {
      id: id,
      password: encryptedPassword,
      salt: salt,
      uuid: createUuid(),
      email: email,
      verified: false,
    }

    localAccountDB.insertData(id, account);
    console.log('Account created : ' + id);

    return account;
  } catch (error) {
    console.error('Failed to create account : ' + id);
    console.error(error);
  }
}

const findAccountWithId = (id) => {
  try {
    const account = localAccountDB.getData(id);
    if(!account){
      throw new Error('Account not found : ' + id);
    }
    
    return account;
  } catch (error) {
    console.error('Failed to find account : ' + id);
    console.error(error);
    return undefined;
  }
}

const findAccount = (id, password) => {
  try {
    const account = localAccountDB.getData(id);
    if (!account) {
      throw new Error('Account not found : ' + id);
    }

    if(account.password !== encryptPassword(password, account.salt)){
      throw new Error('Password not matched : ' + id);
    }

    return account;
  } catch (error) {
    console.error('Failed to find account : ' + id);
    console.error(error);
    return undefined;
  }
}

const deleteAccount = (id, password) => {
  try {
    const account = localAccountDB.getData(id);
    if (!account){
      throw new Error('Account not found : ' + id);
    }
  
    const encryptedPassword = encryptPassword(password, account.salt);
    if (account.password !== encryptedPassword){
      throw new Error('Password not matched : ' + id);
    }
  
    localAccountDB.deleteData(id);
  } catch (error) {
    console.error('Failed to delete account : ' + id);
    console.error(error);

    return undefined;
  }
}

const changePassword = (id, password, newPassword ) => {
  try {
    const account = localAccountDB.getData(id);
    if (!account){
      throw new Error('Account not found : ' + id);
    }
  
    const encryptedPassword = encryptPassword(password, account.salt);
    if (account.password !== encryptedPassword){
      throw new Error('Password not matched : ' + id);
    }
  
    const newEncryptedPassword = encryptPassword(newPassword, account.salt);
    account.password = newEncryptedPassword;
  
    localAccountDB.updateData(id, account);
  
    return account;
  } catch (error) {
    console.error('Failed to change password : ' + id);
    console.error(error);
    return undefined;
  }
}

module.exports = {
  createAccount,
  findAccount,
  deleteAccount,
  changePassword,
  findAccountWithId,
}