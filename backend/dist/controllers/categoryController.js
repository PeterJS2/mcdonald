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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const Category_1 = require("../models/Category");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.Category.findAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCategories = getCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.Category.create(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [updated] = yield Category_1.Category.update(req.body, { where: { id } });
        if (updated) {
            const updatedCategory = yield Category_1.Category.findByPk(id);
            return res.json(updatedCategory);
        }
        throw new Error('Category not found');
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Category_1.Category.destroy({ where: { id } });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Category not found');
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.deleteCategory = deleteCategory;
