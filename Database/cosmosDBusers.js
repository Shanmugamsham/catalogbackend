
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config()

const endpoint =process.env.endpoint
const key =process.env.key
const databaseId = "PlayerData";
const containerId = "UsersContainer";
const client = new CosmosClient({ endpoint, key });

async function connectToCosmos() {
  const database = client.database(databaseId);
  const container = database.container(containerId);
  const { resource: containerProperties } = await container.read();
 const partitionKey = containerProperties.partitionKey;
 console.log('Partition Key:', partitionKey);

  return { database, container };
}

module.exports = { connectToCosmos };
