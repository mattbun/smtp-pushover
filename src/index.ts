import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import * as Push from 'pushover-notifications';
import { shouldIgnore } from './filter';

const {
  PORT = 25,
  PUSHOVER_USER,
  PUSHOVER_TOKEN,
} = process.env;

const server = new SMTPServer({
  authOptional: true,
  async onData(stream, _session, callback) {
    const parsed = await simpleParser(stream);

    const subject = (parsed.subject ?? "").trim();
    const text = (parsed.text ?? "").trim();

    console.log(`Subject -> ${subject}`);

    // if the filter says to ignore, drop without sending
    if (shouldIgnore(subject)) {
      console.log('→ Ignored by filter');
      return callback();
    }

    console.log(`Text -> ${text}`);
    
    const push = new Push({
      user: PUSHOVER_USER,
      token: PUSHOVER_TOKEN,
    });

    push.send({
      title: subject,
      message: text,
    }, callback);
  },
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
