import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environnement } from '../../environnement/environnement';
import { FacturationDto, FacturationResponse } from '../classes/interfaces';
import { Observable } from 'rxjs';

const apiUrl = environnement.api_url;

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private http: HttpClient) { }

  createFacturation(facturation: FacturationDto): Observable<FacturationResponse> {
    return this.http.post<FacturationResponse>(`${apiUrl}/facture/save`, facturation);
  }

  getFacturationList(): Observable<FacturationResponse[]> {
    return this.http.get<FacturationResponse[]>(`${apiUrl}/facture/`);
  }

}
