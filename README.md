This application is designed for demonstrating the capabilities of the Messaging Sessions API, particularly how Chat users in the browser can exchange messages seamlessly with others on SMS or WhatsApp.

## Configuring and getting started.
This demo requires a Twilio account. You'll need to collect some credentials from the [Twilio Console](twilio.com/console):
 - **Your Account SID** A string in the form `ACxx`, accessible from the [Dashboard](twilio.com/console/dashboard)
 - **An API/Signing Key Pair** These are an `SKxx` sid and the accompanying secret, part of the [Runtime](https://www.twilio.com/console/runtime/api-keys). A standard key is fine.
 - **Your Account's Chat Service SID** An `ISxx` SID which is best determined by creating a new session.

Creating a new session is straightforward. Check out the [code samples](https://www.twilio.com/docs/sms/conversational-messaging-sessions/sessions-resource?code-sample=code-create-session&code-language=curl&code-sdk-version=json) or run something like this from your command line:

    curl -X POST \
        https://messaging.twilio.com/v1/Sessions/ \
        --user SKxx:secret
        -d MessagingServiceSid=MGxx

In the response, look for `service_sid`; this is the value you want. Additionally, save the value in `sid` -- this will come in handy later on.

### Create a .env file.

Clone this repository. In the working directory, copy the `.env.example` file to a new file called `.env`. Inject the information you gathered above into the appropriate fields. It should look something like this:
    TWILIO_ACCOUNT_SID=AC3c96f11c8c1942ab02eca915b1debd27
    TWILIO_API_KEY=SK8c1942ab02eca915b1debd273c96f11c
    TWILIO_API_SECRET=yoursecret
    TWILIO_CHAT_SERVICE_SID=ISe9216d04b78c40229899ffd93aff33c4

### Upgrade node.js and install dependencies

Your system may not have a particularly recent version of node.js installed by default. This demo requires Node.js v10 or higher. Use the package manager most appropriate on your system. On Mac OS, you probably want `brew upgrade node.js`.

Test this by running `npm install`. This should execute successfully to completion.

### Start the Demo

Run `npm start`. This will automatically start two processes:

 1. One starts a token server, using the credentials from your `.env` file.
 2. The other runs a react app. Your browser should open automatically to https://localhost:3000/

Log in with a random identity string like `testfelix`. You'll know everything is working if the text "You are connected." appears on the top right.

### Add a Chat Participant

Using the Sessions [Participants REST API](https://www.twilio.com/docs/sms/conversational-messaging-sessions/the-sessionsparticipants-resource), create a new Chat participant by passing the `Identity=` parameter on the same session you'd created before.

    curl -X POST https://messaging.twilio.com/v1/Sessions/CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Participants \
        --data-urlencode "Identity=<chat-user-identity>" \
        -u SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:secret

In the browser, you should see the your session pop up within a second or two. Congratulations! You're in a session.

### Add an SMS Participant

Chatting with yourself isn't as satisfying without the comforting pling of SMS arrival. Visit the [Sessions SMS quickstart](https://twilio.com/docs/sms/conversational-messaging-sessions) to create a phone number. When you finally start adding participants, use the same session SID you used above to get started.

If all goes well, you'll have bridged an SMS user with a Chat user, all in a few requests!

## Next Steps

From this point, you have all you need to explore the power of declarative conversational messaging. Using the tools we've explored so far, you can:

 - Transfer a user from webchat to sms
 - Add a third, fourth, or even a fifth simultaneous participant (up to 20!)
 - Set up the [Programmable Chat](twilio.com/docs/chat) SDK in a mobile app (iOS or Android), for the same experience
 - Add a WhatsApp participant *(Coming soon!)*
 - Attach to Group MMS conversations *(Coming soon!)*
 - Exchange media and rich content *(Coming soon!)*

 Be advised that Sessions is under active development and the APIs you use here may change.
