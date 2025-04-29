const axios = require("axios");

const webhookUrl = process.env.SLACK_WEBHOOK;

const messages = [
  "Keep your cameras on or be cursed with misplacing your house keys!",
  "Keep your cameras on or be cursed with losing half of all your sock pairs!",
  "Keep your cameras on or be cursed with getting Baby Shark stuck in your head!",
  "Keep your cameras on or be cursed with every banana you eat being slightly too green!",
  "Keep your cameras on or be cursed to always hit red lights when you're in a rush!",
  "Keep your cameras on or be cursed with one eye twitch every time someone says 'synergy'!",
  "Keep your cameras on or be cursed to always forget why you walked into a room!",
  "Keep your cameras on or be cursed with autocorrect changing every 'okay' to 'duck'!",
  "Keep your cameras on or be cursed to sneeze every time you try to unmute!",
  "Keep your cameras on or be cursed with a never-ending stream of spam calls about your car’s extended warranty!"
];

const message = messages[Math.floor(Math.random() * messages.length)];

axios.post(webhookUrl, { text: message })
  .then(() => console.log("Reminder sent!"))
  .catch((err) => console.error("Error sending message", err));
