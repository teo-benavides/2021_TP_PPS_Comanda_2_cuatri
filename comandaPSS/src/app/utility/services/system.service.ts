import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { audioPath, audio } from '../AudioPath';
import { Vibration } from '@ionic-native/vibration/ngx';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
  BarcodeScanResult,
} from '@ionic-native/barcode-scanner/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';

declare var window: any;

/*
  Comandos utilizados:

  ionic cordova plugin add cordova-plugin-camera@5.0.1
  npm install @ionic-native/camera
  ionic cordova plugin add cordova-plugin-vibration
  npm install @ionic-native/vibration
  ionic cordova plugin add cordova-plugin-nativeaudio
  npm install @ionic-native/native-audio
  ionic cordova plugin add cordova-plugin-splashscreen
  npm install @ionic-native/splash-screen
  ionic cordova plugin add phonegap-plugin-barcodescanner
  npm install @ionic-native/barcode-scanner

  NOTA: Se tiene que llamar al metodo loadAudioAssets en
  el app.components.ts para cargar los path de los audio
  del AudioPath.ts
*/

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(
    public toastController: ToastController,
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private camera: Camera,
    private audio: NativeAudio,
    private vibration: Vibration,
    private barcodeScanner: BarcodeScanner,
    private base64: Base64
  ) {}

  async loadAudioAssets() {
    try {
      for (let i = 0; i < audio.length; i++) {
        await this.audio.preloadSimple(audio[i].name, audio[i].path);
      }
    } catch (error) {
      console.log('SystemServices - loadAudioAssets: ' + error);
    }
  }

  async playAudio(name: string) {
    await this.audio.play(name);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  //TODO: Crear enum de errores, modifiicar metodo presentToastError

  async presentToastError(message: string = '') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'warning',
    });
    this.vibration.vibrate([200, 200, 200]);
    toast.present();
  }

  async presentLoading(message: string) {
    return await this.loadingController.create({
      message,
      animated: false,
      spinner: null,
    });
  }

  createId(): string {
    return this.db.createId();
  }

  async getPicture() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetHeight: 340,
      targetWidth: 420,
    };
    let foto = {
      file: '',
      img: '',
    };
    try {
      foto.file = await this.camera.getPicture(options);

      foto.img = window.Ionic.WebView.convertFileSrc(foto.file);
    } catch (error) {
      console.log(error);
    } finally {
      return foto;
    }
  }

  async getQr(type?: BarcodeScannerOptions): Promise<BarcodeScanResult> {
    return this.barcodeScanner.scan(type);
  }

  async fileToBase64(path: string) {
    let b64 = await this.base64.encodeFile(path);
    b64 = b64.split('\n').join('');
    b64 = b64.split(';')[2];
    b64 = b64.split(',')[1];

    return b64;
  }
}
