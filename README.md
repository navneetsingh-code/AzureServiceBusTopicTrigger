# Azure Service Bus Topic Trigger 📬 → 📧

This Azure Function App listens to a Service Bus Topic and automatically sends notification emails using Nodemailer and Gmail. It includes built-in telemetry and real-time monitoring using Azure Application Insights.

---

## 🎯 Purpose

- ✅ React to Service Bus topic messages in real-time
- 📬 Send emails via Gmail using Nodemailer
- 📈 Log telemetry, exceptions, and events to Azure Monitor (App Insights)
- ☁️ Auto-deploy from GitHub to Azure Functions

---

## ⚙️ Features

- 🟢 **Service Bus Topic Trigger** – Automatically fires on new messages
- 📧 **Email Sending** – Sends notifications using Nodemailer and Gmail App Password
- 🔐 **Secrets managed via environment variables** in Azure Function App
- 📊 **Integrated Telemetry** – Logs traces, metrics, and events to **App Insights**
- 🔁 **GitHub Auto Deployment** – Linked directly to Azure Function App, no pipeline needed

---

## 🗂 Folder Structure

AzureServiceBusTopicTrigger/
├── SendTopicEmailFunction.js # Main function handler
├── .env # Local dev environment file (not pushed to GitHub)
├── local.settings.json # Local runtime settings
├── host.json # Azure Functions host configuration
├── package.json # Node.js dependencies


---

## 🔐 Environment Variables

Configure these settings in your Azure Function App → Configuration blade:

```env
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...;IngestionEndpoint=...

AzureWebJobsServiceBus=<your-service-bus-connection-string>


🧪 Local Development 
To run locally:

Install dependencies:
npm install

Start the Azure Functions runtime:
func start

✉️ Function Behavior
Message Structure Expected from Service Bus:
{
  "to": "recipient@example.com",
  "subject": "Hello from Azure Bus",
  "body": "This message was triggered via Azure Service Bus"
}

Function Actions:
Logs the message received

Validates to, subject, and body

Sends the email using Gmail + Nodemailer

Logs success or failure to App Insights

On failure, throws error → message stays in DLQ or retries

🔁 Deployment Workflow
This project is directly connected to Azure Functions via GitHub

Any push or commit to main will automatically deploy the new version

Monitor deployments in Azure Portal → Function App → Deployment Center

📊 Application Insights
All telemetry (custom events, traces, exceptions) is logged to Azure Monitor:

Type	Example
Trace Logs	MongoDB connected, Email sent
Events	ServiceBusMessageReceived, EmailSendSuccess
Exceptions	Captured failures on send or parse

You can query all this from Azure Portal → Application Insights → Logs:
customEvents
| where timestamp > ago(1h)
| order by timestamp desc

🧠 Learn More
Azure Functions

Azure Service Bus

Nodemailer Docs

App Insights + KQL

🧑‍💻 Author
Developed by Navneet Singh
📫 singh.navneetinfo@gmail.com
🔗 GitHub: github.com/navneet-singh



