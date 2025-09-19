const Product = require('../models/productModel');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');
const fs = require('fs');

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
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

// --- Controller Function ---
const uploadProduct = async (req, res) => {
  const { description, weight, category } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

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

    const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);

    const prompt = `You are an expert recycling classifier. Your task is to determine if the item in the image, described by the user as "${description}", is a recyclable product we accept. We accept: Plastic, Paper, Glass, Metal. Respond with only a single word: 'yes' if it's a valid recyclable item we accept, or 'no' if it is not.`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [imagePart, {text: prompt}] }],
        generationConfig,
        safetySettings,
      });

    const geminiResponse = result.response.text().trim().toLowerCase();
    const isEligible = geminiResponse === 'yes';

    // Calculate price
    const price = (priceChart[category] || 0) * parseFloat(weight);

    // Create product in DB
    const product = await Product.create({
      user: req.user._id,
      description,
      weight,
      category,
      imageUrl: `/${imageFile.path.replace(/\\/g, '/')}`, // Store URL-friendly path
      isEligible,
      price,
      status: 'available',
    });

    res.status(201).json({
      message: 'Product uploaded successfully.',
      product,
      eligibility: isEligible ? 'Eligible for selling' : 'Not eligible for selling',
    });
  } catch (error) {
    console.error('Error during product upload and analysis:', error);
    res.status(500).json({ message: 'Server error during analysis' });
  } finally {
    // Clean up the uploaded file after processing
    fs.unlinkSync(imageFile.path);
  }
};

// @desc    Fetch all eligible and available products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  const { category, minWeight } = req.query;

  try {
    // Base query to find products that are ready for sale
    const query = {
      isEligible: true,
      status: 'available',
    };

    // Add filters if they are provided in the request
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
