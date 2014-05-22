// Include The 'sentiment' Module
var sentiment = require("sentiment");

/**
 * Performs sentiment parsing on the provided input array of search results.
 *
 * @param {Number} Input item to be parsed
 * @param {Array} Input items with the parsed results
 *
 * @return {void}
 */
// Etheration function for parsing the score of each item returned from the API
// Using the sentiment module API
var parse = module.exports = function(item, items) {
    // Build the returned items array
    items.push(item);

    // Parse score using the sentiment API
    sentiment(item.text, function (err, score) {
        item.score = score;
    });
};