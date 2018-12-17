const config     = require('./config');
const express    = require('express');
const bodyParser = require('body-parser');
const twilio     = require('twilio');
const ngrok      = require('ngrok');

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/token/:identity', (request, response) => {
  const identity = request.params.identity;
  const accessToken = new twilio.jwt.AccessToken(config.twilio.accountSid, config.twilio.apiKey, config.twilio.apiSecret);
  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
    serviceSid: config.twilio.chatServiceSid,
    endpointId: `${identity}:browser`
  });
  accessToken.addGrant(chatGrant);
  accessToken.identity = identity;
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify({
    token: accessToken.toJwt(),
    identity: identity
  }));
})

app.listen(config.port, () => {
  console.log(`Application started at localhost:${config.port}`);
});

const request = require('request-promise');
console.log(twilio);
let client = {};
client.Sessions = (session_sid) => {
  console.log("A");
  return {
    Participants: {
      add: (options) => {
        console.log(`Adding ${options.identity}…`);
        return request(`https://messaging.twilio.com/v1/Sessions/${session_sid}/Participants`, {
          method: 'POST',
          auth: { user: config.twilio.apiKey, password: config.twilio.apiSecret },
          form: {
            Identity: options.identity
          }
        })
      }
    }
  }
}


let me = "Tack tackleton";



// ============================================
// ============================================
// ========= HANDLE NEW-SESSION HOOK ==========
// ============================================
// ============================================
app.post('/chat', (req, res) => {
  if (req.body.EventType === 'onChannelAdded') {
    client
      .Sessions(req.body.ChannelSid)
      .Participants.add({identity: me})
      
      .then(result => console.log(`Added '${me}' to ${req.body.ChannelSid}.`))
      .catch(err => console.error(`Failed to add a member to ${req.body.ChannelSid}!`, err));
  }
});






var ngrokOptions = {
  proto: 'http',
  addr: config.port
};

if (config.ngrokSubdomain) {
  ngrokOptions.subdomain = config.ngrokSubdomain
}

ngrok.connect(ngrokOptions).then(url => {
  console.log('ngrok url is ' + url);
});
