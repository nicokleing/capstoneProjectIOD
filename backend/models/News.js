const mongoose = require('mongoose');

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    tags: [String],
    likes: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    mainImage: {
      type: String
    },
    additionalImages: [String],
    githubUrl: {
      type: String
    },
    sourceUrl: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const News = mongoose.model('News', newsSchema);

module.exports = News;
