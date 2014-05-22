// Include The 'http' Module
var http = require("http");

// Include The 'url' Module
var url = require("url");

// Include The 'request' Module
var request = require("request");

// Include The 'sentiment' Module
var sentiment = require("sentiment");

// Create the HTTP Server
var server = http.createServer(function(req, res) {
    // Handle HTTP Request
    // Parse the request querystring
    var parsedUrl = url.parse(req.url, true);
    var qs = parsedUrl.query;
    var completed = 0;
    var results = [];

    function complete(err, items) {
        completed++;
        results = results.concat(items);

        // If all searches completed, write response
        if (2 === completed) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        }
    }

    // Validating existence of query param
    if (qs.term) {
        // Querying the twitxy API for the supplied term
        request("http://twitxy.itkoren.com/?lang=en&count=5&term=" + encodeURIComponent(qs.term), function(error, response, body) {
            // Storage objects
            var results;
            var items = [];
            var i = 0;

            // Etheration function for parsing the score of each tweet returned from the twitxy API
            // Using the sentiment module API
            function parse(result, results, items, callback) {
                var item = {
                    src: "Twitter",
                    text: result.text,
                    score: 0
                };

                // Build the returned items array
                items.push(item);

                // Parse score using the sentiment API
                sentiment(item.text, function(err, score) {
                    item.score = score;

                    // Defer next turn execution (Etheration)
                    setImmediate(function() {
                        // Check if etheration should continue
                        if (i < (results.length - 1)) {
                            parse(results[++i], results, items, callback);
                        }
                        else {
                            callback(null, items);
                        }
                    });
                });
            }

            // Write the items results to the response
            console.log("Got response: " + response.statusCode);

            // Validate response
            if (body) {
                try {
                    results = JSON.parse(body);
                }
                catch(e) {}

                results = results && results.statuses || [];

                // Start parsing
                if (0 < results.length) {
                    parse(results[i], results, items, complete);
                }
            }
        });

        // Querying the google API for the supplied term
        request("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&language=en&resultSize=5&q=" + encodeURIComponent(qs.term), function(error, response, body) {
            // Storage objects
            var results;
            var items = [];
            var i = 0;

            // Etheration function for parsing the score of each tweet returned from the google API
            // Using the sentiment module API
            function parse(result, results, items, callback) {
                var item = {
                    src: "Google",
                    text: result.title,
                    score: 0
                };

                // Build the returned items array
                items.push(item);

                // Parse score using the sentiment API
                sentiment(item.text, function(err, score) {
                    item.score = score;

                    // Defer next turn execution (Etheration)
                    setImmediate(function() {
                        // Check if etheration should continue
                        if (i < (results.length - 1)) {
                            parse(results[++i], results, items, callback);
                        }
                        else {
                            callback(null, items);
                        }
                    });
                });
            }

            // Write the items results to the response
            console.log("Got response: " + response.statusCode);

            // Validate response
            if (body) {
                try {
                    results = JSON.parse(body);
                }
                catch(e) {}

                results = results && results.responseData && results.responseData.results || [];

                // Start parsing
                if (0 < results.length) {
                    parse(results[i], results, items, complete);
                }
            }
        });
    } else {
        // No search term supplied, just return
        console.log("Search failed!");
        console.log("Query parameters are missing");
        res.writeHead(500);
        res.end("** Only Bear Here :) **");
    }
}).listen(process.env.PORT || 8000, process.env.HOST || "0.0.0.0", function() {
    console.log("HTTP Server Started. Listening on " + server.address().address + " : Port " + server.address().port);
});