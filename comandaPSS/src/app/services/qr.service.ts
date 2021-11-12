import { Injectable } from '@angular/core';
import { QR } from '../utility/config/QR.types';
import { SystemService } from '../utility/services/system.service';
import { ErrorStrings } from '../models/enums/errorStrings';

/**
 * Para utilizar qr se tiene que llamar this.system.getQr(QR) y retornara BarcodeScanResult
 */

@Injectable({
  providedIn: 'root',
})
export class QrService {
  constructor(private system: SystemService) {}

  async ingresoQR(): Promise<boolean> {
    let flag = false;

    try {
      const scan = await this.system.getQr(QR);

      if (scan.cancelled) return flag;

      if (scan.text !== 'ingreso') throw new Error();

      flag = true;
    } catch (error) {
      this.system.presentToastError(ErrorStrings.EscanearIngreso);
    }

    return flag;
  }

  async scanAndCompare(value: string): Promise<boolean> {
    return this.system.getQr(QR)
    .then(scan => scan.text === value)
    .catch(() => false);
  }

  /**
   * 
   * @returns Porcentaje en float correspondiente al QR de propina escaneado, o -1 si el QR es inválido.
   */
  async scanPropina(): Promise<number> {
    return this.system.getQr(QR)
    .then(scan => {
      switch (scan.text) {
        case "propina-excelente":
          return 0.2;
        case "propina-muybueno":
          return 0.15;
        case "propina-bueno":
          return 0.1;
        case "propina-regular":
          return 0.05;
        case "propina-malo":
          return 0;
        default:
          return -1;
      }
    })
    .catch(() => -1);
  }
}
