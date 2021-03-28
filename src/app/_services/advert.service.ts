import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Advert, AdvertSearch, City, Province } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AdvertService {
    constructor( private http: HttpClient) {}

    getAllAdverts(): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/adverts`);
    }

    getAdvertById(advertId: number): Observable<Advert> {
        return this.http.get<Advert>(`${environment.apiUrl}/adverts/${advertId}`);
    }
    
    getAllProvinces(): Observable<Province[]> {
        return this.http.get<Province[]>(`${environment.apiUrl}/adverts/provinces`);
    }

    getAllCities(): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/adverts/cities`);
    }

    getAllProvinceCities(provinceId: number): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/adverts/provinces/${provinceId}/cities`);
    }

    searchFeaturedAdverts(searchObject: AdvertSearch): Observable<Advert[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Advert[]>(`${environment.apiUrl}/adverts/featured/search`, searchObject, { headers });
    }

    searchNonFeaturedAdverts(searchObject: AdvertSearch): Observable<Advert[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Advert[]>(`${environment.apiUrl}/adverts/notfeatured/search`, searchObject, { headers });
    }

    getAllFeaturedAdverts(): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/adverts/featured`)
    }

    getAllNonFeaturedAdverts(): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/adverts/notfeatured`)
    }
}