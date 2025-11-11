import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import * as Push from 'pushover-notifications';
//import * as dotenv from 'dotenv';
//dotenv.config({path: '.env'});
const {
  PORT = 25,
  PUSHOVER_USER,
  PUSHOVER_TOKEN,
} = process.env;
const PUSHOVER_DEFAULT_PRIORITY = process.env.PUSHOVER_DEFAULT_PRIORITY ? parseInt(process.env.PUSHOVER_DEFAULT_PRIORITY, 10) : 0;
const PUSHOVER_DEFAULT_RETRY = process.env.PUSHOVER_DEFAULT_RETRY ? parseInt(process.env.PUSHOVER_DEFAULT_RETRY, 10) : 30;
const PUSHOVER_DEFAULT_EXPIRE = process.env.PUSHOVER_DEFAULT_EXPIRE ? parseInt(process.env.PUSHOVER_DEFAULT_EXPIRE, 10) : 3600;

const server = new SMTPServer({
  authOptional: true,
  async onData(stream, _session, callback) {
    try {
      const parsed = await simpleParser(stream);
      const subjectSplit = (parsed.subject ?? "").trim().split(':');
      const subject = subjectSplit[0].trim();
      const text = (parsed.text ?? "").trim();
      const rawPriority = (subjectSplit.length > 1) ? subjectSplit[1]?.trim() : undefined;
      let priority: number = subjectSplit.length > 1 ? parseInt(rawPriority ?? `${PUSHOVER_DEFAULT_PRIORITY}`, 10) : PUSHOVER_DEFAULT_PRIORITY as number;
      priority = Math.max(-2, Math.min(2, priority || 0)); //Clamp priority between -2 and 2
      if(subjectSplit.length > 1 && (isNaN(parseInt(rawPriority,10)) || priority < -2 || priority > 2)) {
        console.log(`Invalid priority value provided in subject: ${subjectSplit[1]?.trim()} ... using default priority.`);
      }
      const push = new Push({
        user: PUSHOVER_USER,
        token: PUSHOVER_TOKEN,
      });
      let msg = {
        title: subject,
        message: text,
        priority: priority,
        retry: PUSHOVER_DEFAULT_RETRY,
        expire: PUSHOVER_DEFAULT_EXPIRE
      };

      console.log(`Subject -> ${subject}`);
      console.log(`Text -> ${text}`);
      console.log(`Priority -> ${priority}`);
      push.send(msg, callback);
    } catch (error) {
      console.error('Error sending push notification:', error);
      callback(error);
    }

  },
});

server.listen(PORT, () => {
  console.log(`Default Notification Priority: ${PUSHOVER_DEFAULT_PRIORITY}`);
  console.log(`Default Notification Retry Attempts: ${PUSHOVER_DEFAULT_RETRY}`);
  console.log(`Default Notification Expire Time: ${PUSHOVER_DEFAULT_EXPIRE}`);
  console.log(`Listening on port ${PORT}`)
});