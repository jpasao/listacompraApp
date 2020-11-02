import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';

import { Product } from '../models/product.model';

import { ProductService } from 'src/app/services/product.service';
import { AuthorService } from 'src/app/services/author.service';
import { SseService } from 'src/app/services/sse.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    public products: Product[];
    public filteredProducts: Product[];
    public searchTerm: string;
    private ssePath = environment.apiEndPoint + 'sendevent.php';
    private authors: any[];
    private author: string;

    receiveMessage: EventListener;
    private sentEventSource: boolean;

    constructor(
        private router: Router,
        private productService: ProductService,
        private authorService: AuthorService,
        private sseService: SseService,
        private storage: Storage,
        private toastController: ToastController,
        private alertController: AlertController
    ) { }

    ngOnInit() {
        this.initialLoad();
        this.sentEventSource = false;
        this.loadAuthors();
        this.sendEventSource();
    }

    ionViewWillEnter() {
        this.initialLoad();
    }

    public initialLoad() {
        this.getProducts(null);
        this.searchTerm = '';       
    }

    public getProducts(event) {
        this.productService
            .getProducts()
            .subscribe(products => {
                this.products = products;
                this.filteredProducts = products;                
                event.target.complete();
            });
    }

    public checkProduct(product: Product) {
        var check = (product.checked) ? '0' : '1';
        this.productService
            .checkProduct(product.id, check)
            .subscribe(res => {
                this.getProducts(null);
                this.searchTerm = '';
            });
    }

    public filterList() {
        var filter = this.products.filter(element => element
            .name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()));
        this.filteredProducts = filter;
    }

    public editProduct(product: Product) {
        let navigationData: NavigationExtras = {
            state: {
                product: product
            }
        };
        this.router.navigate(['save-product'], navigationData);
    }

    loadAuthors(){
        // Check if already loaded
        if (this.authorService.authorList.length == 0){            
            this.authorService
                .getAuthors()
                .subscribe(authors => {
                    this.authors = authors;
                    this.setAuthor();
                });
        }
        else {
            this.authors = this.authorService.authorList;
            this.setAuthor();
        }
    }

    private sendEventSource() {
        if (this.sentEventSource == false) {
            var message: string;
            var operation: any;
            this.sseService
                .getServerSentEvent(this.ssePath)
                .subscribe(data => {
                    this.getProducts(null);
                    operation = JSON.parse(data.data);
                    // Don't show own message
                    if (operation.authorId != this.author){
                        message = this.composeMessage(operation);
                        this.presentToast(message);
                    }
                });
            this.sentEventSource = true;
        }
    }

    private composeMessage(operation): string {
        var res: string;
        
        var author = 'Alguien ';
        var product;
        var type;

        switch (operation.typeId) {
            case 0: type = 'desmarcó '; break;
            case 1: type = 'marcó '; break;
            case 2: type = 'añadió '; break;
            case 3: type = 'modificó '; break;
        }

        author = this.authors.find(a => a.authorId == operation.authorId).name + ' ';
        product = this.products.find(p => p.id == operation.productId);
        product = product?.name || 'algo nuevo';
        res = author + type + product.toLowerCase();
        return res;
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
    }

    private setAuthor(){
        this.storage.get('author').then((val) => {
            this.author = (val != null) ? val : "-1";
        });         
    }

    async changeNumber(product: Product) {
        const alert = await this.alertController.create({
            header: 'Cantidad',
            message: '¿Cuánto de ' + product.name + ' va a ser?',
            inputs:[
                {
                    name: 'quantityModal',
                    type: 'number'
                }
            ],
            buttons:[
                {
                    text: 'Volver',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Modificar',
                    handler: (modal) => {
                        this.productService
                            .updateProduct(product.id, product.name, modal.quantityModal)
                            .subscribe(() => {this.getProducts(null); });
                    }
                }
            ]
        });
        await alert.present();
    }
}
