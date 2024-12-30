// "use strict";
const {
  product,
  femaleClothe,
  maleClothe,
  kidClothe,
} = require("../models/product.model");
const { BadRequestError, Forbiden } = require("../core/error.response");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "MaleClothe":
        return new MaleClothe(payload).createProduct();
      case "FemaleClothe":
        return new FemaleClothe(payload).createProduct();
      case "KidClothe":
        return new KidClothe(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Types  ${type}`);
    }
  }
  static async getAllProducts() {
    return await product.find();
  }
  static async getProductById(id) {
    return await product.findById(id);
  }
  static async findProductByNameOrDescript(keyWords) {
    return await product.find({
      $or: [
        { product_name: { $regex: keyWords, $options: "i" } },
        { product_description: { $regex: keyWords, $options: "i" } },
      ],
    });
  }
  static async getRandomProducts(limit) {
    return await product.aggregate([{ $sample: { size: limit } }]);
  }
  static async getLatestProducts(limit) {
    return await product.find().sort({ createdAt: -1 }).limit(limit);
  }
  static async getRelatedProducts(type, id, limit) {
    return await product
      .find({ product_type: type, _id: { $ne: id } })
      .limit(limit);
  }
  static async getShopProducts(limit, skip, searchQuery, price, color, size, gender, sortBy) {
    // Build the query object
    let query = {};

    if (searchQuery) {
      query.$or = [
        { product_name: { $regex: searchQuery, $options: "i" } },
        { product_description: { $regex: searchQuery, $options: "i" } },
      ];
    }
    
    if (price) {
      const priceRanges = Array.isArray(price) ? price : [price];
      const priceFilter = priceRanges.map((range) => {
        const [min, max] = range.split("-").map(Number);
        return { product_price: { $gte: min, $lte: max } };
      });

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: priceFilter }];
        delete query.$or;
      } else {
        query.$or = priceFilter;
      }
    }

    if (color) {
      query.product_color = { $in: Array.isArray(color) ? color : [color] };
    }

    if (size) {
      query.product_size = { $in: Array.isArray(size) ? size : [size] };
    }

    if (gender) {
      query.product_type = { $in: Array.isArray(gender) ? gender : [gender] };
    }

    let sort = {};
    if (sortBy === "latest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "lPrice") {
      sort = { product_price: 1 }; 
    } else if (sortBy === "hPrice") {
      sort = { product_price: -1 };
    }

    const [products, total] = await Promise.all([
      product.find(query).sort(sort).skip(skip).limit(limit), // Fetch products for the current page
      product.countDocuments(query), // Get the total count of products
    ]);

    const totalPages = Math.ceil(total / limit);

    return { products, totalPages };
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_color,
    product_size,
    product_quantity,
    product_type,
    // product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_color = product_color;
    this.product_size = product_size;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    // this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct() {
    return await product.create(this);
  }
}

class FemaleClothe extends Product {
  async createProduct() {
    const newClothing = await femaleClothe.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("create new FemaleClothe error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

class MaleClothe extends Product {
  async createProduct() {
    const newElectronic = await maleClothe.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("create new MaleClothe error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
class KidClothe extends Product {
  async createProduct() {
    const newClothing = await kidClothe.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("create new FemaleClothe error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
module.exports = ProductFactory;
