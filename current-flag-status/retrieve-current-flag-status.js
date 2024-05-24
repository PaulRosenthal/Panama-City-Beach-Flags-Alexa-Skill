// Import the axios module
var axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');


// Define an async function that takes a URL as an argument and returns a promise
async function getFlagDescription(url) {
  // Use axios to send a GET request to the URL
  return axios.get(url)
    .then(function(response) {
      // Get the data from the response
      var data = response.data;
      const dom = new JSDOM(response.data);
      var flag_status = dom.window.document.querySelector('.beach-flag').src;
      // Check if the element exists
      if (flag_status) {
        // Parse the flag description in lower case to identify
        // the flag's current color along with a description.
        flag_status = flag_status.toLowerCase();
        var flag_status_description;
        if (flag_status.includes("medium") || flag_status.includes("yellow")) {
            flag_status_description = "yellow. This color indicates medium hazard, moderate surf and/or strong currents."
        } else if (flag_status.includes("low") || flag_status.includes("green")) {
            flag_status_description = "green. This color indicates generally low hazard with calm conditions."
        } else if (flag_status.includes("closed") || flag_status.includes("double red") || flag_status.includes("high hazard")) {
            flag_status_description = "double red. The water is closed to the public."
        } else if (flag_status.includes("strong") || flag_status.includes("red") || flag_status.includes("high")) {
            flag_status_description = "red. This color indicates strong surf and/or currents, and you should not enter the water above knee level."
        }
        
        if (flag_status.includes("marine") || flag_status.includes("purple")) {
            var purple_flag = ". Purple flags are also flying on the beach, indicating dangerous marine life such as jellyfish are present."
            flag_status_description = flag_status_description + purple_flag
        }
        return "The beach safety flags in Panama City Beach are " + flag_status_description;
      } else {
        // Throw an error
        throw new Error("No flag description found.");
      }
    })
    // Define a callback function that runs when the request is rejected
    .catch(function(error) {
      // Throw an error
      throw error;
    });
}

// Define an async function that calls getFlagDescription and prints the result
async function main() {
  // Call getFlagDescription with the URL and await for the promise to resolve
  var url = "https://www.visitpanamacitybeach.com/beach-alerts-iframe/";
  var result = await getFlagDescription(url);
  // Print the result
  console.log("The flag status text is: " + result);

  fs.writeFile(__dirname + '/../current-flag-status.txt', result, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('The output has been saved to the file.');
    }
  });
}

// Call main
main();