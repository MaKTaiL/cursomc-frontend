import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: CategoriaDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.loadData();
    loader.dismiss();
  }

  loadData() {
    this.categoriaService.findAll()
      .subscribe(response => {
        this.items = response;
        this.getImagesIfExists();
      },
      error => {});
  }

  getImagesIfExists() {
    for(let i=0; i<this.items.length; i++) {
      this.categoriaService.getImageFromBucket(this.items[i].id)
        .subscribe(response => {
          this.items[i].imageUrl = `${API_CONFIG.bucketBaseUrl}/cat${this.items[i].id}.jpg`;
        },
        error => {
          this.items[i].imageUrl = `${API_CONFIG.bucketBaseUrl}/prod.jpg`;
        });
    }
  }

  showProdutos(id: string) {
    this.navCtrl.push('ProdutosPage', {categoria_id: id});
  }

  presentLoading() {
    let loader = this.loadCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
