// "use strict";
const {
  product,
  femaleClothe,
  maleClothe,
  kidClothe,
} = require("../models/product.model");
const ManufacturerService = require("../services/manufacturer.service");
const { BadRequestError, Forbiden } = require("../core/error.response");
const { order } = require("../models/order.model");
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
  static async getShopProducts(limit, skip, searchQuery, product_type, product_brand, sortBy) {
    // Build the query object
    let query = {};

    if (searchQuery) {
      query = { product_name: { $regex: searchQuery, $options: "i" } };
    }
    
    if (product_type) {
      query['product_type'] = product_type;
    }

    if (product_brand) {
      query['product_attributes.brand'] = product_brand;
    }

    let sort = {};
    if (sortBy === "latest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "lPrice") {
      sort = { product_price: 1 }; 
    } else if (sortBy === "hPrice") {
      sort = { product_price: -1 };
    } else if (sortBy === "bestSeller") {
      sort = { product_quantity_sold: -1 };
    } else if (sortBy === "worstSeller") {
      sort = { product_quantity_sold: 1 };
    }

    const [products, total] = await Promise.all([
      product.find(query).sort(sort).skip(skip).limit(limit), // Fetch products for the current page
      product.countDocuments(query), // Get the total count of products
    ]);

    const totalPages = Math.ceil(total / limit);

    return { products, totalPages };
  }
  static async addProductQuantitySoldField() {
    const manufacturerNames = await ManufacturerService.getManufacturerName();

    // Fetch products
    const products = await product.find().lean();

    // Filter products based on manufacturer names
    const validProducts = products.filter(product => 
      manufacturerNames.includes(product.product_attributes['brand'])
    );

    const invalidProducts = products.filter(product => 
      !manufacturerNames.includes(product.product_attributes['brand'])
    );

    // Remove invalid products from the database
    const invalidProductIds = invalidProducts.map(product => product._id);
    await product.deleteMany({ _id: { $in: invalidProductIds } });

    return invalidProductIds;
  }
  static async getRevenueReport(timeRange) {
    const currentDate = new Date();

    let matchStages = [];
    let labels = [];

    for (let i = 6; i >= 0; i--) {
        let startDate, endDate, label;

        if (timeRange === 'day') {
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - i);

          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          endDate.setDate(endDate.getDate());

          label = `${startDate.getDate()}/${startDate.getMonth() + 1}`;
        } else if (timeRange === 'week') {
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - (i * 7) - startDate.getDay());

          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);

          label = `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;
        } else if (timeRange === 'month') {
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          startDate.setMonth(startDate.getMonth() - i);
          startDate.setDate(1);

          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(0);
          endDate.setHours(23, 59, 59, 999);

          label = `${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
        }

        matchStages.push({
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        });

        labels.push(label);
    }

    const revenueReports = await Promise.all(matchStages.map(matchStage => 
        order.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ])
    ));

    return revenueReports.map((report, index) => ({
        timeRange: labels[index],
        totalRevenue: report.length > 0 ? report[0].totalRevenue : 0
    }));
  }
  static async getTopRevenueProducts(timeRange) {
      const currentDate = new Date();
      
      let startDate, endDate;

        if (timeRange === 'day') {
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
        } else if (timeRange === 'week') {
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(startDate.getDate() - startDate.getDay());

            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        } else if (timeRange === 'month') {
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(1);

            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
        }

        const topRevenueProducts = await order.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            { $unwind: "$order_products" },
            {
                $group: {
                    _id: "$order_products.product_id",
                    totalRevenue: { $sum: { $multiply: ["$order_products.quantity", "$order_products.price"] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        // Fetch product details separately
        const productIds = topRevenueProducts.map(product => product._id);
        const products = await product.find({ _id: { $in: productIds } });

        // Merge product details into topRevenueProducts
        const topRevenueProductsWithDetails = topRevenueProducts.map(product => {
            const productDetails = products.find(p => p._id.equals(product._id));
            return {
                ...product,
                productName: productDetails ? productDetails.product_name : 'Unknown'
            };
        });

        return topRevenueProductsWithDetails.reverse();
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
