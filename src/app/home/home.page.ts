import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { NavigationExtras, Router } from '@angular/router';
import { SseService } from '../services/sse.service';
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

  @ViewChild('iframe') iframe: ElementRef;
  receiveMessage: EventListener;
  private sentEventSource: boolean;

  constructor(
    private productService: ProductService,
    private router: Router,
    private sseService: SseService
    ) {}

  ngOnInit(){
    this.initialLoad();   
    this.sentEventSource = false;
    this.sendEventSource();
  }

  ionViewWillEnter() {
    this.initialLoad();
  }

  public initialLoad(){
    this.getProducts(null);
    this.searchTerm = '';   
  }

  public getProducts(event){
    this.productService
      .getProducts()
      .subscribe(products => {
        this.products = products;
        this.filteredProducts = products;
        if (event != null) event.target.complete();
      });
  }  

  public checkProduct(product: Product){
    var check = (product.checked) ? '0' : '1';
    this.productService
      .checkProduct(product.id, check)
      .subscribe(res => { 
        this.getProducts(null);
        this.searchTerm = '';
      });
  }

  public filterList(){    
    var filter = this.products.filter(element => element
      .name
      .toLowerCase()
      .includes(this.searchTerm.toLowerCase()));
    this.filteredProducts = filter;
  }

  public editProduct(product: Product){
    let navigationData: NavigationExtras = {
      state: {
        product: product
      }
    };
    this.router.navigate(['save-product'], navigationData);
  }

  private sendEventSource(){
    if (this.sentEventSource == false){
      this.sseService
        .getServerSentEvent(this.ssePath)
        .subscribe(data => 
          this.getProducts(null)); 
      this.sentEventSource = true;
    }    
  }
}
