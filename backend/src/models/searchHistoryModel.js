const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  searchTerms: {
    type: [String],
    default: [],
  },
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
module.exports = SearchHistory;
