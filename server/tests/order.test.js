import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars specifically for the test process
dotenv.config(); 

describe('POST /api/orders', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined in .env file");
    }
    await mongoose.connect(uri);
  });
  it('should create a new order and return 201', async () => {
    const newOrder = {
      customerName: "Amey",
      address: "123 Pune St",
      phone: "9876543210",
      items: [{ name: "Burger", quantity: 1, price: 10 }]
    };

    const res = await request(app).post('/api/orders').send(newOrder);

    expect(res.statusCode).toBe(201);
    expect(res.body.customerName).toBe("Amey");
  });
});