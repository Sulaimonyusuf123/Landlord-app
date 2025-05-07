import { Client, Account, ID, Databases, Storage, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67f69e1c002d4b97073a'); // Project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Appwrite Database & Storage IDs
const DATABASE_ID = '67f6a679000cfddabb05'; // landlord_DB
const BUCKET_ID = '67fa77ef00297ab9936b';

// Collection IDs 
const COLLECTIONS = {
  properties: '681b542680282367a913',
  units: '681b5cc3000a9de1418f',
  tenants: '681b5f83000f793ae0a7',
  payments: '681b75b00011094a3965',
  expenses: '681b76d70021b58e15de',
  leases: '681b73f50005c14223e9',
  notifications: '681b780f002463a786c9',
};

export {
  client,
  account,
  databases,
  storage,
  DATABASE_ID,
  BUCKET_ID,
  COLLECTIONS,
  ID,
  Query,
};
