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
      const flagStatusText = dom.window.document.querySelector('.flag-description').textContent;
      // Check if the element exists
      if (flagStatusText) {
        // Return the text
        return flagStatusText;
      } else {
        // Throw an error
        throw new Error("No flag description found");
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

  fs.writeFile('current-flag-status.txt', result, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('The output has been saved to the file.');
    }
  });
}

// Call main
main();