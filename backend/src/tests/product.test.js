import 'dotenv/config';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import { jest } from '@jest/globals';

// Mock the Google Generative AI module
jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Recyclable: Yes, Category: Plastic, Value: $0.50',
        },
      }),
    })),
  })),
  HarmCategory: {},
  HarmBlockThreshold: {},
}));

const { default: userRoutes } = await import('../routes/userRoutes.js');
const { default: productRoutes } = await import('../routes/productRoutes.js');
const { default: User } = await import('../models/userModel.js');
const { default: Product } = await import('../models/productModel.js');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

let mongoServer;
let vendorToken;
let individualToken;
let vendorId;
let productId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Register a vendor user
  const vendor = {
    name: 'Test Vendor',
    email: 'vendor@example.com',
    password: 'password123',
    userType: 'vendor',
  };
  const vendorRes = await request(app).post('/api/users/register').send(vendor);
  vendorToken = vendorRes.body.token;
  vendorId = vendorRes.body._id;

  // Register an individual user
  const individual = {
    name: 'Test Individual',
    email: 'individual@example.com',
    password: 'password123',
    userType: 'individual',
  };
  const individualRes = await request(app).post('/api/users/register').send(individual);
  individualToken = individualRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Recyclable Marketplace Feature Tests', () => {
  test('1. Should fail to upload a product as a non-vendor', async () => {
    const res = await request(app)
      .post('/api/products/upload')
      .set('Authorization', `Bearer ${individualToken}`)
      .field('name', 'Test Bottle')
      .field('description', 'A plastic bottle.')
      .field('price', '1');
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Not authorized as a vendor');
  });

  test('2. Should upload a product with an image as a vendor', async () => {
    const dummyImagePath = path.join(process.cwd(), 'uploads', 'test-product-image.png');
    fs.writeFileSync(dummyImagePath, 'dummy-product-image-content');

    const res = await request(app)
      .post('/api/products/upload')
      .set('Authorization', `Bearer ${vendorToken}`)
      .field('name', 'Test Plastic Bottle')
      .field('description', 'A clear plastic bottle.')
      .field('price', '0.50')
      .attach('file', dummyImagePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Plastic Bottle');
    expect(res.body).toHaveProperty('analysis', 'Recyclable: Yes, Category: Plastic, Value: $0.50');
    productId = res.body._id;

    fs.unlinkSync(dummyImagePath);
  });

  test('3. Should get a list of all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${individualToken}`); // Anyone can view products

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Test Plastic Bottle');
  });

  test('4. Should get a single product by its ID', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${individualToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('vendor');
    expect(res.body.vendor._id).toEqual(vendorId);
  });
});
