import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() type: string = 'menu';
  @Input() route: string = '';
  @Input() title: string = '';
  @Input() cssClass: string = '';

  constructor(private nav: NavController) {}

  ngOnInit() {}

  goto() {
    if (this.route !== '') return this.nav.navigateRoot(this.route);
    this.nav.back();
  }
}
