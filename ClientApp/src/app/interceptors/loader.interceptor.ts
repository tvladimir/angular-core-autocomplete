import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from "../services/loader/loader.service";
@Injectable()

// Set (Show, Hide) Loader on every request
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.loaderService.setIsLoading(true);
        return next.handle(req).pipe(
            finalize(() => this.loaderService.setIsLoading(false))
        );
    }
}
