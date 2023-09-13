import { createTransport } from "nodemailer";
import handlebars from "handlebars";
import { link, readFileSync } from "fs";
import { join } from "path";
import dotenv from 'dotenv';

dotenv.config({path:"/home/my/Desktop/forgotpassword/.env.example"})

const sendEmail = async (email, subject, link) => {
 
    // create reusable transporter object using the default SMTP transport
    const transporter = createTransport({
      service :'gmail',
      auth:{
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });
  // console.log({transporter})
    // const source = readFileSync(join(__dirname, template), "utf8");
    // const compiledTemplate =  await handlebars.compile(source);
    if(link)
    {
      const options = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
       html: `<h1>Your reset password link is <a href="http://${link}">Link</a><h1>`,
      
    };
    }
    else{

      const options = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
       html: `<h1>Your password is reseted<h1>`,
    }
console.log('mail')
    // Send email
   await transporter.sendMail(options,(err,data)=>{
      if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
  })
  } 
};
export default sendEmail;
