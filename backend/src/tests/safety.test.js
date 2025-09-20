import 'dotenv/config';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';

import userRoutes from '../routes/userRoutes.js';
import safetyRoutes from '../safety/routes/safetyRoutes.js';
import User from '../models/userModel.js';
import Event from '../safety/models/eventModel.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);

let mongoServer;
let authToken;
let userId;
let eventId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create uploads directory for test file uploads
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Register a test user and get a token
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    userType: 'individual',
  };
  const registerResponse = await request(app).post('/api/users/register').send(user);
  expect(registerResponse.body).toHaveProperty('token');
  userId = registerResponse.body._id;
  authToken = registerResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('City Safety Feature Tests', () => {
  test('1. Should create a new event', async () => {
    const res = await request(app)
      .post('/api/safety/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Music Festival',
        location: 'Test Grounds',
        eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        description: 'A test event for our safety feature.',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Music Festival');
    eventId = res.body._id; // Save for next tests
  });

  test('2. Should get a list of upcoming events', async () => {
    const res = await request(app)
      .get('/api/safety/events')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Test Music Festival');
  });

  test('3. Should allow a user to join an event', async () => {
    const res = await request(app)
      .post(`/api/safety/events/${eventId}/join`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Successfully joined event');

    const event = await Event.findById(eventId);
    expect(event.attendees.map(id => id.toString())).toContain(userId);
  });

  test('4. Should fail to join an event if already joined', async () => {
    const res = await request(app)
      .post(`/api/safety/events/${eventId}/join`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test('5. Should submit a text-based safety report', async () => {
    const res = await request(app)
      .post(`/api/safety/reports/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .field('reportType', 'text')
      .field('textContent', 'There is a small, unattended bag near the entrance.');
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Report submitted successfully.');
    expect(res.body).toHaveProperty('ai_analysis');
  });

  test('6. Should submit an image-based safety report', async () => {
    // Create a dummy file for upload
    const dummyImagePath = path.join(process.cwd(), 'uploads', 'test-image.png');
    fs.writeFileSync(dummyImagePath, 'dummy-image-content');

    const res = await request(app)
      .post(`/api/safety/reports/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .field('reportType', 'image')
      .attach('file', dummyImagePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Report submitted successfully.');
    expect(res.body).toHaveProperty('ai_analysis');

    // Clean up dummy file
    fs.unlinkSync(dummyImagePath);
  });

  test('7. Should fail to submit a report if user has not joined the event', async () => {
    // Create a new user who hasn't joined
    const newUser = { name: 'New User', email: 'new@test.com', password: 'password123', userType: 'individual' };
    const newUserRes = await request(app).post('/api/users/register').send(newUser);
    const newToken = newUserRes.body.token;

    const res = await request(app)
      .post(`/api/safety/reports/${eventId}`)
      .set('Authorization', `Bearer ${newToken}`)
      .field('reportType', 'text')
      .field('textContent', 'This should fail.');

    expect(res.statusCode).toEqual(403);
  });
});
