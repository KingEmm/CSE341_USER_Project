const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const { body, validationResult } = require('express-validator');

const userValidation = [
    body('username')
        .toLowerCase()
        .notEmpty().withMessage('Username is required')
        .trim(),
    body('email').toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .trim()
];

const emailExists = async (email) => {
    if (!email) {
        return false;
    }
    try{
        const result = await mongodb.getDb().db('test').collection('Users').findOne({ 'email': email });
        return result !== null;
    }
    catch (error) {
        return false;
    }
}

const usernameExists = async (username) => {
  if (!username) {
    return false;
  }
  try {
    const result = await mongodb.getDb().db('test').collection('Users').findOne({ 'username': username });
    return result !== null;
  } catch (error) {
    return false;
  }
}

const getAllUsers = async (req, res, next) => {
    try{
        const result = await mongodb.getDb().db('test').collection('Users').find();
        
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists); // we just need the first one (the only one).
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const getSingleUser = async (req, res, next) => {
  // console.log(req.params.id);
  try{
      const username = req.params.username;
      const result = await mongodb.getDb().db('test').collection('Users').findOne({ 'username': username });
    
      if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
  }
  catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
  }
};

const createUser = async (req, res, next) => {
    const data  =  req.body;
    console.log(1);
    const errors = validationResult(req);
    console.log(2);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(3);

    try{
        let result;
        if (await emailExists(data.email) || await usernameExists(data.username)) {
            res.status(400).json({ message: 'Email or username already exist' });
            return;
        }
        console.log('Logging 4');
        if(Array.isArray(data))
            result  = await mongodb.getDb().db('test').collection('Users').insertMany(data);
        else
            result  = await mongodb.getDb().db('test').collection('Users').insertOne(data);
        // console.log('Logging')
        // Console.log('User created successfully');
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: 'User created successfully', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.json });
    }
};

const editSingleUser = async (req, res, next) => {
  // console.log(req.params.id);
    const username = req.params.username;
    const data  =  req.body;
    // const errors = validator.validationResult(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        if(!await usernameExists(username)){
            res.status(404).json({ message: 'User not found' });
            return;
        }
        await mongodb.getDb().db('test').collection('Products').createIndex({ email: 1 }, { unique: true });
        await mongodb.getDb().db('test').collection('Products').createIndex({ username: 1 }, { unique: true });
        const result = await mongodb.getDb().db('test').collection('Users').updateOne({ 'username': username }, { $set: data });
    
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found', id: result.insertedId });
        }
    }
    catch (error){
        res.status(500).json({ message: 'Error updating user' });
    }
};

const deleteUser = async (req, res, next) => {
    // console.log(req.params.id);
    const username = req.params.username;

    try{
        if(!await usernameExists(username)){
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const result = await mongodb.getDb().db('test').collection('Users').deleteOne({ 'username': username });
    
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch(error){
        res.status(500).json({'message': "Error Deleting User",'error': error})
    }
};

module.exports = { userValidation, getAllUsers, createUser, getSingleUser, editSingleUser, deleteUser };
