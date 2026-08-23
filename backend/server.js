const net = require('net');

function checkMongoRunning(port = 27017, host = 'localhost') {
  return new Promise((resolve) => {
    const client = new net.Socket();
    client.setTimeout(1000);
    client.connect(port, host, () => {
      client.end();
      resolve(true);
    });
    client.on('error', () => {
      resolve(false);
    });
    client.on('timeout', () => {
      client.destroy();
      resolve(false);
    });
  });
}

async function start() {
  const isMongoRunning = await checkMongoRunning();
  if (!isMongoRunning) {
    console.log('MongoDB is not running locally. Redirecting mongoose to local mock database (config/db.json)...');
    const mockMongoose = require('./config/mockMongoose');
    require.cache[require.resolve('mongoose')] = {
      id: require.resolve('mongoose'),
      filename: require.resolve('mongoose'),
      loaded: true,
      exports: mockMongoose
    };
  }

  require('dotenv').config();
  const app = require('./app');
  const connectDB = require('./config/db');

  const PORT = process.env.PORT || 5000;

  // Connect to Database
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});

