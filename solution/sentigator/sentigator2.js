// Include The 'http' Module
var http = require("http");

// Include The 'url' Module
var url = require("url");

// Include The 'request' Module
var request = require("request");

// Include The 'async' Module
var async = require("async");

// Include The 'parser' Module
var Parser = require("./lib2/parser");

// Create the HTTP Server
var server = http.createServer(function(req, res) {
    // Handle HTTP Request
    // Parse the request querystring
    var parsedUrl = url.parse(req.url, true);
    var qs = parsedUrl.query;

    // Validating existence of query param
    if (qs.term) {
        async.auto({
            twitxy: function (callback) {
                request("http://twitxy.itkoren.com/?lang=en&count=5&term=" + encodeURIComponent(qs.term), callback);
            },
            google: function (callback) {
                request("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&language=en&resultSize=5&q=" + encodeURIComponent(qs.term), callback);
            },
            parseTweets: ["twitxy", function (callback, data) {
                // Storage objects
                var results = (data.twitxy && JSON.parse(data.twitxy[1]) || { statuses: [] });
                var parser = new Parser();

                results = results && results.statuses;

                parser.parse(0, results, function(result) {
                    return {
                        src: "Twitter",
                        text: result.text,
                        score: 0
                    };
                }, false, callback);
            }],
            parseGoogle: ["google", function (callback, data) {
                var results = (data.google && JSON.parse(data.google[1]) || { responseData: { results: [] } });
                var parser = new Parser();

                results = results && results.responseData && results.responseData.results;

                parser.parse(0, results, function(result) {
                    return {
                        src: "Google",
                        text: result.title,
                        score: 0
                    };
                }, false, callback);
            }],
            utube: ["parseGoogle", function (callback, results) {
                if (results.parseGoogle.hasUTube) {
                    callback();
                }

                request("https://gdata.youtube.com/feeds/api/videos?max-results=5&alt=json&orderby=published&v=2&q=" + encodeURIComponent(qs.term), callback);
            }],
            parseUtube: ["utube", function (callback, data) {
                // Storage objects
                var results = (data.utube && JSON.parse(data.utube[1]) || { feed: { entry: [] } });
                var parser = new Parser();

                results = results && results.feed && results.feed.entry;

                parser.parse(0, results, function(result) {
                    return {
                        src: "UTube",
                        text: result.title.$t,
                        score: 0
                    };
                }, false, callback);
            }]
        },
        // optional callback
        function (err, results) {
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
            if (err) {
                // Deal with errors
                console.log("Got error: " + e.message);
                res.writeHead(500);
                res.end("** Only Bear Here :) **");
            }
            else {
                var items = results.parseTweets.items.concat(results.parseGoogle.items, results.parseUtube.items);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(items));
            }
        });
    }
    else {
        // No search term supplied, just return
        console.log("Search failed!");
        console.log("Query parameters are missing");
        res.writeHead(500);
        res.end("** Only Bear Here :) **");
    }
}).listen(process.env.PORT || 8000, process.env.HOST || "0.0.0.0", function() {
    console.log("HTTP Server Started. Listening on " + server.address().address + " : Port " + server.address().port);
});