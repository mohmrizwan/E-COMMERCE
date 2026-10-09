import nodemailer from "nodemailer";
const sendOtp = async (email, otp) => {
  try {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.replace(/\s/g, "");

    if (!user || !pass) {
      console.error("Send OTP Error: EMAIL_USER or EMAIL_PASS is not configured");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },

      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    const mailOptions = {
      from: `"E-Commerce" <${user}>`,
      to: email,
      subject: "Email Verification OTP",

      html: `
        <div style="
          max-width: 500px;
          margin: auto;
          padding: 30px;
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">
          <h2 style="text-align: center;">
            E-Commerce Email Verification
          </h2>

          <p>Your OTP for account verification is:</p>

          <div style="
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`OTP sent successfully to ${email}`);

    return true;
  } catch (error) {
    // SMTP connection failures happen before authentication; never log auth data.
    console.error("Send OTP Error:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.code === "ETIMEDOUT"
        ? "SMTP connection timed out. Check whether the hosting provider allows outbound SMTP on port 465."
        : error.message,
    });

    return false;
  }
};

export default sendOtp;
