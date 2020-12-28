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
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        console.log(`From -> ${parsed.from.text}`);
        console.log(`Subject -> ${parsed.subject}`);
        console.log(`Text -> ${parsed.text}`);

        const p = new Push({
          user: PUSHOVER_USER,
          token: PUSHOVER_TOKEN,
        });

        p.send({
          title: parsed.subject,
          message: parsed.text,
        }, callback);
      })
      .catch(error => {
        throw error;
      });
  },
});

server.listen(PORT);
