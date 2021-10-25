import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

export const dniQR: BarcodeScannerOptions = {
  formats: 'PDF_417',
  showFlipCameraButton: true,
  prompt: 'Por favor, situa el código del DNI en el centro de la pantalla.',
  resultDisplayDuration: 0,
};

export const QR: BarcodeScannerOptions = {
  formats: 'QR_CODE',
  showFlipCameraButton: true,
  prompt: 'Por favor, situa el código QR en el centro de la pantalla.',
  resultDisplayDuration: 0,
};
