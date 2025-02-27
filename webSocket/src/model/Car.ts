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

const CarSchema = new Schema({
  id: { type: Number, required: true },
  nome: { type: String, required: true },
  marca: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String, required: true },
  bids: [BidSchema],
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