const { CosmosClient } = require("@azure/cosmos");

require('dotenv').config()

const endpoint =process.env.endpoint
const key =process.env.key
const client = new CosmosClient({ endpoint, key });

const databaseId = "PlayerData";
const containerId = "CatalogueContainer";

async function createContainer() {
    const { container } = await client.database(databaseId).containers.createIfNotExists({
      id: containerId,
      partitionKey: { kind: "Hash", paths: ["/id"] }
    });
    console.log(`Container ${containerId} created successfully`);
  }
  
  createContainer();