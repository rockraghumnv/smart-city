const Item = require('../models/itemModel');

const getItems = async (req, res) => {
  const items = await Item.find({});
  res.json(items);
};

const createItem = async (req, res) => {
  const { name } = req.body;
  const item = new Item({
    name,
  });
  const createdItem = await item.save();
  res.status(201).json(createdItem);
};

module.exports = { getItems, createItem };
