import nodemailer from "nodemailer";
export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp += randVal;
  }
  return otp;
};

export const mailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

export const generateEmailTemplate = (code) => {
  return `
    <DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-compatible" content="IE=edge" >
    <style>
    @media only screen and (max-width:620px) {
        h1 {
            font-size:20px;
            padding:5px
        }
    }
    </style>

    </head>
    <body>
    <div>
<div style="max-width:620px; margin:0 auto; font-family:sans-serif; color:#272727;">
<h1 style="background:#f6f6f6; padding:10; text-align:center, color:#272727;"> 
we are delighted to welcome to out team !</h1>
<p> Please verify your email to contineue your verification code is: </p>
<p style="width:80px; margin:0 auto; font-weight:bold; text-align:center; color:#272727; font-size:25px; border-radius:6px;"> ${code} </p>

</div>
</div>
    </body>
    </html>
    `;
};

export const plainEmailTemplate = (heading, message) => {
  return `
    <DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-compatible" content="IE=edge" >
    <style>
    @media only screen and (max-width:620px) {
        h1 {
            font-size:20px;
            padding:5px
        }
    }
    </style>

    </head>
    <body>
    <div>
<div style="max-width:620px; margin:0 auto; font-family:sans-serif; color:#272727;">
<h1 style="background:#f6f6f6; padding:10; text-align:center, color:#272727;"> 
${heading}</h1>
<p style="color:#272727; text-align:center;"> ${message} </p>

</div>
</div>
    </body>
    </html>
    `;
};

export const generatePasswordResetTemplate = (url) => {
  return `
    <DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-compatible" content="IE=edge" >
    <style>
    @media only screen and (max-width:620px) {
        h1 {
            font-size:20px;
            padding:5px
        }
    }
    </style>

    </head>
    <body>
    <div>
<div style="max-width:620px; margin:0 auto; font-family:sans-serif; color:#272727;">
<h1 style="background:#f6f6f6; padding:10; text-align:center, color:#272727;"> 
Response to your Reset Password Request set !</h1>
<p style="color:#272727;"> Please link below to reset password: </p>
<div style=" text-align:center; "> 
<a href="${url}"  style="margin:0 auto; font-family:sans-serif; color:#fff; padding:10; text-align:center; background:#e63946; border-radius:5px;cursor:pointer; text-decoration:none;display:inline-block;"> Reset Password </a> </div>
</div>
</div>
    </body>
    </html>
    `;
};
