import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environnement } from '../../environnement/environnement';
import { FacturationDto, FacturationResponse, FactureDayResponse, PaginatedResponse } from '../classes/interfaces';
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

  getFacturationPaginated(page: number, size: number, sortBy: string, direction: string, numFacture:string): Observable<PaginatedResponse<FacturationResponse>> {
    return this.http.get<PaginatedResponse<FacturationResponse>>(`${apiUrl}/facture/paginated`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy: sortBy,
        direction: direction,
        numFacture:numFacture
      }
    });
  }

  getfactureOnday(date: string):Observable<FactureDayResponse>{

    return this.http.get<FactureDayResponse>(`${apiUrl}/facture/day`,{
      params:{
        date: date
      }
    })
  }

  factureDetail(id: string): Observable<FacturationResponse> {
    return this.http.get<FacturationResponse>(`${apiUrl}/facture/${id}`);
  }

}
