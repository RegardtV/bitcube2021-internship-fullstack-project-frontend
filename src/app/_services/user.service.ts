import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from '@environments/environment';
import { Advert, AdvertSearch, User } from '@app/_models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor( private http: HttpClient ) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/users/${userId}`);
    }

    updateUser(userId: number, user: User): Observable<User> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<User>(`${environment.apiUrl}/users/${userId}/`, user, { headers });
    }
    
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

    getUserFavourites(userId: number): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/users/favourites/${userId}`)
    }
    
    addRemoveUserFavourite(userId: number, advertId: number ): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${environment.apiUrl}/users/favourites`, { userId, advertId }, { headers });
    }

    searchUserAdverts(userId: number, searchObject: AdvertSearch): Observable<Advert[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Advert[]>(`${environment.apiUrl}/users/${userId}/adverts/search`, searchObject, { headers });
    }
}