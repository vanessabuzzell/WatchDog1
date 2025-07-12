import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import Appointment from '../models/Appointment.js';
import Client from '../models/Client.js';
import Caregiver from '../models/caregiver.js';
import Service from '../models/services.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    //   await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    //   await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Promise.all([
        Appointment.deleteMany(),
        Client.deleteMany(),
        Caregiver.deleteMany(),
        Service.deleteMany()
    ]);
});

// reusable setup function for each unit test since appointment
// depends on a client, caregiver, and a service
async function createValidAppointmentPayload(overrides = {}) {
    const client = await Client.create({
        name: 'Test Client',
        email: 'client@example.com',
        city: 'Testville',
        location: 'Test State',
        bio: 'Dog lover',
        image: ''
    });

    const caregiver = await Caregiver.create({
        name: 'Dog Walker',
        services: ['walking'],
        hourlyRate: 20,
        availability: [],
        yearsExperience: 10,
        bio: 'Love dogs!',
        image: '',
        email: 'walker@example.com',
    });

    const service = await Service.create({
        serviceName: 'Dog Walking',
        description: '30-minute walk',
        price: 25,
        duration: 30
    });

    const appointment = {
        client: client._id,
        caregiver: caregiver._id,
        service: service._id,
        aptDate: new Date(Date.now() + 3600000), // 1 hour from now
        contact: client.email,
        statusType: 'pending',
        notes: 'Please be gentle, she’s shy.'
    };

    return { ...appointment, ...overrides };
}


describe('POST /appointments', () => {
    it('should create a valid appointment', async () => {
        const payload = await createValidAppointmentPayload();

        const res = await request(app).post('/appointments').send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/created/i);
        expect(res.body.appointmentId).toBeDefined();
    });

    it('should fail if the appointment is in the past', async () => {
        const payload = await createValidAppointmentPayload({
            aptDate: new Date(Date.now() - 3600000) // 1 hour ago
        });

        const res = await request(app).post('/appointments').send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/in the past/i);
    });

    it('should fail if caregiver is already booked for that time', async () => {
        const payload = await createValidAppointmentPayload();

        await request(app).post('/appointments').send(payload); // create one

        const res = await request(app).post('/appointments').send(payload); // try duplicate

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/already has an appointment/i);
    });

    it('should fail if any foreign key is invalid', async () => {
        const payload = await createValidAppointmentPayload({
            client: new mongoose.Types.ObjectId(),
            caregiver: new mongoose.Types.ObjectId(),
            service: new mongoose.Types.ObjectId()
        });

        const res = await request(app).post('/appointments').send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Invalid.*reference/i);
    });
});


describe('GET /appointments', () => {
    it('should return all appointments', async () => {
        const payload = await createValidAppointmentPayload();
        await request(app).post('/appointments').send(payload);

        const res = await request(app).get('/appointments');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('client');
    });
});


describe('GET /appointments/:id', () => {
    it('should return a single appointment', async () => {
        const payload = await createValidAppointmentPayload();
        const { body } = await request(app).post('/appointments').send(payload);

        const res = await request(app).get(`/appointments/${body.appointmentId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id');
    });

    it('should return 404 for non-existent appointment', async () => {
        const res = await request(app).get(`/appointments/${new mongoose.Types.ObjectId()}`);
        expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).get('/appointments/notanid');
        expect(res.statusCode).toBe(400);
    });
});


describe('PUT /appointments/:id', () => {
    it('should update an appointment with valid data', async () => {
        const payload = await createValidAppointmentPayload();
        const { body } = await request(app).post('/appointments').send(payload);

        const update = {
            statusType: 'confirmed',
            notes: 'Bring treats please.'
        };

        const res = await request(app)
            .put(`/appointments/${body.appointmentId}`)
            .send(update);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/updated/i);
        expect(res.body.appointment.statusType).toBe('confirmed');
        expect(res.body.appointment.notes).toBe('Bring treats please.');
    });

    it('should return 404 for non-existent appointment', async () => {
        const res = await request(app)
            .put(`/appointments/${new mongoose.Types.ObjectId()}`)
            .send({ statusType: 'cancelled' });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    it('should return 400 for invalid appointment ID', async () => {
        const res = await request(app)
            .put('/appointments/invalidid123')
            .send({ statusType: 'cancelled' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Invalid appointment ID/i);
    });
});

describe('DELETE /appointments/:id', () => {
    it('should delete an appointment by ID', async () => {
        const payload = await createValidAppointmentPayload();
        const { body } = await request(app).post('/appointments').send(payload);

        const res = await request(app).delete(`/appointments/${body.appointmentId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);

        const check = await request(app).get(`/appointments/${body.appointmentId}`);
        expect(check.statusCode).toBe(404);
    });

    it('should return 404 for non-existent appointment', async () => {
        const res = await request(app).delete(`/appointments/${new mongoose.Types.ObjectId()}`);
        expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid ID', async () => {
        const res = await request(app).delete('/appointments/!@#notanid');
        expect(res.statusCode).toBe(400);
    });
});
