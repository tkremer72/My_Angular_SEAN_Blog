import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from '../../components/shared/error/error.component';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog
  ) {}

  intercept(
    request: HttpRequest<any>, next: HttpHandler)/* : Observable<HttpEvent<unknown>> */ {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!"
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage}, panelClass: 'my-panel' })
        return throwError(error);
      })
    );
  }
}
