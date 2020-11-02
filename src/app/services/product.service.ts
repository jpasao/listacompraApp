import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

@Injectable({providedIn: 'root'})
export class ProductService {
    private path = environment.apiEndPoint + 'product';
    showSpinner: boolean;
    authorId: string;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    
    constructor(private httpService: HttpClient, 
                private storage: Storage){
        this.showSpinner = true;
        this.productList = [];   
        this.getUserId();     
    }

    public productList: Product[];

    public getProducts(): Observable<Product[]> {
        return this.httpService
            .get<Product[]>(this.path)            
            .pipe(map(data => 
                data.map(data => {
                    this.setProductList(data);
                    return new Product().deserialize(data);
                })    
            )
        );
    }

    private setProductList(data){
        this.productList.push(data);
    }

    public getProductList(){
        return this.productList;
    }

    public checkProduct(id, checked) : Observable<any> {
        var obj = { productId: id, isChecked: checked, authorId: this.authorId };
        return this.httpService
            .patch(this.path, obj); 
    }

    public createProduct(name, quantity) : Observable<any> {
        const params = new HttpParams()
            .set('name', name)
            .set('quantity', quantity)
            .set('authorId', this.authorId);

        return this.httpService
            .post(this.path, params); 
    }

    public updateProduct(id, name, quantity) : Observable<any> {
        const params = new HttpParams()
            .set('productId', id)
            .set('name', name)
            .set('quantity', quantity)
            .set('authorId', this.authorId);

        return this.httpService
            .put(this.path, params); 
    }

    private getUserId() {        
        this.storage.get('author').then((val) => {
            this.authorId = (val != null) ? val : '-1';
        });        
    }
}