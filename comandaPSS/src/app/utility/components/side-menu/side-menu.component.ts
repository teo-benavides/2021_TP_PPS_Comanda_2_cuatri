import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../login/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'utility-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Input() routes: any[] = [];
  @Input() color: string = '';
  constructor(public auth: AuthService, private nav: NavController) {}

  ngOnInit() {}

  goto(route: string) {
    this.nav.navigateForward(route);
  }
}
