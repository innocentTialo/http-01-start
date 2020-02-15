import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class AuthenticationInterceptorSevice implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('your request is going!');
    const modifiedRequest = req.clone({
      headers: req.headers.append('authToken', 'xwz')
    });
    return next.handle(modifiedRequest);
  }

}
