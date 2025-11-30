const nodemailer = require('nodemailer');

async function main() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nainjuarez8@gmail.com',
            pass: 'fvnoncxzibgzdrdt'
        }
    });

    try {
        const info = await transporter.sendMail({
            from: 'nainjuarez8@gmail.com',
            to: 'nainjuarez8@gmail.com', // Sending to self for testing
            subject: 'Test Email from Mind Devs Debugger',
            text: 'If you see this, nodemailer is working correctly!',
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

main();
