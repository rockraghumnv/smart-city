const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Vendor
const createOrder = async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({ message: 'No product IDs provided' });
  }

  try {
    // Find all products and ensure they are available
    const productsToBuy = await Product.find({
      _id: { $in: productIds },
      status: 'available',
    });

    if (productsToBuy.length !== productIds.length) {
      return res.status(400).json({ message: 'Some products are not available or do not exist.' });
    }

    // For this version, we'll assume all products in an order belong to the same seller.
    const sellerId = productsToBuy[0].user;
    const allFromSameSeller = productsToBuy.every(p => p.user.equals(sellerId));

    if (!allFromSameSeller) {
        return res.status(400).json({ message: 'Please create separate orders for products from different sellers.' });
    }

    const totalPrice = productsToBuy.reduce((acc, item) => acc + item.price, 0);
    const totalWeight = productsToBuy.reduce((acc, item) => acc + item.weight, 0);

    const order = new Order({
      vendor: req.user._id,
      seller: sellerId,
      products: productIds,
      totalPrice,
      totalWeight,
    });

    const createdOrder = await order.save();

    // IMPORTANT: Update the status of the purchased products
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status: 'sold' } }
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder };
