import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/cart.service';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  item: ProdutoDTO;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    this.produtoService.findById(this.navParams.get('item_id'))
      .subscribe(response => {
        this.item = response;
        this.getImageIfExists();
      },
      error => {});
  }

  getImageIfExists() {
    this.produtoService.getSmallImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.item.id}.jpg`;
      },
      error => {
        this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
      });
  }

  addProduto() {
    this.cartService.addProduto(this.item);
    this.navCtrl.push('CartPage');
  }
}
