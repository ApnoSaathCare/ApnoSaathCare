export interface ConsultationEmailData {
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTimeWindow: string;
  consultationMethod?: string;
  supportRequirements?: string | null;
}

const methodNamesMap: Record<string, string> = {
  PHONE: 'Voice Phone Call',
  WHATSAPP_CALL: 'WhatsApp Voice Call',
  WHATSAPP_VIDEO: 'WhatsApp Video Call',
  GOOGLE_MEET: 'Google Meet',
};

export function renderConsultationEmailHtml(data: ConsultationEmailData): string {
  const methodLabel = methodNamesMap[data.consultationMethod || 'PHONE'] || data.consultationMethod || 'Voice Phone Call';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Request Received - AapnoSaath Care</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F7F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F4F7F6; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #1C5662 0%, #153F48 100%); padding: 32px 28px; text-align: center;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8BE0D0; margin-bottom: 6px;">
                AapnoSaath Care
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">
                Consultation Request Received
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #D1EAE5;">
                1-on-1 Elder Care Coordination Discussion
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              
              <!-- Greeting & Headline -->
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #E6F7F2; color: #0D9488; font-size: 24px; text-align: center; margin-bottom: 12px;">
                  &#10003;
                </div>
                <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #1C5662;">
                  Consultation Request Received!
                </h2>
                <p style="margin: 0; font-size: 15px; color: #4A5568; line-height: 1.5;">
                  Thank you, <strong>${data.fullName}</strong>. Your consultation request has been received. Our Vadodara team will review availability and confirm your scheduled slot.
                </p>
              </div>

              <!-- Reference Badge -->
              <div style="background-color: #F0F9F7; border: 2px dashed #1C5662; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #5F7377; margin-bottom: 4px;">
                  Your Consultation Reference
                </div>
                <div style="font-size: 26px; font-weight: 800; color: #1C5662; letter-spacing: 0.06em; font-family: monospace;">
                  ${data.referenceNumber}
                </div>
                <div style="font-size: 12px; color: #718096; margin-top: 6px;">
                  Please keep this reference code handy when discussing with our care coordinator.
                </div>
              </div>

              <!-- What Happens Next Section -->
              <div style="background-color: #FAFAFA; border: 1px solid #EAEAEA; border-radius: 12px; padding: 20px 22px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #2D3748; text-transform: uppercase; letter-spacing: 0.04em;">
                  What Happens Next:
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; color: #4A5568;">
                  <tr>
                    <td valign="top" style="padding: 6px 10px 6px 0; font-weight: 700; color: #1C5662; width: 20px;">1.</td>
                    <td style="padding: 6px 0;">Our coordinator reviews slot availability for your preferred date and window.</td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding: 6px 10px 6px 0; font-weight: 700; color: #1C5662; width: 20px;">2.</td>
                    <td style="padding: 6px 0;">We send a confirmation invitation via phone or WhatsApp.</td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding: 6px 10px 6px 0; font-weight: 700; color: #1C5662; width: 20px;">3.</td>
                    <td style="padding: 6px 0;">We discuss your parent's support plan on the call (15-20 mins, no obligation).</td>
                  </tr>
                </table>
              </div>

              <!-- Summary of Requested Consultation -->
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #2D3748; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
                Requested Consultation Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #718096; width: 40%; font-weight: 600;">Full Name:</td>
                  <td style="padding: 8px 0; color: #2D3748; font-weight: 600;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-weight: 600;">Contact Phone:</td>
                  <td style="padding: 8px 0; color: #2D3748;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-weight: 600;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #1C5662; font-weight: 700;">${data.preferredDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-weight: 600;">Preferred Window:</td>
                  <td style="padding: 8px 0; color: #2D3748;">${data.preferredTimeWindow}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-weight: 600;">Call Method:</td>
                  <td style="padding: 8px 0; color: #2D3748;">${methodLabel}</td>
                </tr>
                ${
                  data.supportRequirements
                    ? `<tr>
                  <td style="padding: 8px 0; color: #718096; font-weight: 600; vertical-align: top;">Requirements:</td>
                  <td style="padding: 8px 0; color: #4A5568; font-style: italic;">"${data.supportRequirements}"</td>
                </tr>`
                    : ''
                }
              </table>

              <!-- Vadodara Coordination Desk Info -->
              <div style="background-color: #F8FBFB; border-left: 4px solid #1C5662; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px; font-size: 13.5px;">
                <div style="font-weight: 700; color: #1C5662; margin-bottom: 4px;">Need Immediate Assistance?</div>
                <div><strong>Phone / WhatsApp:</strong> <a href="tel:+918780791723" style="color: #1C5662; text-decoration: none; font-weight: 600;">+91 8780791723</a></div>
                <div><strong>Email:</strong> <a href="mailto:enquiriesataapnosaathcare@gmail.com" style="color: #1C5662; text-decoration: none;">enquiriesataapnosaathcare@gmail.com</a></div>
                <div style="color: #718096; font-size: 12px; margin-top: 4px;">Desk Hours: Monday – Sunday, 9:00 AM – 7:00 PM IST (Vadodara, Gujarat)</div>
              </div>

              <!-- Scope & Care Boundaries Disclaimer -->
              <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #92400E; line-height: 1.5;">
                <strong>Care Boundaries Notice:</strong> AapnoSaath Care provides companion support, hospital appointment accompaniment, and daily living assistance for elderly parents in Vadodara. We do not provide clinical medical procedures, nursing care, or emergency ambulance rescue.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #EDF2F7; padding: 20px 28px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #E2E8F0;">
              <div>AapnoSaath Care &bull; Vadodara, Gujarat, India</div>
              <div style="margin-top: 4px;">You received this automated email because a consultation call was requested on our website with this email address.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderConsultationEmailText(data: ConsultationEmailData): string {
  const methodLabel = methodNamesMap[data.consultationMethod || 'PHONE'] || data.consultationMethod || 'Voice Phone Call';
  return `AAPNOSAATH CARE - CONSULTATION REQUEST RECEIVED
==================================================

Thank you, ${data.fullName}! Consultation Request Received!

Our Vadodara team will review availability and confirm your scheduled slot.

YOUR CONSULTATION REFERENCE: ${data.referenceNumber}
(Please save this reference code for all future communications)

WHAT HAPPENS NEXT:
1. Our coordinator reviews slot availability for your preferred date and window.
2. We send a confirmation invitation via phone or WhatsApp.
3. We discuss your parent's support plan on the call (15-20 mins).

REQUESTED SLOT DETAILS:
- Full Name: ${data.fullName}
- Contact Phone: ${data.phone}
- Preferred Date: ${data.preferredDate}
- Preferred Time Window: ${data.preferredTimeWindow}
- Consultation Method: ${methodLabel}
${data.supportRequirements ? `- Support Requirements: ${data.supportRequirements}\n` : ''}
NEED ASSISTANCE?
- Phone / WhatsApp: +91 8780791723
- Email: enquiriesataapnosaathcare@gmail.com
- Vadodara, Gujarat, India (Mon - Sun: 9:00 AM - 7:00 PM IST)

Care Boundaries Notice: AapnoSaath Care provides companion support, hospital appointment accompaniment, and daily living assistance. We do not provide clinical medical procedures, nursing care, or emergency ambulance rescue.
`;
}
