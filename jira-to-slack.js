import fetch from "node-fetch";

const { JIRA_EMAIL, JIRA_API_TOKEN, SLACK_WEBHOOK } = process.env;

if (!JIRA_EMAIL || !JIRA_API_TOKEN || !SLACK_WEBHOOK) {
  throw new Error("Missing required environment variables.");
}

async function fetchReadyForGroomingIssues() {
  //   const jql = `created >= -30d AND project = "NU" AND cf[10021] = 2089 AND status != Closed ORDER BY cf[11321]`;
  const jql = `project = "NU" ORDER BY created DESC`;
  const url = `https://nuorder-inc.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&maxResults=10`;
  console.log(url);
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
      text: `• *<https://nuorder-inc.atlassian.net/browse/${issue.key}|${issue.key}>*: ${issue.fields.summary}`,
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

async function testJiraAuth() {
  const url = `https://nuorder-inc.atlassian.net/rest/api/3/myself`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
      ).toString("base64")}`,
      Accept: "application/json",
    },
  });

  const result = await response.text();
  console.log("🔐 Auth test result:", result);
}

async function main() {
  console.log(
    `Encoded Auth Header: Basic ${Buffer.from(
      `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
    ).toString("base64")}`
  );
  console.log(`Email length: ${JIRA_EMAIL.length}`);
  console.log(`Token length: ${JIRA_API_TOKEN.length}`);
  try {
    await testJiraAuth();
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
