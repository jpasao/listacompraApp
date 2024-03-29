import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from '../../services/product.service';
import { AlertController } from '@ionic/angular';
import { threadId } from 'worker_threads';

// import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
//   CameraPhoto, CameraSource } from '@capacitor/core';

@Component({
    selector: 'app-save-product',
    templateUrl: './save-product.page.html',
    styleUrls: ['./save-product.page.scss'],
})
export class SaveProductPage implements OnInit {

    data: Product;
    isEdit: boolean;
    operation: string;
    name: string;
    quantity: number;
    saveLabel: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private alertController: AlertController) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.data = this.router.getCurrentNavigation().extras.state.product;
            }
        });
    }

    ngOnInit() {
        this.loadProduct();
    }

    backToMain() {
        this.resetForm();
        this.router.navigate(['/home'], { relativeTo: this.route });
    }

    loadProduct() {
        this.isEdit = this.data != null && this.data.id > 0;
        this.name = (this.isEdit) ? this.data.name : '';
        this.quantity = this.data.quantity;
        if (this.isEdit) {
            this.operation = 'Edición ';
            this.saveLabel = '¿Cómo le vas a poner?'
        }
        else {
            this.operation = 'Nuevo ';
            this.saveLabel = '¿Qué hace falta?';
        }
    }

    // public async addPhoto(){
    //   const { Camera, Filesystem, Storage } = Plugins;
    //   const capture = await Camera.getPhoto({
    //     resultType: CameraResultType.Uri,
    //     source: CameraSource.Camera,
    //     quality: 100
    //   });
    // }

    saveProduct() {
        if (this.isEdit) {
            this.productService.updateProduct(this.data.id, this.name, this.quantity)
                .subscribe(res => {
                    this.resetForm();
                    this.backToMain();
                });
        }
        else {
            // Check first if already created
            if (this.checkExistingProduct() == false) {
                this.productService.createProduct(this.name, this.quantity)
                    .subscribe(res => { this.backToMain(); });
            }
        }
    }

    resetForm() {
        this.data = null;
        this.name = null;
        this.quantity = null;
    }

    private checkExistingProduct(): boolean {
        // Get Products
        let coincidence: boolean;
        let found: Product;

        found = this.productService
            .getProductList()
            .find(product => product
                .name
                .toLowerCase()
                .includes(this.name.toLowerCase()));

        coincidence = found != null;

        if (coincidence) {
            this.askForSaving(found.name);
        }

        return coincidence;
    }

    async askForSaving(foundName: string) {
        const alert = await this.alertController.create({
            header: 'Un momento...',
            message: 'Parece que ya hay guardado ' + foundName + '. ¿Seguimos adelante guardando ' + this.name + '?',
            buttons: [
                {
                    text: 'Lo modifico',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Sí, es otra cosa',
                    handler: () => {
                        this.productService.createProduct(this.name, this.quantity)
                            .subscribe(() => { this.backToMain(); });
                    }
                }
            ]
        });
        await alert.present();
    }
}