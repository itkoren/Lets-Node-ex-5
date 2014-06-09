Fifth Exercise (Streams & Callback Hell)
=================================================

Please complete the following steps:

1. Use **"sentigator"** server code and add a utube API call, only in case the google API call response, does not contain any result from utube. Do it by:
 * Using the **"[request](https://github.com/mikeal/request)"** module for querying utube API in the following format: "https://gdata.youtube.com/feeds/api/videos?max-results=5&alt=json&orderby=published&v=2&q=xxx"
 * The returned structure will include the following {"feed": {"entry": [ { "title":"xxx" } ] } } - Using the **"sentiment"** module from the previous exercise for parsing the text of the statuses received
 * Adding the utube API call results, to the combined parsed result which is passed to the client in JSON format and printing it - No fancy UI for now :-). The structure of the JSON result should look like the following:
                                                                                                                                                                  
      ```
      [{
        src: "Twitter",
        text: "Text of the tweet",
        score: 3
      }, {
        src: "Google",
        text: "Text of the search result (url is not from utube.com)",
        score: 2
      }, {
        src: "UTube",
        text: "Text of the search result from utube.com",
        score: 1
      }]
      ```

2. Now use async to control the flow

3. Use streams to improve the flow. Do it by:
 * Using **"[JSONStream](https://github.com/dominictarr/JSONStream)"** module as pipe for parsing the returned JSON from the API requests
 * Using **"[event-stream](https://github.com/dominictarr/event-stream)"** module as pipe for events of mapping the parsed JSON from **"[JSONStream](https://github.com/dominictarr/JSONStream)"** module (**HINT: A good example can be found in the ["JSONStream" documentation](https://github.com/dominictarr/JSONStream "JSONStream @ GitHub")**)

#####Use the **"sentiment"** and the **"sentigator"** modules in this repository as a starting point for the exercise