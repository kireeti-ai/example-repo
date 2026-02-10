/**
 * @fileoverview Jest test setup
 * Configures test environment with in-memory MongoDB.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Increase timeout for slow connections
jest.setTimeout(30000);

/**
 * Setup before all tests
 */
beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Set test environment variables
    process.env.MONGODB_URI = mongoUri;
    process.env.JWT_ACCESS_SECRET = 'test-access-secret-for-testing-purposes-only';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-testing-purposes-only';
    process.env.NODE_ENV = 'test';

    // Connect to in-memory database
    await mongoose.connect(mongoUri);
});

/**
 * Cleanup after each test
 */
afterEach(async () => {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

/**
 * Cleanup after all tests
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Silence console logs during tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
};
