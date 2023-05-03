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
  return {
    from: `Mail - <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: 'Validation Code',
    html: `
    <h2>Validation Code</h2>
    <p>Copy this code and paste in email validation field. This code expires in 1 hr.</p>
    <br />
    <br />
    <small>${validationCode}</small>
    <br />
    <br />
    <p>Thanks,</p>
    <p>capstone-tabletop-server</p>`,
  }
}

module.exports = {
  transporter,
  validateEmailTemplate,
}