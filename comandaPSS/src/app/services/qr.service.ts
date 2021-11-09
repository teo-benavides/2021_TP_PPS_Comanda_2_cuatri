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
}
