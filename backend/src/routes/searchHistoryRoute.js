const { Router } = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const SearchHistory = require("../models/searchHistoryModel");
const searchHistoryRouter = Router();

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded.id); // Fetch user by ID
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Store search term in user's history
searchHistoryRouter.post("/store", authenticate, async (req, res) => {
  const { searchTerm } = req.body;
  const userId = req.user._id;

  // Validate searchTerm
  if (!searchTerm || typeof searchTerm !== 'string') {
    return res.status(400).json({ message: "Invalid search term" });
  }

  try {
    // Find or create a search history entry for the user
    let searchHistory = await SearchHistory.findOne({ userId });
    if (!searchHistory) {
      searchHistory = new SearchHistory({ userId, searchTerms: [] });
    }

    // Check if the search term is already in the history
    if (!searchHistory.searchTerms.includes(searchTerm)) {
      // Add new search term to the front
      searchHistory.searchTerms.unshift(searchTerm);

      // Keep only the last 5 unique searches
      if (searchHistory.searchTerms.length > 5) {
        searchHistory.searchTerms.pop(); // Remove the oldest search term
      }
    }

    await searchHistory.save();
    res.status(200).json({ message: "Search term saved successfully", searchHistory: searchHistory.searchTerms });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's search history
searchHistoryRouter.get("/get", authenticate, async (req, res) => {
  const userId = req.user._id;

  try {
    const searchHistory = await SearchHistory.findOne({ userId });
    if (!searchHistory) {
      return res.status(404).json({ message: "No search history found" });
    }

    res.status(200).json({ searchHistory: searchHistory.searchTerms });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Clear user's search history
searchHistoryRouter.delete("/clear", authenticate, async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await SearchHistory.findOneAndDelete({ userId });
    if (!result) {
      return res.status(404).json({ message: "No search history to clear" });
    }
    res.status(200).json({ message: "Search history cleared successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = searchHistoryRouter;
