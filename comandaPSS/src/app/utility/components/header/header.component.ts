import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'utility-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() type: string = 'menu';
  @Input() route: string = '';
  @Input() title: string = '';
  @Input() cssClass: string = '';
  @Input() color: string = 'primary';

  constructor(private nav: NavController) {}

  ngOnInit() {}

  goto() {
    if (this.route !== '') return this.nav.navigateBack(this.route);
    this.nav.back();
  }
}
