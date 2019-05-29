import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

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
    this.getImagesIfExists();
  }
  
  getImagesIfExists() {
    for(let i=0; i<this.items.length; i++) {
      this.produtoService.getSmallImageFromBucket(this.items[i].produto.id)
        .subscribe(response => {
          this.items[i].produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.items[i].produto.id}-small.jpg`;
        },
        error => {
          this.items[i].produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
        });
    }
  }
}
