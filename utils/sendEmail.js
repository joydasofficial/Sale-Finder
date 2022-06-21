const nodemailer = require("nodemailer");
var sgTransport = require('nodemailer-sendgrid-transport');

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport(sgTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
          }
    }))

    const email = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
    }

    transporter.sendMail(email, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
    })
}

module.exports = sendEmail;