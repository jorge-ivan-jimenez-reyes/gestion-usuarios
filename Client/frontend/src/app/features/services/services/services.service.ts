import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

export interface ServiceListResponse {
  items: Service[];
  totalRecords: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) { }

  getServices(page: number, searchTerm: string, category: string): Observable<ServiceListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('searchTerm', searchTerm)
      .set('category', category);

    return this.http.get<ServiceListResponse>(this.apiUrl, { params });
  }

  getService(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(id: string, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
