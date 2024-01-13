/* *
 * The basis for this Alexa Skill comes from the Alexa SDK and instructions provided for getting started.
 * The flag status is retrieved from the https://github.com/PaulRosenthal/Panama-City-Beach-Flags-Alexa-Skill
 * GitHub repository. The repository uses a GitHub Action to periodically check for and update the flag status.
 * */
 
const Alexa = require('ask-sdk-core');
const axios = require('axios').default;

async function getDetailedFlagDescription(flag_status) {
    // Parse the flag description in lower case to identify
    // the flag's current color along with a description.
    flag_status = flag_status.toLowerCase();
    var flag_status_description;
    if (flag_status.includes("medium") || flag_status.includes("yellow")) {
        flag_status_description = "yellow. This color indicates medium hazard, moderate surf and/or strong currents"
    } else if (flag_status.includes("low") || flag_status.includes("green")) {
        flag_status_description = "green. This color indicates generally low hazard with calm conditions"
    } else if (flag_status.includes("closed") || flag_status.includes("double red")) {
        flag_status_description = "double red. The water is closed to the public"
    } else if (flag_status.includes("strong") || flag_status.includes("red") || flag_status.includes("high")) {
        flag_status_description = "red. This color indicates strong surf and/or currents, and you should not enter the water above knee level"
    }
    
    if (flag_status.includes("marine") || flag_status.includes("purple")) {
        var purple_flag = ". Purple flags are also flying on the beach, indicating dangerous marine life such as jellyfish are present"
        flag_status_description = flag_status_description + purple_flag
    }
    return flag_status_description;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
         || Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartOverIntent';
    },
    async handle(handlerInput) {
        
        var speakOutput = 'There was an error retrieving the Panama City Beach flag' +
        ' status. Please try again soon. Say "Cancel" to exit.';
        
        try {
            var flag_status = await axios.get("https://raw.githubusercontent.com/PaulRosenthal/Panama-City-Beach-Flags-Alexa-Skill/main/current-flag-status.txt").then(function(response) {
                    var flag_status = response.data
                    if (flag_status === undefined) {
                         throw new Error('The flag status did not return properly from the API.')
                     }
                    console.log("The status retrieved was: " + flag_status)
                    return flag_status
               })
        
        var detailed_flag_description = await getDetailedFlagDescription(flag_status);
        
        speakOutput = 'The flag status in Panama City Beach is currently ' + detailed_flag_description +
        '. Would you like to learn more?';
        }
        
        catch (err) {
            console.log('Error encountered: ' + err);
            speakOutput = 'Unfortunately, an error was encountered when trying to '
            + 'retrieve the Panama City Beach flag status. Please try again soon.';
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
        + "Stay safe!";

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
        const speakOutput = 'Thank you for checking on the flag status. Stay safe!';

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
