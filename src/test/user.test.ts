import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/user';
import Task from '../models/task';
import Subscription from '../models/subscription';
process.env.MONGO_URI = 'mongodb://localhost:27017/smart-task-manager-test';
import app from '../index';

describe('Smart Task Manager API Tests', () => {
    let authToken: string;
    let taskId: string;

    beforeAll(async () => {
        await User.deleteMany({ email: /test@example.com/ });
        await Task.deleteMany({});
        await Subscription.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({ email: /test@example.com/ });
        await Task.deleteMany({});
        await Subscription.deleteMany({});
    });

    // Auth Tests
    describe('Authentication', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should login user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            authToken = res.body.token;
        });
    });

    // Task Tests
    describe('Task Management', () => {
        it('should create a task', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Task',
                    description: 'Test Description',
                    dueDate: '2024-12-31T23:59:59.000Z'
                });
            expect(res.status).toBe(201);
            expect(res.body.task).toBeDefined();
            taskId = res.body.task._id;
        });

        it('should get all tasks', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.tasks).toBeInstanceOf(Array);
        });
    });

    // Health Check
    describe('Health Check', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('OK');
        });
    });
});