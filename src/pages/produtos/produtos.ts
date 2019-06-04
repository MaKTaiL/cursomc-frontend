import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  newList: ProdutoDTO[];
  page: number = 0;
  checkComplete: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.loadData();
    loader.dismiss();
  }

  loadData() {
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat(response["content"]);
        let end = this.items.length;
        this.getSmallImagesIfExists(start, end);
        this.getLargeImagesIfExists(start, end);
        if(response["last"] == true) {
          this.checkComplete = true;
        }
      },
      error => {});
  }

  getSmallImagesIfExists(start: number, end: number) {
    for(let i=start; i<end; i++) {
      this.produtoService.getSmallImageFromBucket(this.items[i].id)
        .subscribe(response => {
          this.items[i].smallImageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.items[i].id}-small.jpg`;
        },
        error => {
          this.items[i].smallImageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
        });
    }
  }

  getLargeImagesIfExists(start: number, end: number) {
    for(let i=start; i<end; i++) {
      this.produtoService.getLargeImageFromBucket(this.items[i].id)
        .subscribe(response => {
          this.items[i].largeImageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.items[i].id}.jpg`;
        },
        error => {
          this.items[i].largeImageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
        });
    }
  }

  showDetail(item: ProdutoDTO) {
    this.navCtrl.push('ProdutoDetailPage', {produto: item});
  }

  presentLoading() {
    let loader = this.loadCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.checkComplete = false;
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
