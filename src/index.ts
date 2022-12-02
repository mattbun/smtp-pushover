import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import * as Push from 'pushover-notifications';

const {
  PORT = 25,
  PUSHOVER_USER,
  PUSHOVER_TOKEN,
} = process.env;

const server = new SMTPServer({
  authOptional: true,
  async onData(stream, _session, callback) {
    const parsed = await simpleParser(stream);

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

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
