const SPREADSHEET_ID = '16PFZVq0_Aj69YDGhzXwR3_1zqVltJoNi-tsH_5o8u84';
const SHEET_NAME = 'Confirmaciones Baby Shower';
const NOTIFICATION_EMAIL = 'confirmacionesbabyshowerzoe@gmail.com';
const HEADERS = ['Nombre', 'Apellido', 'Asistencia', 'Mensaje', 'Fecha de confirmación'];

function doPost(event) {
  let saved = false;

  try {
    const values = event && event.parameter ? event.parameter : {};
    const firstName = requiredText(values.firstName, 80, 'nombre');
    const lastName = requiredText(values.lastName, 100, 'apellido');
    const attendance = values.attendance;

    if (attendance !== 'si' && attendance !== 'no') {
      throw new Error('La asistencia no es válida.');
    }

    const message = String(values.message || '').trim().slice(0, 1000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);

    const attendanceLabel = attendance === 'si' ? 'Sí, asistirá' : 'No asistirá';
    const confirmedAt = Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM/yyyy HH:mm:ss');
    const safeFirstName = safeSheetValue(firstName);
    const safeLastName = safeSheetValue(lastName);
    const safeMessage = safeSheetValue(message);

    sheet.appendRow([safeFirstName, safeLastName, attendanceLabel, safeMessage, confirmedAt]);
    saved = true;

    const emailBody = [
      'Nueva confirmación para el Baby Shower de Zoe',
      '',
      `Nombre: ${firstName}`,
      `Apellido: ${lastName}`,
      `Asistencia: ${attendanceLabel}`,
      `Mensaje: ${message || '(sin mensaje)'}`,
      `Fecha: ${confirmedAt} (hora Colombia)`
    ].join('\n');

    MailApp.sendEmail(NOTIFICATION_EMAIL, 'Nueva confirmación - Baby Shower de Zoe', emailBody);
    return responsePage(true, '¡Confirmación enviada! Muchas gracias.');
  } catch (error) {
    console.error(error);
    const detail = saved
      ? 'Tu respuesta quedó guardada en la hoja, pero no se pudo enviar el aviso por correo. Por favor, avísales directamente.'
      : 'No se pudo guardar tu respuesta. Inténtalo nuevamente o avísales directamente.';
    return responsePage(false, detail);
  }
}

function requiredText(value, maxLength, fieldName) {
  const text = String(value || '').trim();
  if (!text || text.length > maxLength) {
    throw new Error(`El campo ${fieldName} no es válido.`);
  }
  return text;
}

function safeSheetValue(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some((header, index) => existingHeaders[index] !== header)) {
    throw new Error(`La primera fila de la pestaña "${SHEET_NAME}" no tiene los encabezados esperados.`);
  }
}

function responsePage(success, message) {
  const title = success ? 'Confirmación recibida' : 'No se pudo completar';
  const color = success ? '#5c4033' : '#9b2c45';
  const escapedMessage = message.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  return HtmlService.createHtmlOutput(
    `<main style="font-family:Arial,sans-serif;max-width:480px;margin:12vh auto;padding:32px;text-align:center;color:#5c4033;background:#fffdf9;border:1px solid #f4acb7;border-radius:20px"><h1 style="color:${color}">${title}</h1><p>${escapedMessage}</p><p>Ya puedes cerrar esta pestaña y volver a la invitación.</p></main>`
  ).setTitle(title);
}
