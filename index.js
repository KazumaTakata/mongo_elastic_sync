const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const elastic = require("./elasticsearch");

const pipeline = [];
MongoClient.connect(
  "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl"
)
  .then(client => {
    console.log("Connected correctly to server");
    // specify db and collections
    const db = client.db("messageapp");
    const collection = db.collection("users");

    const changeStream = collection.watch(pipeline);
    // start listen to changes
    changeStream.on("change", function(change) {
      console.log(change);
      router(change);
    });
    // insert few data with timeout so that we can watch it happening
  })
  .catch(err => {
    console.error(err);
  });

async function router(change) {
  type = change.operationType;
  obj = change.fullDocument;
  if (type == "insert") {
    let insertobj = {
      name: obj.name,
      photourl: obj.photourl,
      id: obj._id.toHexString(),
    };
    await elastic.addDocument(insertobj);
  } else if (type == "update") {
    let id = change.documentKey._id.toHexString();
    let obj = change.updateDescription.updatedFields;
    let keys = Object.keys(obj);
    insertobj = {};
    if (keys.includes("name")) {
      insertobj["name"] = obj["name"];
    }

    if (keys.includes("photourl")) {
      insertobj["photourl"] = obj["photourl"];
    }

    await elastic.updateDocument(id, insertobj);
  }
}
