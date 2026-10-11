# CampusConnect AI — Student Helpdesk

A modern, responsive university helpdesk web application featuring an embedded **n8n AI Chatbot** for college campuses.

Students can get instant guidance on:
- 💳 **Fees & Payments** (tuition schedules, late fees, installment options, receipt generation)
- 🏢 **Hostel & Mess** (allotment rules, mess rebate policies, night curfews, repair tickets)
- 🎓 **Leave & Academic Procedures** (medical leaves, 75% attendance rule, transcripts, course drop dates)
- 🪪 **Student ID Cards** (lost ID replacement, RFID library access, turnstile activation)
- 💻 **Wi-Fi & IT Support** (802.1X configuration, campus credentials, email recovery, lab licenses)

---

## 🚀 Live n8n Chatbot Integration

CampusConnect AI connects to your active n8n Student Query Helpdesk webhook:
```
https://kaustavkar7.app.n8n.cloud/webhook/72241871-55fd-4c9d-b85d-df8c595b2ec5/chat
```

### How the Integration Works
1. **Both Inline & Floating Experiences:**
   - **Dedicated Chat Section:** Available directly on the homepage (`#chat-section`) for students seeking deep guidance.
   - **Floating Quick Launcher:** Accessible in the bottom-right corner of every screen with unread state indicators.
2. **Interactive Help Cards:**
   - Clicking any of the 5 Help Category cards on the homepage automatically opens the chatbot, prefills a relevant inquiry, and begins the workflow.
3. **Session Persistence:**
   - Maintains a unique `sessionId` across user turns so that n8n memory nodes (Window Buffer Memory, Motorhead, or LangChain memory) preserve multi-turn context.
4. **Resilience & Proxy Fallback:**
   - Attempts direct client-side fetch first.
   - Automatically routes through the built-in `/api/chat-proxy` if browser CORS policies or tracking protection restrict cross-origin webhook calls.

---

## 🛠️ Step-by-Step n8n Setup Guide

### 1. Environment Variable Configuration
Configure your n8n webhook URL in `.env`:
```bash
VITE_N8N_CHAT_URL="https://kaustavkar7.app.n8n.cloud/webhook/72241871-55fd-4c9d-b85d-df8c595b2ec5/chat"
```

You can also inspect, update, or test this endpoint live at any time using the **n8n Workflow Integration Modal** (gear icon in the chat header or navigation bar).

---

### 2. Recommended n8n Workflow Node Architecture

Your n8n workflow should follow this flow:

```
[Chat Trigger / Webhook] ➔ [AI Agent / Chain] ➔ [Vector Store (Campus Docs)]
                                 │
                                 └── [Respond to Webhook]
```

#### A. Trigger Node (Chat Trigger or Webhook)
- **Node Type:** `n8n-nodes-base.chatTrigger` OR `n8n-nodes-base.webhook`
- **HTTP Method:** `POST`
- **Path:** `/72241871-55fd-4c9d-b85d-df8c595b2ec5/chat`
- **Incoming Payload Format:**
  The frontend sends the following JSON payload:
  ```json
  {
    "action": "sendMessage",
    "chatInput": "How do I pay my semester fees?",
    "sessionId": "campus-std-1718000000-abc123",
    "message": "How do I pay my semester fees?"
  }
  ```

#### B. AI Agent / Memory Configuration
- In n8n, connect a **Window Buffer Memory** node and set the `Session Key` to:
  ```
  {{ $json.body.sessionId }}
  ```
- Set the Prompt / Chat Input to:
  ```
  {{ $json.body.chatInput || $json.body.message }}
  ```

#### C. Response Node (Respond to Webhook)
- Configure the output response to return JSON:
  ```json
  {
    "output": "Tuition fees can be paid through the Student Accounts Portal by Sept 15.",
    "citations": [
      {
        "documentTitle": "Academic Fee Regulations 2025–26",
        "section": "Section 4.1"
      }
    ],
    "ticketId": "TKT-2025-4891"
  }
  ```
  *Note:* The frontend parser also automatically detects Markdown citations (e.g. `[Hostel Handbook §3]`) and Ticket IDs (e.g. `Ticket ID: TKT-1082`) in plain text!

#### D. Switch Workflow to "Active"
In n8n Cloud:
- Ensure the toggle in the upper-right corner is switched to **Active**.
- If the workflow is inactive, n8n webhook URLs return HTTP 404/500 for non-test triggers.

---

## 🧪 Testing the Integration

1. Start the application:
   ```bash
   npm run dev
   ```
2. Open the website at `http://localhost:3000`.
3. Click the **n8n Status** badge in the navbar or the settings gear in the chat header.
4. Click **Test Ping** to test network reachability and response latency.
5. Ask any query such as:
   - *"What are the hostel office hours?"*
   - *"How do I pay my semester fees?"*
   - *"My Wi-Fi is not connecting."*

---

## 🏛️ Features Included

- **Welcoming University Design:** Clean white aesthetic with soft blue (`#1d4ed8`), slate (`#0f172a`), and teal accents.
- **5 Interactive Help Categories:** Pre-populated with questions, office hours, and locations.
- **How It Works (3 Steps):** Clean visual explanation for student onboarding.
- **Safety & Transparency Notice:** Persistent disclaimer regarding AI guidance and official human office escalation.
- **Transcript Export:** One-click download of the student's conversation transcript.
- **Text-to-Speech:** Integrated audio listening option for accessibility.
- **Responsive:** Designed for mobile smartphones, tablets, and wide desktop displays.
