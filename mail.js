const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: 'key-4f85e94f2770bb464e762eaf262b8827-fd0269a6-aa3549f5',
    domain: 'sandbox8b49f58786474d4b9a4a769d5180b085.mailgun.org'
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const mailOptions = {
  from: 'test@test.ie',
  to: 'dmitrovic.maja@gmail.com',
  name: 'test',
  phone: '00000000',
  text: 'testing this feature'
};

transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    console.log('An Error has happend.');
  } else {
    console.log('Message has been sent!');
  }
})
