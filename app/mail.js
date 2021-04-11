var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'clotikriss@gmail.com',
    pass: 'Tutorama1'
  },
  tls: {
    rejectUnauthorized: false,
  },
});

var mailOptions = {
  from: 'clotikriss@gmail.com',
  to: 'kriss.clotilde@gmail.com',
  subject: 'Votre mot de passe provisoire est : ',
  text: '12345'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
