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
