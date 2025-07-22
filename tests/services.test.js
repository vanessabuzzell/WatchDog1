import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import service from '../models/services.js';
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
    await service.deleteMany({});
});

describe('POST /services', () => {
    it('should create a service with valid data', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
        };

        const res = await request(app)
            .post('/services')
            .send(serviceData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Service created/i);
    });

    it('should return 400 if service is missing data', async () => {
        const serviceData = {
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
        };

        const res = await request(app)
            .post('/services')
            .send(serviceData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Validation error/i);
    });
});
describe('GET /services', () => {
    it('should return all services', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
        };

        await request(app)
            .post('/services')
            .send(serviceData);

        const res = await request(app).get('/services');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
describe('GET /services/:id', () => {
    it('should return a service by ID', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
            image: '',
        };

        const createdService = await request(app)
            .post('/services')
            .send(serviceData);

        const res = await request(app).get(`/services/${createdService.body.serviceId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(serviceData.name);
    });

    it('should return 404 for non-existent service ID', async () => {
        const res = await request(app).get('/services/123456789012345678901234');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Service not found/i);
    });
});
describe('PUT /services/:id', () => {
    it('should update a service by ID', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
        };

        const createdService = await request(app)
            .post('/services')
            .send(serviceData);

        const updatedData = {
            serviceName: 'Dog Walking Updated',
            description: 'Updated daily dog walking service',
            price: 25,
            duration: 35,
        };

        const res = await request(app)
            .put(`/services/${createdService.body.serviceId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(204);
    });

    it('should return 404 for non-existent service ID', async () => {
        const updatedData = {
            serviceName: 'Dog Walking Updated',
            description: 'Updated daily dog walking service',
            price: 25,
            duration: 35,
        };

        const res = await request(app)
            .put('/services/123456789012345678901234')
            .send(updatedData);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Service not found/i);
    });
}
);
describe('DELETE /services/:id', () => {
    it('should delete a service by ID', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 20,
            duration: 30,
        };

        const createdService = await request(app)
            .post('/services')
            .send(serviceData);

        const res = await request(app).delete(`/services/${createdService.body.serviceId}`);

        expect(res.statusCode).toBe(204);
    });

    it('should return 404 for non-existent service ID', async () => {
        const res = await request(app).delete('/services/123456789012345678901234');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Service not found/i);
    });
}
);
describe('Invalid ID format', () => {
    it('should return 400 for invalid service ID format', async () => {
        const res = await request(app).get('/services/invalidId');

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Invalid service ID/i);
    });
});

describe('Service validation errors', () => {
    it('should return 400 for invalid service data on creation', async () => {
        const serviceData = {
            serviceName: 'Dog Walking',
            description: 'Daily dog walking service',
            price: 'invalidPrice', // Invalid price
            duration: 30,
        };

        const res = await request(app)
            .post('/services')
            .send(serviceData);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Validation error/i);
    });
});
export default mongoServer;