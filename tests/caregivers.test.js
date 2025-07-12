import mongoose from "mongoose";
import request from 'supertest';
import { MongoMemoryServer} from "mongodb-memory-server";
import app from "../index.js";
import caregiver from "../models/caregiver.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
    await mongoServer.stop();
});

beforeEach(async () => {
    await caregiver.deleteMany({});
});

describe('POST /caregiver', () => {
    it('should create a caregiver with valid data', async () => {

        const caregiverData = {
            name: 'Jane Doe',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janedoe@example.com',
        };

        const res = await request(app).post('/caregiver').send(caregiverData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Caregiver created/i);

    it('should return 400 if caregiver is missing data', async () => {

        const caregiverData = {
            name: 'Jane Doe',
            hourlyRate: 10,
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janedoe@example.com',
        };

        const res = await request(app)
            .post('/caregiver')
            .send(caregiverData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Validation error/i);
    });
    })
});

describe('GET /caregiver', () => {
    it('should return all caregivers', async () => {
        const caregiverData = {
            name: 'Jane Doe',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janedoe@example.com',
        };

        await request(app)
            .post('/caregver')
            .send(caregiverData);

        const res = await request(app).get('/caregiver');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('GET /caregiver/:id', () => {
    it('should return a caregiver by ID', async () => {
        const caregiverData = {
            name: 'Jane Doe',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janedoe@example.com',
        };

        const createdCaregiver = await request(app)
            .post('/caregiver')
            .send(caregiverData);

        const res = await request(app).get(`/caregiver/${createdCaregiver.body.caregiverId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(caregiverData.name);
    });

    it('should return 404 for non-existent caregiver ID', async () => {
        const res = await request(app).get('/caregiver/123456789012345678901234');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Caregiver not found/i);
    });
});

describe('PUT /caregiver/:id', () => {
    it('should update a caregiver by ID', async () => {
        const caregiverData = {
            name: 'Jane Doe',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janedoe@example.com',
        };

        const createdCaregiver = await request(app)
            .post('/caregiver')
            .send(caregiverData);

        const updatedData = {
            name: 'Jane Smith',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janeSmith@example.com',
        };

        const res = await request(app)
            .put(`/caregiver/${createdCaregiver.body.caregiverId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(204);
    });

    it('should return 404 for non-existent caregiver ID', async () => {
        const updatedData = {
            name: 'Jane Smith',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janeSmith@example.com',
        };

        const res = await request(app)
            .put('/services/123456789012345678901234')
            .send(updatedData);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Caregiver not found/i);
    });
});
describe('DELETE /caregiver/:id', () => {
    it('should delete a caregiver by ID', async () => {
        const caregiverData = {
            name: 'Jane Smith',
            services: ['walking', 'grooming'], 
            hourlyRate: 10,
            availability: ['2025-07-15T13:30:00Z'],
            yearsExperience: 5,
            bio: 'dogs are great!',
            image: '',
            email: 'janeSmith@example.com',
        };

        const createdCaregiver = await request(app)
            .post('/caregiver')
            .send(caregiverData);

        const res = await request(app).delete(`/caregiver/${createdCaregiver.body.caregiverId}`);

        expect(res.statusCode).toBe(204);
    });

    it('should return 404 for non-existent caregiver ID', async () => {
        const res = await request(app).delete('/caregiver/123456789012345678901234');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Caregiver not found/i);
    });
}
);