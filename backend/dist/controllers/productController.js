"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.findAll({ include: [Category_1.Category] });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.create(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield Product_1.Product.update(req.body, { where: { id } });
        if (updated) {
            const updatedProduct = yield Product_1.Product.findByPk(id);
            return res.json(updatedProduct);
        }
        throw new Error('Product not found');
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Product_1.Product.destroy({ where: { id } });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Product not found');
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
