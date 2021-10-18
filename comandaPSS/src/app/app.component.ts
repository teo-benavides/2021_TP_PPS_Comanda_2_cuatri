import { Component, ElementRef, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './login/services/auth.service';
import { SystemService } from './utility/services/system.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  routerHidden = true;
  @ViewChild('splash', { static: false }) splash: ElementRef;

  constructor(
    private storage: Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private auth: AuthService,
    private system: SystemService
  ) {}
  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    await this.storage.create();
    await this.platform.ready();
    this.splashScreen.hide();
    await this.system.loadAudioAssets();

    setTimeout(() => {
      this.routerHidden = false;
    }, 4000);
  }
}
