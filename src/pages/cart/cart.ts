import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { ProdutoDTO } from '../../models/produto.dto';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let cart = this.cartService.getCart();
    this.items = cart.items;
  }

  aumentarQuantidade(item: ProdutoDTO) {
    this.items = this.cartService.addProduto(item).items;
  }

  diminuirQuantidade(item: ProdutoDTO) {
    this.items = this.cartService.diminuirQuantidade(item).items;
  }

  removeProduto(item: ProdutoDTO) {
    this.items = this.cartService.removeProduto(item).items;
  }

  getTotal(): number {
    return this.cartService.calcularTotal();
  }

  goOn() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    this.navCtrl.push('PickAddressPage');
  }
}
