import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environnement } from '../../environnement/environnement';
import { ProductRequest, ProductResponse } from '../classes/interfaces';
import { Observable } from 'rxjs';

const end_point = environnement.api_url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  product_list():Observable<ProductResponse[]>{
    return this.http.get<ProductResponse[]>(`${end_point}/api/products/`)
  }

  product_detail(id:string):Observable<ProductResponse>{
    return this.http.get<ProductResponse>(`${end_point}/api/products/${id}`)
  }

  product_delete(id:string):Observable<any>{
    return this.http.delete<void>(`${end_point}/api/products/${id}`)
  }

  product_update(id:string, product:ProductResponse):Observable<ProductResponse>{
    return this.http.put<ProductResponse>(`${end_point}/api/products/${id}`, product)
  }

  new_product(product:ProductRequest):Observable<ProductResponse>{
    return this.http.post<ProductResponse>(`${end_point}/api/products`, product)
  }
}
