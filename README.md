# The Demo Conversations App

This is a lightweight application based on [Twilio Conversations](https://www.twilio.com/docs/conversations).

Please follow the directions for the [Twilio Conversations Quickstart](https://www.twilio.com/docs/conversations/quickstart) for a complete demo of this application with both SMS and chat participants.

# Configuring and getting started

This demo requires a Twilio account and a working Conversations Service SID.
You'll need to collect some credentials from the [Twilio Console](https://www.twilio.com/console):
* Your Account SID (`ACXXX`) and Auth Token, both accessible from the [Dashboard](https://twilio.com/console/dashboard)
* Your Account's Conversations Service Sid `ISXXX` SID which is attached to your Conversations Service

# Testing

The demo application can be configured and run in two ways:
* Forking [the demo-conversations-application on CodeSandbox.io](https://codesandbox.io/s/github/TwilioDevEd/conversations-demo) (recommended)
* Cloning this repo and running locally
  * Remember to copy the `.env.example` file to `.env` and replace the variables values with
  the ones from your account. By default `NODE_ENV` is set to `production`.
  

# Replacing the Access Token

The Conversations API uses an Access Token with a Chat Grant for client-side applications such as this one to authenticate themselves with Conversations Services in your Twilio Account.

In order for your Conversations Application to work, we need to authenticate a Conversations user by retrieving a short-lived token attached to your API Key. The `getToken` function in `ConversationsApp.js` has a placeholder for your chat token.

You can generate a token in a few ways:
* Using the [twilio-cli](https://www.twilio.com/docs/twilio-cli/quickstart) and [twilio token plugin](https://github.com/twilio-labs/plugin-token) (Recommended)
* Using [Twilio Runtime Function](https://www.twilio.com/docs/runtime/functions)

 For the twilio-cli option, run the following command and enter the resulting token into the placeholder:
 
 `twilio token:chat --identity <The test chat username> --chat-service-sid <ISXXX...>`

After generating a token manually, it will expire after a timeout period, so you will need to replace the token. To use this in production software, you would typically create a token endpoint in your back end application that uses your existing user authentication strategy.
