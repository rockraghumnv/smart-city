import Product from '../models/productModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import asyncHandler from 'express-async-handler';

// --- Configuration ---
const MODEL_NAME = 'gemini-1.5-flash';
const API_KEY = process.env.GEMINI_API_KEY;

// --- Helper Function to convert file to base64 ---
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

// --- Controller Functions ---

// @desc    Upload a product and get AI analysis
// @route   POST /api/products/upload
// @access  Private/Vendor
const uploadProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  const filePath = req.file.path;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt =
      'Analyze the image of the recyclable product. Provide a simple text analysis. Example: "Recyclable: Yes, Category: Plastic, Value: $0.50"';

    const imageParts = [fileToGenerativePart(filePath, req.file.mimetype)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const geminiText = response.text().trim();

    const product = await Product.create({
      name,
      description,
      price,
      image: `/${filePath.replace(/\\/g, '/')}`,
      vendor: req.user._id,
      analysis: geminiText,
    });

    // No need to unlink here if we want to store the image path
    // fs.unlinkSync(filePath);

    res.status(201).json(product);
  } catch (error) {
    console.error('Error during product upload:', error);
    res.status(500).json({ message: 'Server error during product upload' });
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('vendor', 'name email');
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'vendor',
    'name email'
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { uploadProduct, getProducts, getProductById };
