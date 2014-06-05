// Include The 'sentiment' Module
var sentiment = require("sentiment");

// Constructor
function Parser() {
    // Initialize all instance properties
    this.items = [];
}

// Prototype Methods
/**
 * Performs sentiment parsing on the provided input array of search results.
 *
 * @param {Number} Input index of the current result to be parsed
 * @param {Array} Input search results
 * @param {Function} Input parse result method for parsing a single result
 * @param {Boolean} Input flag which represents whether the results contain items from UTube
 * @param {Function} Callback to invoke when parsing completes
 *
 * @return {void}
 */
// Eteration function for parsing the score of each item returned from the API
// Using the sentiment module API
Parser.prototype.parse = function(index, results, parseResult, hasUTube, callback) {
    parse(index, results, this.items, parseResult, hasUTube, callback)
};

/**
 * Get the already parsed items.
 *
 * @return {Array}
 */
Parser.prototype.getItems = function() {
    return this.items;
};

/**
 * Performs sentiment parsing on the provided input array of search results.
 *
 * @param {Number} Input index of the current result to be parsed
 * @param {Array} Input search results
 * @param {Array} Input items with the parsed results
 * @param {Function} Input parse result method for parsing a single result
 * @param {Boolean} Input flag which represents whether the results contain items from UTube
 * @param {Function} Callback to invoke when parsing completes
 *
 * @return {void}
 */
// Eteration function for parsing the score of each item returned from the API
// Using the sentiment module API
function parse(index, results, items, parseResult, hasUTube, callback) {
    var result = results[index];

    // Use the supplied parsing method for parsing the current result
    var item = parseResult(result);

    // Build the returned items array
    items.push(item);

    // Check if in utube
    if (!hasUTube && result.unescapedUrl && -1 !== result.unescapedUrl.indexOf("utube.com")) {
        hasUTube = true;
    }

    // Parse score using the sentiment API
    sentiment(item.text, function (err, score) {
        item.score = score;

        // Defer next turn execution (Eteration)
        setImmediate(function () {
            // Check if eteration should continue
            if (index < (results.length - 1)) {;
                parse(++index, results, items, parseResult, hasUTube, callback);
            }
            else {
                callback(null, { items: items, hasUTube: hasUTube });
            }
        });
    });
};

// Export the object
module.exports = Parser;