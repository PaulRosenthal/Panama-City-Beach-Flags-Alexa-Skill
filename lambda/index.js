/* *
 * The basis for this Alexa Skill comes from the Alexa SDK and instructions provided for getting started.
 * To request an API key for the endpoint returning the current flag color, please contact me (Paul Rosenthal).
 * */

const Alexa = require('ask-sdk-core');
const axios = require('axios').default;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
         || Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartOverIntent';
    },
    async handle(handlerInput) {
        
        var speakOutput = 'There was an error retrieving the Panama City Beach flag' +
        ' status. Please try again soon. Say Cancel to exit.';
        
        try {
            var flag_description = await axios({
                url: "https://wrapapi.com/use/PaulRosenthal/panama_city_beach_flags/current_flag_description/latest",
                method: 'post',
                data: {
                    "wrapAPIKey": "[API_KEY]"
                    
                }
                
            
             }).then(function(data) {
                    var api_response_body = data.data.data
                    // The API response body is not properly formatted JSON,
                    // using single quotes instead of double quotes. To fix this,
                    // the single quotes JSON response is converted to a string.
                    // The string is manipulated to replace single quotes with
                    // double quotes. Finally, the string is converted back
                    // to a JSON object where its elements can be accessed as
                    // intended.
                    var api_response_body_string = JSON.stringify(api_response_body)
                    api_response_body_string.replace(/'/g, '"') 
                     var formatted_json_api_response_body = JSON.parse(api_response_body_string)
                     flag_description = formatted_json_api_response_body["flag_description"] 
                     if (flag_description === undefined) {
                         throw new Error('The flag status did not return properly from the API.')
                     }
                    console.log(flag_description)
                    return flag_description
               })
        
        // Parse the flag description in lower case to identify
        // the flag's current color along with a description.
        flag_description = flag_description.toLowerCase();
        if (flag_description.includes("low")) {
            flag_description = "green - Low hazard with calm conditions"
        }
        if (flag_description.includes("medium")) {
            flag_description = "yellow - medium hazard, moderate surf and/or strong currents"
        }
        if (flag_description.includes("strong")) {
            flag_description = "red - strong surf and/or currents"
        }
        if (flag_description.includes("closed")) {
            flag_description = "double red - the water is closed to the public"
        }
        if (flag_description.includes("marine")) {
            var purple_flag = ". Purple flags are also flying on the beach, indicating dangerous marine life such as jellyfish"
            flag_description = flag_description + purple_flag
        }
        
        speakOutput = 'The flag status in Panama City Beach is currently ' + flag_description +
        '. Would you like to learn more?';
        }
        
        catch (err) {
            console.log('Error encountered: ' + err);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LearnMoreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LearnMoreIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Great! Regardless of the flag color, you should always use caution. "
        + "Green flags indicate low hazard and calm conditions. Yellow flags represent a moderate "
        + "surf and/or moderate currents. Red flags mean that there are a high surf and/or strong "
        + "currents. Do not enter the water above knee level. Double red flags mean that the water "
        + "is dangerous and it is illegal to enter it. Finally, purple flags indicate that marine "
        + "pests such as jellyfish are present. Thank you for checking on the flag status. "
        + "Talk to you soon!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse()
            // Since a reprompt is not included, the user will be exited from the skill.
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = "When prompted, you can say yes to learn more about the beach flags. "
        + " Try asking Alexa to open Panama City Beach Flags again.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Thank you for checking on the flag status. Talk to you soon!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I didn\'t understand that response. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        LearnMoreIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
    