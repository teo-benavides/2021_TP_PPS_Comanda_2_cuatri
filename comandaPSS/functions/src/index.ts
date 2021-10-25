import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
const cors = require('cors')({ origin: true });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'comandappsutn@gmail.com',
    pass: 'cefbf792382ef87585dfe4246d6da355',
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const aceptacion = `
      <h1>Hola ${req.query.dest}<h1>
      <p>Queriamos informarle que su cuenta fue verificada y aceptada por nuestro establecimiento, esperamos verlo pronto en nuestro restaurant</p>
      <br>
      <p>Saludos, La comanda.</p>`;

    const rechazo = `
      <h1>Hola ${req.query.dest}<h1>
      <p>Queriamos informarle que su cuenta fue rechazada por nuestro establecimiento, esperamos que comprenda nuestra decisión</p>
      <br>
      <p>Saludos, La comanda.</p>
      `;

    const dest = req.query.dest as string;
    const subject = req.query.subject as string;
    const html = req.query.reject === 'true' ? rechazo : aceptacion;

    const mailOptions = {
      from: 'La Comanda <comandappsutn@gmail.com>',
      to: dest,
      subject,
      html,
    };

    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.send(false);
      }
      return res.send(true);
    });
  });
});
