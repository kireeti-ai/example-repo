/**
 * @fileoverview Tasks integration tests
 */

const request = require('supertest');
const app = require('../../src/app');

describe('Tasks API', () => {
    let accessToken;
    let projectId;

    const testUser = {
        email: 'task-test@example.com',
        password: 'TestPass123',
        firstName: 'Task',
        lastName: 'Tester',
    };

    beforeEach(async () => {
        // Create and login user
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        accessToken = registerRes.body.data.tokens.accessToken;

        // Create a project
        const projectRes = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Task Test Project',
                key: 'TASK',
                description: 'Project for task tests',
            });

        projectId = projectRes.body.data.project.id;
    });

    describe('POST /api/v1/tasks', () => {
        it('should create a task', async () => {
            const res = await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'Test Task',
                    description: 'A test task',
                    projectId,
                    priority: 'high',
                    type: 'feature',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.task.title).toBe('Test Task');
            expect(res.body.data.task.taskNumber).toBe('TASK-1');
        });

        it('should auto-increment task number', async () => {
            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task 1', projectId });

            const res = await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task 2', projectId });

            expect(res.body.data.task.taskNumber).toBe('TASK-2');
        });
    });

    describe('GET /api/v1/tasks', () => {
        it('should list tasks', async () => {
            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Task', projectId });

            const res = await request(app)
                .get('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should filter by project', async () => {
            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Task', projectId });

            const res = await request(app)
                .get(`/api/v1/tasks?projectId=${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.every(t => t.project.id === projectId)).toBe(true);
        });

        it('should filter by status', async () => {
            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Todo Task', projectId, status: 'todo' });

            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Done Task', projectId, status: 'done' });

            const res = await request(app)
                .get('/api/v1/tasks?status=todo')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.every(t => t.status === 'todo')).toBe(true);
        });
    });

    describe('PATCH /api/v1/tasks/:id', () => {
        it('should update task status', async () => {
            const createRes = await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Task', projectId, status: 'todo' });

            const taskId = createRes.body.data.task.id;

            const res = await request(app)
                .patch(`/api/v1/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ status: 'in_progress' });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('in_progress');
        });
    });

    describe('DELETE /api/v1/tasks/:id', () => {
        it('should delete task', async () => {
            const createRes = await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Task', projectId });

            const taskId = createRes.body.data.task.id;

            const res = await request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
        });
    });

    describe('GET /api/v1/tasks/board/:projectId', () => {
        it('should get tasks grouped by status', async () => {
            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Todo 1', projectId, status: 'todo' });

            await request(app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'In Progress 1', projectId, status: 'in_progress' });

            const res = await request(app)
                .get(`/api/v1/tasks/board/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.board).toBeDefined();
        });
    });
});
