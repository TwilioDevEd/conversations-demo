# The Demo Conversations App

This is a lightweight application based on [Twilio Chat](https://www.twilio.com/docs/chat).

# Configuring and getting started

This demo requires a Twilio account and a working Chat Service SID.
You'll need to collect some credentials from the [Twilio Console](https://www.twilio.com/console):
* Your Account SID (`ACXXX`) and Auth Token, both accessible from the [Dashboard](https://twilio.com/console/dashboard)
* Your Account's Chat Service Sid `ISXXX` SID which is attached to your Chat Service

# Testing

The demo application can be configured and run in two ways:
* Forking [the demo-chat-application on CodeSandbox.io](https://codesandbox.io/s/github/TwilioDevEd/conversations-demo) (recommended)
* Cloning this repo and running locally

# Replacing the Chat Token
In order for your Chat Application to work, we need to authenticate a Chat user by retrieving a short-lived token attached to your API Key. The `getToken` function in `ChatApp.js` has a placeholder for your chat token.

You can generate a token in a few ways:
* Using the [twilio-cli](https://www.twilio.com/docs/twilio-cli/quickstart) and [twilio token plugin](https://github.com/twilio-labs/plugin-token) (Recommended)
* Using [Twilio Runtime Function](https://www.twilio.com/docs/runtime/functions)

 For the twilio-cli option, run the following command and enter the resulting token into the placeholder:
 `twilio token:chat --identity <The test chat username> --chat-service-sid <ISXXX...>
