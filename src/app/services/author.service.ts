import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Author } from '../models/author.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthorService {
    private path = environment.apiEndPoint + 'author';
    showSpinner: boolean;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    public authorList: Author[];

    constructor(private httpService: HttpClient) {        
        this.authorList = [];
    }

    public getAuthors(): Observable<Author[]> {
        return this.httpService
            .get<Author[]>(this.path)
            .pipe(map(data =>
                data.map(data => {
                    this.authorList.push(data);
                    return new Author().deserialize(data);
                })
            )
        );
    }
}
