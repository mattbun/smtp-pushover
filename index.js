const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const Push = require('pushover-notifications');

const {
  PORT = 25,
  PUSHOVER_USER,
  PUSHOVER_TOKEN,
} = process.env;

const server = new SMTPServer({
  authOptional: true,
  async onData(stream, session, callback) {
    const parsedMessage = await simpleParser(stream);

    console.log(`From -> ${parsed.from.text}`);
    console.log(`Subject -> ${parsed.subject}`);
    console.log(`Text -> ${parsed.text}`);

    const push = new Push({
      user: PUSHOVER_USER,
      token: PUSHOVER_TOKEN,
    });

    push.send({
      title: parsed.subject,
      message: parsed.text,
    }, callback);
  },
});

server.listen(PORT);
