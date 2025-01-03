const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: [String], required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_color: { type: String, required: true },
    product_size: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_quantity_sold: { type: Number, default: 0 },
    product_status: { type: String, enum: ["On stock", "Out of stock", "Suspend"] },
    product_type: {
      type: String,
      required: true,
      enum: ["MaleClothe", "FemaleClothe", "KidClothe"],
    },
    // product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const maleClotheSchema = new Schema(
  {
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "male_clothes",
  }
);
const femaleClotheSchema = new Schema(
  {
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "female_clothes",
  }
);
const kidClotheSchema = new Schema(
  {
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "kid_clothes",
  }
);
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  femaleClothe: model("FemaleClothe", femaleClotheSchema),
  maleClothe: model("MaleClothe", maleClotheSchema),
  kidClothe: model("KidClothe", kidClotheSchema),

  product1: model(DOCUMENT_NAME, productSchema),
};
