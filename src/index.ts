import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import * as Push from "pushover-notifications";

const {
  PORT = 25,
  PUSHOVER_USER,
  PUSHOVER_TOKEN,
  IGNORE_SUBJECT_REGEX,
} = process.env;

// fail fast if creds missing
if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
  console.error("⚠️  You must set PUSHOVER_USER and PUSHOVER_TOKEN");
  process.exit(1);
}

// build the optional filter regex once
const ignoreRe = IGNORE_SUBJECT_REGEX
  ? new RegExp(IGNORE_SUBJECT_REGEX, "i")
  : null;

const server = new SMTPServer({
  authOptional: true,
  async onData(stream, _session, callback) {
    try {
      const parsed = await simpleParser(stream);
      const subject = (parsed.subject ?? "").trim();
      const text    = (parsed.text    ?? "").trim();

      console.log(`Subject: ${subject}`);

      // if regex is set and it matches, drop it
      if (ignoreRe && ignoreRe.test(subject)) {
        console.log("→ Ignored by filter");
        return callback();
      }

      // otherwise forward to Pushover
      const push = new Push({ user: PUSHOVER_USER, token: PUSHOVER_TOKEN });
      push.send({ title: subject, message: text }, (err, result) => {
        if (err) {
          console.error("Pushover error:", err);
          return callback(err);
        }
        console.log("Pushover sent:", result);
        callback();
      });
    } catch (err) {
      console.error("Processing error:", err);
      callback(err);
    }
  },
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
