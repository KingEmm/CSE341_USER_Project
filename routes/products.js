const express = require('express');

const professionalController = require('../controllers/products');

const productRouter = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Success
 */
productRouter.get('/', professionalController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Success
 */
productRouter.get('/:id', professionalController.getSingleProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new 
 *     security:
 *        - bearerAuth: []
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Product"
 *               description:
 *                 type: string
 *                 example: "This is an example product"
 *               category:
 *                 type: string
 *                 example: "Example Category"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid Products data
 */
productRouter.post('/', professionalController.productValidation, professionalController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Product"
 *               description:
 *                 type: string
 *                 example: "This is an example product"
 *               category:
 *                 type: string
 *                 example: "Example Category"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid Products data
 */
productRouter.put('/:id', professionalController.productValidation, professionalController.editSingleProduct);

/** 
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Success
 */
productRouter.delete('/:id', professionalController.deleteSingleProduct);

module.exports = productRouter;