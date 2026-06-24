const cloudinaryService = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const { generateRandomString } = require("../../utilities/helper");
const emailService = require("../../services/mailer.service");
const {AppConfig} = require("../../config/app.config");

class AuthService {
  async tranformForUser(req) {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 12);
      if(req.file) {
        data.image = await cloudinaryService.singleFileUpload(req.file.path, "/users");
      }
      
      // Token creation
      data.token = generateRandomString();
      data.expiryTime = Date.now() + 86400000;

      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async sendAccountActivationNotificationEmail(user) {
    try {
      return await emailService.sendEmail({
        to: user.email,
        subject: "Activate Your Account",
        message: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Activate Your Account</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e6df;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#185FA5;padding:32px 32px 24px;text-align:center;">
                      <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.15);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="white" stroke-width="1.5" fill="none"/>
                          <path d="M2 6L12 13L22 6" stroke="white" stroke-width="1.5" fill="none"/>
                        </svg>
                      </div>
                      <p style="color:#ffffff;font-size:20px;font-weight:600;margin:0;">Activate your account</p>
                      <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">One step left to get started</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <p style="font-size:15px;color:#3d3d3a;margin:0 0 8px;">
                        Hi <strong>${user.name || "there"}</strong>,
                      </p>
                      <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 24px;">
                        Thank you for signing up. To complete your registration and start using your account,
                        please verify your email address by clicking the button below.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:8px 0 24px;">
                            <a href="${AppConfig.feUrl}/activate/${user.token}"
                               style="display:inline-block;background:#185FA5;color:#ffffff;text-decoration:none;
                                      padding:12px 32px;border-radius:8px;font-size:15px;font-weight:500;">
                              Activate my account
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiry note -->
                      <p style="font-size:13px;color:#888780;line-height:1.6;margin:0;">
                        This link will expire in <strong style="color:#5f5e5a;">24 hours</strong>.
                        If you did not create an account, you can safely ignore this email.
                      </p>

                      <!-- Fallback link -->
                      <div style="border-top:1px solid #e8e6df;margin-top:24px;padding-top:16px;">
                        <p style="font-size:12px;color:#b4b2a9;margin:0 0 4px;">Having trouble with the button?</p>
                        <p style="font-size:12px;color:#888780;margin:0;word-break:break-all;">
                          Copy and paste this link:<br/>
                          <a href="${AppConfig.feUrl}/activate/${user.token}" style="color:#185FA5;">
                            ${AppConfig.feUrl}/activate/${user.token}
                          </a>
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9f8f5;padding:16px 32px;border-top:1px solid #e8e6df;text-align:center;">
                      <p style="font-size:12px;color:#b4b2a9;margin:0;">
                        © ${new Date().getFullYear()} YourApp Inc. &nbsp;·&nbsp;
                        <a href="#" style="color:#888780;text-decoration:none;">Unsubscribe</a> &nbsp;·&nbsp;
                        <a href="#" style="color:#888780;text-decoration:none;">Privacy policy</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
      });
    } catch (exception) {
      throw exception;
    }
  }

  async resendAccountActivationNotificationEmail(user) {
    try {
      return await emailService.sendEmail({
        to: user.email,
        subject: "Resend: Activate Your Account",
        message: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Resend Account Activation</title>
        </head>
        <body style="margin:0;padding:0;background-color:#EEEDFE;font-family:Georgia,serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEEDFE;padding:48px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #CECBF6;">

                  <!-- Top accent bar -->
                  <tr>
                    <td style="background:#534AB7;height:5px;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 40px 24px;text-align:center;background:#ffffff;">
                      <div style="width:64px;height:64px;border-radius:50%;background:#EEEDFE;border:2px solid #CECBF6;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 12C3 7.03 7.03 3 12 3C15.1 3 17.9 4.6 19.6 7" stroke="#534AB7" stroke-width="2" stroke-linecap="round"/>
                          <path d="M21 12C21 16.97 16.97 21 12 21C8.9 21 6.1 19.4 4.4 17" stroke="#534AB7" stroke-width="2" stroke-linecap="round"/>
                          <path d="M19.6 3L19.6 7L15.6 7" stroke="#534AB7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M4.4 21L4.4 17L8.4 17" stroke="#534AB7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <p style="color:#26215C;font-size:22px;font-weight:700;margin:0 0 6px;letter-spacing:-0.3px;">We resent your activation link</p>
                      <p style="color:#7F77DD;font-size:13px;margin:0;">Here's a fresh link — your previous one may have expired</p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding:0 40px;">
                      <div style="border-top:1px solid #EEEDFE;"></div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:28px 40px 0;">
                      <p style="font-size:15px;color:#26215C;margin:0 0 10px;">
                        Hey <strong>${user.name || "there"}</strong>,
                      </p>
                      <p style="font-size:14px;color:#3C3489;line-height:1.8;margin:0 0 28px;">
                        You requested a new activation link for your account. Your previous link may have expired or already been used. Click the button below to verify your email and activate your account.
                      </p>

                      <!-- Notice banner -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td style="background:#EEEDFE;border-left:3px solid #534AB7;border-radius:6px;padding:12px 16px;">
                            <p style="font-size:13px;color:#3C3489;margin:0;line-height:1.6;">
                              <strong>Note:</strong> If you did not request this email, someone may have entered your address by mistake. No action is needed on your part.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:0 0 28px;">
                            <a href="${AppConfig.feUrl}/activate/${user.token}"
                               style="display:inline-block;background:#534AB7;color:#ffffff;text-decoration:none;
                                      padding:14px 40px;border-radius:8px;font-size:15px;font-weight:600;
                                      letter-spacing:0.2px;">
                              &#10003;&nbsp; Activate my account
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiry badge -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td align="center">
                            <span style="display:inline-block;background:#EEEDFE;color:#534AB7;font-size:12px;
                                         font-weight:600;padding:6px 16px;border-radius:20px;border:1px solid #CECBF6;">
                              &#9719;&nbsp; Link expires in 24 hours
                            </span>
                          </td>
                        </tr>
                      </table>

                      <!-- Fallback link -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:#f9f8ff;border-radius:8px;padding:14px 16px;border:1px solid #EEEDFE;">
                            <p style="font-size:11px;color:#7F77DD;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Button not working?</p>
                            <p style="font-size:12px;color:#534AB7;margin:0;word-break:break-all;line-height:1.6;">
                              <a href="${AppConfig.feUrl}/activate/${user.token}" style="color:#534AB7;text-decoration:underline;">
                                ${AppConfig.feUrl}/activate/${user.token}
                              </a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:32px 40px 28px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-top:1px solid #EEEDFE;padding-top:24px;text-align:center;">
                            <p style="font-size:11px;color:#AFA9EC;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">
                              YourApp Inc.
                            </p>
                            <p style="font-size:11px;color:#AFA9EC;margin:0;">
                              © ${new Date().getFullYear()} &nbsp;·&nbsp;
                              <a href="#" style="color:#7F77DD;text-decoration:none;">Unsubscribe</a>
                              &nbsp;·&nbsp;
                              <a href="#" style="color:#7F77DD;text-decoration:none;">Privacy policy</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Bottom accent bar -->
                  <tr>
                    <td style="background:#534AB7;height:5px;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
      });
    } catch (exception) {
      throw exception;
    }
  }
  
}

const authService = new AuthService();
module.exports = authService;