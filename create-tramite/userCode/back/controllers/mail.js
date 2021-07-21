const nodemailer = require('nodemailer');

const smtpConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.DEV == 'true' ? process.env.EMAIL_PRUEBAS : process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: false,
    debug: false
};

var sendEmailHelper = async function (from, to, subject, text, filesname, filesContentBuffer) {
    try {
        let config = {
            from: process.env.DEV == 'true' ? process.env.EMAIL_PRUEBAS : process.env.EMAIL_SENDER,
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        }
        //solo cuando hay algo para enviar se envia
        if (filesContentBuffer.length > 0 && filesname.length > 0) {
            config.attachments = [];
            for (let i = 0; i < filesContentBuffer.length; i++) {
                config.attachments.push({
                    filename: filesname[i],
                    content: filesContentBuffer[i]
                })
            }
        }
        let transporter = nodemailer.createTransport(smtpConfig)
        let info = await transporter.sendMail(config);
        return info

    } catch (error) {
        throw error;
    }
}

exports.sendEmail = async function (from, to, contenido, textoAdicional, estadoNuevoText, filesContentBuffer, session, nombreTramite) {
    let subject = 'Solicitud de '+nombreTramite+'. Estado actual: '+estadoNuevoText+'. Alumno: '+session.user.givenname+' '+ session.user.sn+'';
    //let subject = 'Solicitud de '+nombreTramite+'. Estado actual: ${estadoNuevoText}. Alumno: ${session.user.givenname} ${session.user.sn}'
     try {
        let filesname = [];
        let text = "";
        text = textoAdicional === null ? contenido : contenido +'\n Motivo:'+ textoAdicional;
        let info = await sendEmailHelper(from, to, subject, text, filesname, filesContentBuffer)
        return info
    } catch (error) {
        throw error;
    }
}


