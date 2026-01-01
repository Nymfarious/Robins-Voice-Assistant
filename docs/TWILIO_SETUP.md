# Twilio Setup for Robin's Voice

## Your Account Info
- **Phone Number:** +1 (425) 464-4974
- **Region:** US1 (Active)
- **Balance:** $20 (auto-top)

## Quick Setup

### Step 1: Create a TwiML Bin

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to: **Develop** → **TwiML Bins**
3. Click **Create new TwiML Bin**
4. Name it: `RobinsVoice_Welcome`
5. Paste this TwiML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hello! This is Robin's Voice Assistant. 
    Robin will be with you in just a moment. 
    Please hold.
  </Say>
  <Pause length="60"/>
  <Say voice="Polly.Joanna">
    Thank you for waiting. Please continue to hold.
  </Say>
  <Pause length="60"/>
</Response>
```

6. Click **Create**
7. Copy the TwiML Bin URL (looks like: `https://handler.twilio.com/twiml/EHxxxx...`)

### Step 2: Update Phone Number Webhook

1. Go to: **Phone Numbers** → **Manage** → **Active Numbers**
2. Click on your number: +1 (425) 464-4974
3. In **Voice Configuration**:
   - **A call comes in:** Webhook
   - **URL:** Paste your TwiML Bin URL
   - **HTTP:** POST
4. Click **Save Configuration**

### Step 3: Test It!

Call your Twilio number from any phone. You should hear:
> "Hello! This is Robin's Voice Assistant. Robin will be with you in just a moment. Please hold."

---

## Cost Reference

| Action | Cost | Per $20 |
|--------|------|---------|
| Incoming call | ~$0.0085/min | ~39 hours |
| Outgoing call | ~$0.014/min | ~24 hours |
| Phone number | ~$1.15/month | Monthly |
| Recording | ~$0.0025/min | If enabled |

---

## Advanced: Browser-Based Calling (Phase 2)

For Robin to make/receive calls directly in the app, we need:

1. **Twilio Client JavaScript SDK** - WebRTC for browser calls
2. **Access Token Server** - Generates tokens for the browser
3. **Voice Webhooks** - Handles call routing

### Files Needed:
- `twilio-client.js` - Browser SDK
- Edge Function for tokens (Supabase or Twilio Functions)

This will be implemented in v2.0.

---

## Emergency: If Something Breaks

1. Check Twilio Console → **Monitor** → **Logs** → **Calls**
2. Look for error messages
3. Common issues:
   - **Webhook not reachable** - Check URL is correct
   - **TwiML syntax error** - Validate XML
   - **Account suspended** - Check billing

---

## Notes

- Calls to emergency services (911) require valid E911 address (already registered)
- Recording requires disclosure to caller
- SMS/MMS available but not configured yet
