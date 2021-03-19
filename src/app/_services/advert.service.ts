import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Advert, City, Province, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AdvertService {
    constructor( private router: Router, private http: HttpClient) {}

    getAllUserAdverts(userId: number): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/users/${userId}/adverts`);
    }

    getUserAdvertById(userId: number, advertId: number): Observable<Advert> {
        return this.http.get<Advert>(`${environment.apiUrl}/users/${userId}/adverts/${advertId}`);
    }

    createUserAdvertById(userId: number, advert: Advert): Observable<Advert> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Advert>(`${environment.apiUrl}/users/${userId}/adverts`, advert, { headers });
    }
    
    updateUserAdvertById(userId: number, advertId: number, advert: Advert): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${environment.apiUrl}/users/${userId}/adverts/${advertId}`, advert, { headers });
    }

    deleteAdvert(id: number): Observable<{}> {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    getAllProvinces(): Observable<Province[]> {
        return this.http.get<Province[]>(`${environment.apiUrl}/provinces`);
    }

    getAllCities(): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/cities`);
    }

    getAllProvinceCities(provinceId: number): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/provinces/${provinceId}/cities`);
    }
}