const Product = require('../models/productModel');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const MODEL_NAME = 'gemini-pro-vision';
const API_KEY = process.env.GEMINI_API_KEY;

const priceChart = {
  plastic: 0.5, // Price per kg
  paper: 0.25,
  glass: 0.75,
  metal: 1.5,
};

// --- Helper Function to convert file to base64 ---
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

// --- Controller Function ---
const uploadProduct = async (req, res) => {
  const { description, category, weight } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const filePath = req.file.path; // This will now be correct

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prompt = `You are an expert recycling classifier. Your task is to determine if the item in the image is a recyclable product we accept. We accept: Plastic, Paper, Glass, Metal. Respond with only a single word: 'yes' if it's a valid recyclable item, or 'no' if it is not.`;

    const imageParts = [fileToGenerativePart(filePath, req.file.mimetype)];

    const result = await model.generateContent([prompt, ...imageParts]);

    const { response } = result;
    const geminiText = response.text().trim().toLowerCase();

    const isEligible = geminiText === 'yes';

    const price = (priceChart[category] || 0) * parseFloat(weight);

    const product = await Product.create({
      user: req.user._id,
      description,
      category,
      weight,
      imageUrl: `/${req.file.path.replace(/\\/g, '/')}`, // Store a web-friendly path
      price,
      isEligible,
    });

    res.status(201).json(product);

    fs.unlinkSync(filePath); // This will now find the file correctly
  } catch (error) {
    console.error('Error during product upload:', error);
    res.status(500).json({ message: 'Server error during product upload' });
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// @desc    Fetch all eligible and available products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  const { category, minWeight } = req.query;

  try {
    const query = {
      isEligible: true,
      status: 'available',
    };

    if (category) {
      query.category = category;
    }

    if (minWeight) {
      query.weight = { $gte: Number(minWeight) }; // $gte means "greater than or equal to"
    }

    const products = await Product.find(query).populate('user', 'name email'); // Populate user details

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadProduct, getProducts };
