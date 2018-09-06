const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
/*
Modify Change Stream Output using Aggregation Pipelines
You can control change stream output by providing an array of one or more of the following pipeline stages when configuring the change stream:
$match, $project, $addFields, $replaceRoot, $redact
See Change Events for more information on the change stream response document format.
*/
const pipeline = [{ $match: { "fullDocument.superman": "clark kent" } }];
MongoClient.connect(
  "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl"
)
  .then(client => {
    console.log("Connected correctly to server");
    // specify db and collections
    const db = client.db("superheroesdb");
    const collection = db.collection("superheroes");

    const changeStream = collection.watch(pipeline);
    // start listen to changes
    changeStream.on("change", function(change) {
      console.log(change);
    });
    // insert few data with timeout so that we can watch it happening
  })
  .catch(err => {
    console.error(err);
  });
