/**
 * @fileoverview Projects integration tests
 */

const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/modules/users/User.model');

describe('Projects API', () => {
    let accessToken;
    let userId;

    const testUser = {
        email: 'project-test@example.com',
        password: 'TestPass123',
        firstName: 'Project',
        lastName: 'Tester',
    };

    const testProject = {
        name: 'Test Project',
        description: 'A test project',
        key: 'TEST',
        visibility: 'private',
    };

    beforeEach(async () => {
        // Create and login user
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        accessToken = registerRes.body.data.tokens.accessToken;
        userId = registerRes.body.data.user.id;
    });

    describe('POST /api/v1/projects', () => {
        it('should create a project', async () => {
            const res = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.project.name).toBe(testProject.name);
            expect(res.body.data.project.key).toBe(testProject.key);
        });

        it('should return 409 for duplicate key', async () => {
            await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            const res = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ ...testProject, name: 'Another Project' });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 for invalid key format', async () => {
            const res = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ ...testProject, key: 'invalid-key' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/projects', () => {
        it('should list projects', async () => {
            await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            const res = await request(app)
                .get('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should paginate results', async () => {
            // Create multiple projects
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/api/v1/projects')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ ...testProject, key: `TST${i}`, name: `Test Project ${i}` });
            }

            const res = await request(app)
                .get('/api/v1/projects?page=1&limit=2')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.body.meta.pagination.total).toBe(5);
        });
    });

    describe('GET /api/v1/projects/:id', () => {
        it('should get project by ID', async () => {
            const createRes = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            const projectId = createRes.body.data.project.id;

            const res = await request(app)
                .get(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.project.id).toBe(projectId);
        });

        it('should return 404 for non-existent project', async () => {
            const res = await request(app)
                .get('/api/v1/projects/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /api/v1/projects/:id', () => {
        it('should update project', async () => {
            const createRes = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            const projectId = createRes.body.data.project.id;

            const res = await request(app)
                .patch(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: 'Updated Project Name' });

            expect(res.status).toBe(200);
            expect(res.body.data.project.name).toBe('Updated Project Name');
        });
    });

    describe('DELETE /api/v1/projects/:id', () => {
        it('should delete project', async () => {
            const createRes = await request(app)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(testProject);

            const projectId = createRes.body.data.project.id;

            const res = await request(app)
                .delete(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);

            // Verify deletion
            const getRes = await request(app)
                .get(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(getRes.status).toBe(404);
        });
    });
});
