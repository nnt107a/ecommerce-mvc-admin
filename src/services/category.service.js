"use strict";
const { model, Schema, Types } = require("mongoose"); // Ensure Types is imported
const { category } = require("../models/category.model");

class CategoryService {
    async getCategoryName() {
        try {
          const categories = await category.find({}, 'category_name');
          return categories.map(category => category.category_name);
        } catch (error) {
          console.error('Error fetching category names:', error);
          throw error;
        }
    }
}
module.exports = new CategoryService;
