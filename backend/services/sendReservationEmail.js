const nodemailer = require('nodemailer');

const sendReservationEmail = async (reservationData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sgurlekian@gmail.com',
      pass: 'scgo zwwd cegx jzpn',
    },
  });

  const mailOptions = {
    from: 'sgurlekian@gmail.com',
    to: reservationData.email,
    subject: 'Confirmación de reserva',
    text: `
      Hola ${reservationData.fullName},

      Tu reserva ha sido realizada exitosamente en ${reservationData.spaceName}.

      Detalles de la reserva:
      - Fecha: ${reservationData.date}
      - Hora de inicio: ${reservationData.startTime}
      - Hora de fin: ${reservationData.endTime}
      - Número de lugares: ${reservationData.numberOfPlaces}
      - Notas adicionales: ${reservationData.additionalNotes}

      ¡Gracias por elegirnos!

      Saludos,
      El equipo de Nomad
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error al enviar el correo de reserva:', error);
  }
};

module.exports = sendReservationEmail;
