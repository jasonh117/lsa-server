var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: String,
  body: String,
  tags: [String],
  images: { data: Buffer, contentType: String },
  author: Object,
  createdAt: { type: Date, default: Date.now }
});

schema.index({"$**":"text"});

module.exports = mongoose.model('cards', schema);
