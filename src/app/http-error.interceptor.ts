import { 
    HttpInterceptor, 
    HttpRequest, 
    HttpHandler, 
    HttpEvent, 
    HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { ErrorService } from './services/error.service';
import { Injectable } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        public errorService: ErrorService,
        public ionLoader: LoaderService) {}   

    private isDebugging = true;
        
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.showLoader(req.method, req.body);
        const modRequest = this.debugging(req);
        return next.handle(modRequest)
            .pipe(
                retry(1),
                map((event: HttpEvent<any>) => {
                    this.hideLoader();
                    return event;
                }),               
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    
                    if (error.error instanceof ErrorEvent){
                        errorMessage = `La culpa es de la app: ${error.error.message}`;
                    }
                    else {
                        errorMessage = `La culpa es del api: ${error.message}. ${error.error}`;
                    }
                    this.hideLoader();
                    this.errorService.show(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }   
    
    showLoader(method, body){
        var message = '';
        switch (method){
            case 'GET':
                message = 'Un momentito...'; 
                break;
            case 'POST':
                message = 'Guardando ' + body.updates[0].value + '...'; 
                break;
            case 'PUT':
                message = 'Guardando ' + body.updates[1].value + '...'; 
                break;
            case 'PATCH':
                message = body.isChecked == "1" ? "Marcando..." : "Desmarcando...";
                break;
        }
        this.ionLoader.showLoader(message);
    }
    hideLoader(){
        this.ionLoader.hideLoader();
    }

    debugging(req){
        if (this.isDebugging){
            const cloneReq = req.clone({ params: req.params.set("XDEBUG_SESSION_START", "PHPSTORM")});
            return cloneReq;
        }
        else {
            return req;
        }
    }    
}