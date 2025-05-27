const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info@expodite.in',
    pass: 'uvka smmq jogm ozwe',
  },
});

app.post('/send-email', (req, res) => {
  const { firstName, phone, email, company, additionalInfo } = req.body;

  console.log(firstName)
  console.log(phone)
  console.log(email)
  console.log(company)
  console.log(additionalInfo)

  const mailOptions = {
    from: email,
    to: 'info@expodite.in',           // main recipient
    cc: ['m.janardhan@enterpi.com','b.bhargavreddy@enterpi.com'], // cc recipients
    subject: 'New Contact Form Submission',
    text:
      `First Name: ${firstName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Company Name: ${company}\n` +
      `Additional Information: ${additionalInfo || 'N/A'}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('success');
    }
  });
});



app.get("/email-redirect", (req, res) => {
  const ua = req.headers["user-agent"];
  const email = "bhargavreddyp948@gmail.com";
  const subject = "Inquiry";
  const body = "Hi, I'm interested in Expodite.";

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const isMobile = /android|iphone|ipad/i.test(ua);
  res.redirect(isMobile ? mailto : gmail);
});


app.get("/whatsapp-redirect", (req, res) => {
  const ua = req.headers["user-agent"];
  const phone = "918858857369";
  const message = encodeURIComponent("Hello! I'm interested in Expodite and would like to know how it can help automate my export documentation.");

  const appLink = `whatsapp://send?phone=${phone}&text=${message}`;
  const webLink = `https://wa.me/${phone}?text=${message}`;

  const isMobile = /android|iphone|ipad/i.test(ua);

  // On mobile devices → try to open app first, fallback in frontend using timeout
  // On desktop → always fallback to WhatsApp Web
  if (isMobile) {
    res.send(`
      <html>
        <head>
          <title>Redirecting to WhatsApp</title>
          <script>
            window.location = "${appLink}";
            setTimeout(() => {
              window.location = "${webLink}";
            }, 1500);
          </script>
        </head>
        <body>
          <p>Opening WhatsApp...</p>
        </body>
      </html>
    `);
  } else {
    res.redirect(webLink);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

 