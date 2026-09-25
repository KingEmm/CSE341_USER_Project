const express = require('express');

const usersController = require('../controllers/users');

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: User username
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.get('/:username', usersController.getSingleUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "exampleuser"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "sEc#rep@$$w0rd"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid User data
 */
userRouter.post('/', usersController.userValidation, usersController.createUser);

/**
 * @swagger
 * /users/{username}:
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "exampleuser"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "sEc#rep@$$w0rd"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid User data
 */
userRouter.put('/:username', usersController.userValidation, usersController.editSingleUser);

/** 
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: User username
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.delete('/:username', usersController.deleteUser);

module.exports = userRouter;