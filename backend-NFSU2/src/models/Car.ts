import { Schema, model } from "mongoose";

const BidSchema = new Schema({
  user: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CommentSchema = new Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const partSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 0, max: 10, required: true }
});

const CarSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  km: { type: Number, required: true },
  logoSrc: { type: String, required: true },
  carSrc: { type: String, required: true },
  bids: [BidSchema],
  parts: [partSchema],
  comments: [CommentSchema]
});

const CategoriaSchema = new Schema({
  popular: [CarSchema],
  luxo: [CarSchema]
});

const CarCollectionSchema = new Schema({
  categorias: [CategoriaSchema]
});

export default model("CarCollection", CarCollectionSchema);

