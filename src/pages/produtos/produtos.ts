import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        this.items = response['content'];
        this.getImagesIfExists();
      },
      error => {});
  }

  getImagesIfExists() {
    for(let i=0; i<this.items.length; i++) {
      this.produtoService.getSmallImageFromBucket(this.items[i].id)
        .subscribe(response => {
          this.items[i].imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.items[i].id}-small.jpg`;
        },
        error => {
          this.items[i].imageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
        });
    }
  }

  showDetail() {
    this.navCtrl.push('ProdutoDetailPage');
  }
}
