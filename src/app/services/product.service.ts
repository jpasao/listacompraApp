import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ProductService {
    private path = environment.apiEndPoint + 'product';
    showSpinner: boolean;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    
    constructor(private httpService: HttpClient){
        this.showSpinner = true;
        this.productList = [];        
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
        //var fullPath = this.path + '&XDEBUG_SESSION_START=PHPSTORM';
        var obj = { productId: id, isChecked: checked };
        return this.httpService
            .patch(this.path, obj); 
    }

    public createProduct(name) : Observable<any> {
        const params = new HttpParams()
            .set('name', name);

        return this.httpService
            .post(this.path, params); 
    }

    public updateProduct(id, name) : Observable<any> {
        const params = new HttpParams()
            .set('productId', id)
            .set('name', name);

        return this.httpService
            .put(this.path, params); 
    }

}