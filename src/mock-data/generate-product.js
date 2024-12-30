const { faker } = require("@faker-js/faker");
const {
  product,
  femaleClothe,
  maleClothe,
  kidClothe,
} = require("../models/product.model");
const ProductService = require("../services/product.service");
const deleteByDate = async () => {
  try {
    // Xác định khoảng thời gian
    const startOfDay = new Date("2024-12-10T00:00:00Z");
    const endOfDay = new Date("2024-12-10T23:59:59Z");
    const result = await product.deleteMany({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    console.log(`${result.deletedCount} documents deleted.`);
  } catch (err) {
    console.error(err);
  }
};
const createProduct = async (req, res, next) => {
  try {
    const productTypes = ["MaleClothe", "FemaleClothe", "KidClothe"];
    const colors = ["Blue", "Red", "Green", "Black", "White", "Yellow", "Pink"];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const brands = ["Mitu", "Brando", "StylePro", "FashionHub", "Trendsetter"];
    const productNames = [
      "Classic Jeans",
      "Formal Shirt",
      "Casual T-Shirt",
      "Slim Pants",
      "Cotton Hoodie",
    ];

    for (let i = 1; i <= 50; i++) {
      const type = faker.helpers.arrayElement(productTypes);
      const color = faker.helpers.arrayElement(colors);
      const size = faker.helpers.arrayElement(sizes);
      const brand = faker.helpers.arrayElement(brands);
      const name = faker.helpers.arrayElement(productNames);
      const price = faker.commerce.price({ min: 0, max: 200 });
      const quantity = faker.number.int({ min: 1, max: 100 });

      const product = {
        product_name: name,
        product_thumb: faker.image.url(),
        product_description: faker.lorem.sentence(),
        product_price: price,
        product_color: color,
        product_size: size,
        product_quantity: quantity,
        product_type: type,
        product_attributes: {
          brand: brand,
        },
      };
      console.log(product.product_description);
      const result = await ProductService.createProduct(type, product);
    }
    res.json({ message: "Products created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createProduct, deleteByDate };
