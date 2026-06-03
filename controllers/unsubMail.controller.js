const nodemailer = require('nodemailer')
const MailModel = require('../models/mail.model')
const path = require('path')

const sendUnsubMail = async (req, res) => {
    const { subject, message, contact, userName } = req.body;

    const mailData = new MailModel({ subject, message, contact, userName });

    console.log('NOREPLY_EMAIL_USER:', process.env.NOREPLY_EMAIL);
    console.log('NOREPLY_EMAIL_PASS:', process.env.NOREPLY_EMAIL ? '********' : 'MISSING');

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.NOREPLY_EMAIL_USER,
                pass: process.env.NOREPLY_EMAIL_PASS,
            },
            logger: true,
            debug: process.env.NODE_ENV === 'development'
                ? true 
                : false 
        });

        const mailOptions = {
            from: process.env.NOREPLY_EMAIL_USER,
            to: process.env.NOREPLY_EMAIL_USER,
            bcc: mailData.contact,
            subject: 'Unsubscribed Confirmation',
            html:
                `
                <body style="background-color: black; margin: 0; padding: 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: black; border-collapse: collapse; max-width: 1000px; margin: auto;">
                        <tr>
                            <td>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #3C3B6E;">
                                    <tr>
                                        <td style="padding: 10px; text-align: left;">
                                            <a href=${ process.env.SITE_LINK }>
                                            </a>
                                        </td>
                                        <td style="padding: 10px; text-align: right;">
                                            <p style="color: #DDDDE0; font-size: 1rem;">Visit <a href=${ process.env.SITE_LINK } style="text-decoration: underline; color: #DDDDE0;"> A.G. Reese & Associates</a></p>
                                            <p style="font-size: 0.65rem; text-align: end; color: #DDDDE0;">
                                                A.G. Reese & Associates
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #DDDDE0;">
                                    <tr>
                                        <td style="padding: 16px;">
                                            <div style="text-align: center;">
                                                <p style="font-size: 0.9rem; margin: 16px auto; width:80%; color: #3C3B6E; min-width: 280px;">Unsubscribe confirmation from: <br> A.G. Reese & Associates <br> This is an unmonitored mail box please do not reply</p>
                                                <h5 style="font-size: 1.3rem; margin: 8px 0 0 0; color: #3C3B6E;">Message received from:</h5>
                                                <p style="font-size: 1.1rem; margin: 0 0 16px 0; color: #3C3B6E;">${ mailData.userName }</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 16px;">
                                            <div style="text-align: center;">
                                                <h5 style="font-size: 1.3rem; margin: 8px 0 0 0; color: #3C3B6E;">Contact Email:</h5>
                                                <p style="font-size: 1.1rem; margin: 0 0 16px 0; color: #3C3B6E;">${ mailData.contact }</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 16px;">
                                            <div style="text-align: center;">
                                                <h5 style="font-size: 1.3rem; margin: 8px 0 0 0; color: #3C3B6E;">Subject:</h5>
                                                <p style="font-size: 1.1rem; margin: 0 0 16px 0; color: #3C3B6E;">${ mailData.subject }</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 16px;">
                                            <div style="text-align: center;">
                                                <h5 style="font-size: 1.3rem; margin: 8px 0 0 0; color: #3C3B6E;">Message:</h5>
                                                <p style="font-size: 1.1rem; margin: 0 auto 16px; max-width: 300px; color: #3C3B6E;">${ mailData.message }</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px;">
                                            <hr style="width: 95%; margin: 24px auto; border: 2px solid #AA2B34;">
                                            <h5 style="margin: 0; padding: 0 8px; color: #3C3B6E;">Don't miss out!</h5>
                                            <p style="font-size: .8rem ;margin: 8px auto; padding: 0 8px; width:95%; color: #3C3B6E;">To ensure our messages find their way into your inbox, make sure to add our mailing provider <a href="mailto:info@beedev-services.com=Request%20For%Support&body=Hello,%0A%0AI%20would%20like%20to%20support%20on...">beedev-services.com</a> and <a href="mailto:infor@agreese.com?subject=Request%20For%20Tax%20Services&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about...">info@agreese.com</a> to your mailing list. This way, we can keep the communications going without any interruptions!</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px;">
                                            <hr style="width: 95%; margin: 8px auto 24px; border: 2px solid #AA2B34;">
                                            <h5 style="margin: 0; padding: 0 8px; color: #3C3B6E;">Disclaimer:</h5>
                                            <p style="font-size: .8rem ;margin: 8px auto; padding: 0 8px; width:95%; color: #3C3B6E;">This email was intended for ${ mailData.userName } (${ mailData.contact }). If you are not the intended recipient of this email, please notify the sender immediately by replying to this message and delete this email from your inbox. Any unauthorized use, disclosure, or distribution of this email is prohibited. Thank you for your understanding.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                `,
        };

 // Send the email using Nodemailer
 await transporter.sendMail(mailOptions);
 console.log("200 - Email Sent Successfully")
 return res.status(200).json({ message: "Email Sent Successfully" })
} catch (error) {
 console.error("500 - Failed to Send Email", error)
 return res.status(500).json({ message: `Failed to send email: ${ error.message }` });
}
};

module.exports = { sendUnsubMail };