import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { Cart } from "../models/cart";
import { ProdutoDTO } from "../models/produto.dto";

@Injectable()
export class CartService {

    constructor(public storageService: StorageService) {
    }

    createOrCleanCart(): Cart {
        let cart: Cart = {items: []};
        this.storageService.setCart(cart);
        return cart;
    }

    getCart(): Cart {
        let cart: Cart = this.storageService.getCart();
        if(cart == null) {
            cart = this.createOrCleanCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position == -1) {
            cart.items.push({quantidade: 1, produto: produto});
        }
        else {
            cart.items[position].quantidade++;
        }
        this.storageService.setCart(cart);
        return cart;
    }

    removeProduto(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1) {
            cart.items.splice(position, 1);
        }
        this.storageService.setCart(cart);
        return cart;
    }

    diminuirQuantidade(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1) {
            if(cart.items[position].quantidade == 1) {
                cart = this.removeProduto(cart.items[position].produto);
            }
            else {
                cart.items[position].quantidade--;
            }
        }
        this.storageService.setCart(cart);
        return cart;
    }

    calcularTotal(): number {
        let cart = this.getCart();
        let total = 0;
        for(let i=0; i<cart.items.length; i++) {
            total += cart.items[i].quantidade * cart.items[i].produto.preco;
        }
        return total;
    }
}