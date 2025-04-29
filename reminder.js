import axios from 'axios';

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
  "Keep your cameras on or be cursed with a never-ending stream of spam calls about your car’s extended warranty!",
  "Keep your cameras on or be cursed to bite into soup that's way too hot — every time!",
  "Keep your cameras on or be cursed with toast that’s *almost* too burnt to eat — forever!",
  "Keep your cameras on or be cursed to always grab the leaky pen in the drawer!",
  "Keep your cameras on or be cursed to spill just a little coffee on your shirt before meetings!",
  "Keep your cameras on or be cursed with mildly itchy socks (but only on one foot)!",
  "Keep your cameras on or be cursed to always sit on the remote right when you're comfy!",
  "Keep your cameras on or be cursed with infinite slow walkers in front of you on sidewalks!",
  "Keep your cameras on or be cursed to always forget your reusable bag at the grocery store!",
  "Keep your cameras on or be cursed with cling wrap that *never* tears evenly!",
  "Keep your cameras on or be cursed to always get stuck behind someone ordering for 12 at a coffee shop!"
];

const message = messages[Math.floor(Math.random() * messages.length)];

try {
  await axios.post(webhookUrl, {
    text: `Hey team, today's benign threat is: ${message}`,
    username: "Benign Threat Bot",
    icon_url: "https://i.imgur.com/XEyEkxa.png"
  });
  console.log("Reminder sent!");
} catch (err) {
  console.error("Error sending message", err);
}
