import fetch from "node-fetch";

const { JIRA_EMAIL, JIRA_API_TOKEN, SLACK_WEBHOOK, JIRA_PROJECT, JIRA_DOMAIN } =
  process.env;

if (
  !JIRA_EMAIL ||
  !JIRA_API_TOKEN ||
  !SLACK_WEBHOOK ||
  !JIRA_PROJECT ||
  !JIRA_DOMAIN
) {
  throw new Error("Missing required environment variables.");
}

// created >= -30d AND project = NU AND sprint = 2089 ORDER BY created DESC

async function fetchReadyForGroomingIssues() {
  const jql = `created >= -30d AND project = NU AND sprint = 2089 AND status != Closed ORDER BY Rank`;
  const url = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&maxResults=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
      ).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jira API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.issues || [];
}

async function sendToSlack(issues) {
  const blocks = issues.map((issue) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `• *<https://${JIRA_DOMAIN}/browse/${issue.key}|${issue.key}>*: ${issue.fields.summary}`,
    },
  }));

  const message = {
    text: "🧹 *Top 10 Ready for Grooming Jira Tickets*",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Here are the top tickets ready for grooming:*",
        },
      },
      ...blocks,
    ],
  };

  const slackRes = await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!slackRes.ok) {
    const errorText = await slackRes.text();
    throw new Error(`Slack webhook error: ${slackRes.status} ${errorText}`);
  }
}

async function main() {
  try {
    const issues = await fetchReadyForGroomingIssues();
    if (issues.length === 0) {
      console.log("No issues found.");
      return;
    }

    await sendToSlack(issues);
    console.log("✅ Slack message sent!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
