import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
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
    console.log("Send OTP Error:", error);
    return false;
  }
};

export default sendOtp;