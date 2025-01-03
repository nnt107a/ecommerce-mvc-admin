"use strict";
const { model, Schema, Types } = require("mongoose"); // Ensure Types is imported
const { manufacturer } = require("../models/manufacturer.model");

class ManufacturerService {
    async getManufacturerName() {
        try {
            const manufacturers = await manufacturer.find({}, 'manufacturer_name');
            return manufacturers.map(manufacturer => manufacturer.manufacturer_name);
        } catch (error) {
            console.error('Error fetching manufacturer names:', error);
            throw error;
        }
    }
}
module.exports = new ManufacturerService;
