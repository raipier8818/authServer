const { v4 } = require("uuid");
const { localSessionDB } = require("../instances");

const expiredTime = 1000 * 60 * 60 * 24 * 7; // 7 days

const createSessionToken = (uuid) => {
  const token = v4().split('-');
  return token[2] + token[1] + token[0] + token[3] + token[4] + uuid;
}

const createSession = (uuid) => {
  const now = new Date().getTime();
  const session = {
    uuid: uuid,
    created: now,
    updated: now,
    expired: now + expiredTime,
    token: createSessionToken(uuid),
  }

  localSessionDB.insertData(session.token, session);
  return session;
}

const findSession = (token) => {
  const session = localSessionDB.getData(token);
  if(!session) return undefined;

  const now = new Date().getTime();
  if(session.expired < now) {
    deleteSession(token);
    return undefined;
  }

  return session;
}

const deleteSession = (token) => {
  localSessionDB.deleteData(token);
  localSessionDB.saveDatabase();
}

const updateSession = (token) => {
  const now = new Date().getTime();
  const session = localSessionDB.getData(token);
  if(!session) return undefined;

  session.updated = now;
  session.expired = now + expiredTime;
  session.token = createSessionToken(token);

  deleteSession(token);
  localSessionDB.updateData(session.token, session);
}

module.exports = {
  createSession,
  findSession,
  deleteSession,
  updateSession,
}