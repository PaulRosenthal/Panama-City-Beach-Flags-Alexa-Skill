# Panama City Beach Flags Alexa Skill

This repository contains the source code for an Alexa Skill that provides the user with the current beach safety flag status for Panama City Beach, Florida. The skill can also provide additional safety information to the user.

The skill works by requesting the flag status saved as a [text file in this repository](/current-flag-status.txt). The text file is updated every 30 minutes [via GitHub Actions](/.github/workflows/populate-current-flag-status.yml). The flag status originates from https://www.visitpanamacitybeach.com.

## Using the Skill

This skill has been published and is available on Alexa devices (including iOS and Android devices with the Alexa app). To use it, simply say "Alexa, enable Panama City Beach Safety Flags." Then, any time you'd like to hear the current flag status, just say "Alexa, Panama City Beach Flags."

<a href="https://www.amazon.com/dp/B0B1M6ZC75?ref&ref=cm_sw_em_r_as_dp_UNqfq3K6RDMoO"><img src="/img/just-ask-alexa-skill-image.png" alt="Just Ask Alexa - Panama City Beach Flags Safety Skill" class="center"></a>