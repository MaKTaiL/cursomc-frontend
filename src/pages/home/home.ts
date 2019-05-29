import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credenciais: CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    public cart: CartService) {
  }

  login() {
    this.auth.authenticate(this.credenciais)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.cart.createOrCleanCart();
        this.navCtrl.setRoot("CategoriasPage");
      },
      error => {});
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
    
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot("CategoriasPage");
      },
      error => {});
  }
}
