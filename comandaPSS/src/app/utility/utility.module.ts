import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';
import { Camera } from '@ionic-native/camera/ngx';
import { SplashComponent } from './components/splash/splash.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  declarations: [SideMenuComponent, HeaderComponent, SplashComponent],
  imports: [CommonModule, IonicModule],
  exports: [SideMenuComponent, HeaderComponent, SplashComponent],
  providers: [Camera, SplashScreen, NativeAudio, Vibration, BarcodeScanner],
})
export class UtilityModule {}
