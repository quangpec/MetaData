import { MongoClient as _MongoClient } from 'mongodb';
const MongoClient = _MongoClient;

let _db;
const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://quangla:QebHHAW06xWVA0pC@cluster.ghciv.mongodb.net/Project?retryWrites=true&w=majority'
  )
  .then(client => {
    console.log('Connected!');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDb = () => {
if (_db) {
  return _db;
}
throw 'No database found!';
};

const _mongoConnect = mongoConnect;
export { _mongoConnect as mongoConnect };
const _getDb = getDb;
export { _getDb as getDb };
