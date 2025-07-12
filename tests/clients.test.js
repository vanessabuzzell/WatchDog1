import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import Client from '../models/Client.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
    // await mongoose.connect(uri);
});

afterAll(async () => {
    // await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Client.deleteMany({});
});

describe('POST /clients', () => {
    it('should create a client with valid data', async () => {

        const clientData = {
            name: 'John Doe',
            email: 'johndoe@email.com',
            city: 'Rexburg',
            location: 'Idaho',
            image: '',
            bio: 'i love my dog',
        };

        const res = await request(app)
            .post('/clients')
            .send(clientData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Client created/i);
    });

    it('should return 400 if client is missing data', async () => {

        const clientData = {
            city: 'Rexburg',
            location: 'Idaho',
            image: '',
            bio: 'i love my dog',
        };

        const res = await request(app)
            .post('/clients')
            .send(clientData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Validation error/i);
    });
});

describe('GET /clients', () => {
    it('should successfully retrieve all client', async () => {
        const res = await request(app)
            .get('/clients');

        expect(res.statusCode).toBe(200);
    });
});

describe('GET /clients/:id', () => {
    it('should retrieve a client by ID', async () => {
        const client = await Client.create({
            name: 'Jane Doe',
            email: 'janedoe@email.com',
            city: 'Boise',
            location: 'Idaho',
            image: '',
            bio: 'I love big dogs',
        });

        const res = await request(app).get(`/clients/${client._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(client._id.toString());
    });

    it('should return 404 for non-existent client ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/clients/${fakeId}`);
        expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid client ID format', async () => {
        const res = await request(app).get('/clients/notavalidid');
        expect(res.statusCode).toBe(400);
    });
});

describe('PUT /clients/:id', () => {
    it('should update a client by ID', async () => {
        const client = await Client.create({
            name: 'Alice Smith',
            email: 'alice@email.com',
            city: 'Twin Falls',
            location: 'Idaho',
            image: '',
            bio: 'Original bio',
        });

        const updatedData = {
            name: 'Alice Updated',
            email: 'alice@email.com',
            city: 'Twin Falls',
            location: 'Idaho',
            image: '',
            bio: 'Updated bio',
        };

        const res = await request(app).put(`/clients/${client._id}`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.client.name).toBe('Alice Updated');
        expect(res.body.client.bio).toBe('Updated bio');
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).put('/clients/notavalidid').send({ name: 'Test' });
        expect(res.statusCode).toBe(400);
    });

    it('should return 404 if client does not exist', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).put(`/clients/${fakeId}`).send({ name: 'Test' });
        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /clients/:id', () => {
    it('should delete a client by ID', async () => {
        const client = await Client.create({
            name: 'Bob Delete',
            email: 'bob@email.com',
            city: 'Rexburg',
            location: 'Idaho',
            image: '',
            bio: 'Ready to be deleted',
        });

        const res = await request(app).delete(`/clients/${client._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Client deleted/i);
        const deleted = await Client.findById(client._id);
        expect(deleted).toBeNull();
    });

    it('should return 404 if client does not exist', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/clients/${fakeId}`);
        expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).delete('/clients/invalidid123');
        expect(res.statusCode).toBe(400);
    });
});