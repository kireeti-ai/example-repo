/**
 * @fileoverview Auth integration tests
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/modules/users/User.model');

describe('Auth API', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
    };

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe(testUser.email);
            expect(res.body.data.tokens.accessToken).toBeDefined();
            expect(res.body.data.tokens.refreshToken).toBeDefined();
        });

        it('should return 409 for duplicate email', async () => {
            await User.create(testUser);

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 for invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({ ...testUser, email: 'invalid-email' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 for weak password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({ ...testUser, password: '123' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await User.create(testUser);
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.tokens.accessToken).toBeDefined();
        });

        it('should return 401 for invalid password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 for non-existent user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        it('should refresh tokens with valid refresh token', async () => {
            // Register user to get tokens
            const registerRes = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            const refreshToken = registerRes.body.data.tokens.refreshToken;

            const res = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.tokens.accessToken).toBeDefined();
            expect(res.body.data.tokens.refreshToken).toBeDefined();
        });

        it('should return 401 for invalid refresh token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return current user profile', async () => {
            const registerRes = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            const accessToken = registerRes.body.data.tokens.accessToken;

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe(testUser.email);
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout user', async () => {
            const registerRes = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            const accessToken = registerRes.body.data.tokens.accessToken;

            const res = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
