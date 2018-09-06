var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  host: "localhost:9200",
  log: "info",
});

var indexName = "messageappuser";
let typeName = "user";

/**
 * Delete an existing index
 */
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName,
  });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
  return elasticClient.indices.create({
    index: indexName,
  });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName,
  });
}
exports.indexExists = indexExists;

function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: typeName,
    body: {
      properties: {
        id: { type: "keyword" },
        name: { type: "text" },
        photourl: { type: "keyword" },
      },
    },
  });
}
exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: typeName,
    body: {
      id: document.id,
      name: document.name,
      photourl: document.photourl,
    },
  });
}
exports.addDocument = addDocument;

function search(name) {
  return elasticClient.search({
    index: indexName,
    type: typeName,
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                name: {
                  query: name,
                  fuzziness: 1,
                },
              },
            },
          ],
        },
      },
    },
  });
}
exports.search = search;
