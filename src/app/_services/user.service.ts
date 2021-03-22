import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from '@environments/environment';
import { Advert } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor( private http: HttpClient ) {}
    
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

}