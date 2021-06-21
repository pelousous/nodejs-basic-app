const { MongoClient } = require("mongodb");

let _db;

const mongoConnect = (cb) => {
  const uri =
    "mongodb+srv://dxxxxxxxxxxo:pxxxx5@cluster0.ijrdt.mongodb.net/nxxxxxxxxxs?retryWrites=true&w=majority";

  MongoClient.connect(uri, { useUnifiedTopology: true })
    .then((client) => {
      console.log("connected");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  // const client = new MongoClient(uri);

  // try {
  //     // Connect to the MongoDB cluster
  //     await client.connect();

  //     // Make the appropriate DB calls
  //     await  listDatabases(client);

  // } catch (e) {
  //     console.error(e);
  // } finally {
  //     await client.close();
  // }
};

const getDb = () => {
  if (_db) return _db;
  throw "Database not found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
