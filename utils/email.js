const { createTransport } = require('nodemailer');


const transporter = createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
})

const validateEmailTemplate = (user, validationCode) => {
  const email = user.email;
  const copyId = () => {
    navigator.clipboard.writeText(validationCode);
  }
  return {
    from: `Mail - <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: 'Verification Code',
    html: `
    <h2>Verification Code</h2>
    <p>Copy and paste this code under <strong>Verification Code</strong>.</p>
    <p>This code expires after 15 minutes.</p>
    <small>${validationCode}</small>
    <br />
    <p>Thanks,</p>
    <p>Capstone Creators</p>`,
  }
}

module.exports = {
  transporter,
  validateEmailTemplate,
}