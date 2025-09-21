import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const startServer = async () => {
  try {
    // MongoDB bağlantısını başlat
    await initMongoConnection();

  } catch (err) {
    console.error('❌ Application failed to start:', err.message);
    process.exit(1);
  }
};

startServer();
setupServer();