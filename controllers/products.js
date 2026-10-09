const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const { body, validationResult } = require('express-validator');

const productValidation = [
    body('name')
        .notEmpty().withMessage('Product name is required')
        .trim(),
    body('description')
        .notEmpty().withMessage('Product description is required')
        .trim(),
    body('category')
        .notEmpty().withMessage('Product category is required')
        .trim(),
    body('price')
        .isFloat({ min: 0 }).withMessage('Product price must be a positive number'),
    body('stock')
        .isInt({ min: 0 }).withMessage('Product stock must be a positive integer')
];

const isValidUID = async (productId) => {
  if (!productId) {
    return false;
  }
  const result = await mongodb.getDb().db('test').collection('Products').findOne({ '_id': productId });
  return result !== null;
}

const getAllProducts = async (req, res, next) => {
    try{
        const result = await mongodb.getDb().db('test').collection('Products').find();
        console.log(process.env.GOOGLE_REDIRECT_URI);

        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists); // we just need the first one (the only one).
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

const getSingleProduct = async (req, res, next) => {
  // console.log(req.params.id);
  try{
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('test').collection('Products').findOne({ '_id': productId });
    
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
  catch(error){
    res.status(404).json({ message: 'Error Getting User', 'error': error});
  }
};  


const createProduct = async (req, res, next) => {
    const data  =  req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({error: errors, data: data});
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      let result;
      // const a = await mongodb.getDb().db('test').collection('Products').createIndex({ email: 1 }, { unique: true });
      // console.log('Logging')
      if(Array.isArray(data))
          result  = await mongodb.getDb().db('test').collection('Products').insertMany(data);
      else
          result  = await mongodb.getDb().db('test').collection('Products').insertOne(data);
      // console.log('Logging')
      // Console.log('User created successfully');
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json({ message: 'Product created successfully', id: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', 'error': error });
    }
};

const editSingleProduct = async (req, res, next) => {
  // console.log(req.params.id);
  const productId = new ObjectId(req.params.id);
  const data  =  req.body;
  // const errors = validator.validationResult(req.body);
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(!await isValidUID(productId)){
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    const result = await mongodb.getDb().db('test').collection('Products').updateOne({ '_id': productId }, { $set: data });

    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: 'Product updated successfully' });
    } else {
        res.status(404).json({ message: 'Product not found', id: result.insertedId });
    }
  }
  catch(error){
    res.status(404).json({ message: 'Error Editing Product', 'error': error});
  }
};

const deleteSingleProduct = async (req, res, next) => {
  // console.log(req.params.id);
  const productId = new ObjectId(req.params.id);
//   const data  =  req.body;
  try{
    if(!await isValidUID(productId)){
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const result = await mongodb.getDb().db('test').collection('Products').deleteOne({ '_id': productId });
  
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
  catch(error){
    res.status(500).json({'message': 'Error Deleting Product', 'error': error})
  }
};

module.exports = { productValidation, getAllProducts, createProduct, getSingleProduct, editSingleProduct, deleteSingleProduct };
