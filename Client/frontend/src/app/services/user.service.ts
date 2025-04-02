import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiBaseService {
  private endpoint = '/users';

  register(user: any): Observable<any> {
    return this.post(`${this.endpoint}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.post(`${this.endpoint}/login`, credentials);
  }

  updateProfile(profile: any): Observable<any> {
    return this.put(`${this.endpoint}/profile`, profile);
  }
}
