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


// ============================================
// ============================================
// ========= HANDLE NEW-SESSION HOOK ==========
// ============================================
// ============================================
app.post('/chat', (req, res) => {
  console.log("Received a webhook:", req.body);
  if (req.body.EventType === 'onSessionAdded' && req.body.CreatedBy != '+37258821796' && !req.body.CreatedBy != 'whatsapp:+13602484847') {
    let client = new twilio(config.twilio.accountSid, config.twilio.authToken); 
    client.messaging.sessions(req.body.SessionSid)
      .participants
      .create({
          identity: "Andres"
        })
      .then(participant => console.log(`Added 'Andres' to ${req.body.SessionSid}.`))
      .catch(err => console.error(`Failed to add a member to ${req.body.SessionSid}!`, err));
  } else {
    console.log("(ignored!)");
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
}).catch(console.error);
