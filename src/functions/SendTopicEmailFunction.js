// SendTopicEmailFunction.js

const { app } = require("@azure/functions");
const nodemailer = require("nodemailer");
require("dotenv").config();  // Load .env variables

// ── 1) Initialize Application Insights ──────────────────────────────────────
const appInsights = require("applicationinsights");
appInsights
  .setup()                                       // picks up APPINSIGHTS_CONNECTION_STRING or KEY from env
  .setAutoCollectRequests(true)                  // HTTP requests
  .setAutoCollectPerformance(true)               // CPU/memory
  .setAutoCollectExceptions(true)                // uncaught exceptions
  .setAutoCollectDependencies(true)              // outgoing HTTP/Service Bus/etc
  .setAutoCollectConsole(true)                   // console.log → traces
  .start();
const telemetryClient = appInsights.defaultClient;

// ── 2) Create a reusable Nodemailer transporter ─────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── 3) Hook up your Service Bus Topic trigger ───────────────────────────────
app.serviceBusTopic("SendTopicEmailFunction", {
  connection:          "AzureWebJobsServiceBus",     // must match your local.settings.json / App Setting
  topicName:           "notification-topic",
  subscriptionName:    "Notification-subscription",
  handler: async (message, context) => {
    // Track arrival of the message
    telemetryClient.trackEvent({
      name: "ServiceBusMessageReceived",
      properties: { payload: JSON.stringify(message) }
    });
    context.log.info("Service Bus message arrived:", message);

    // Destructure the email fields
    const { to, subject, body } = message;
    if (!to || !subject || !body) {
      const err = new Error("Missing one or more required email fields (to, subject, body)");
      context.log.error(err.message);
      telemetryClient.trackException({ exception: err });
      return;
    }

    // Prepare email
    const mailOptions = {
      from:    process.env.EMAIL_USER,
      to,
      subject,
      text:    body
    };

    // Send and measure timing
    const start = Date.now();
    try {
      context.log.info(`Sending email to ${to}…`);
      telemetryClient.trackEvent({ name: "EmailSendStart", properties: { to, subject } });

      await transporter.sendMail(mailOptions);

      const durationMs = Date.now() - start;
      context.log.info(`✅ Email sent to ${to} in ${durationMs}ms`);
      telemetryClient.trackEvent({
        name:       "EmailSendSuccess",
        properties: { to, subject, durationMs: durationMs.toString() }
      });
    } catch (error) {
      context.log.error(`❌ Failed to send email: ${error.message}`);
      telemetryClient.trackException({ exception: error });
    }
  }
});
