import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../classes/interfaces';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { ProductItemComponent } from "../product-item/product-item.component";

@Component({
  selector: 'app-product',
  imports: [ProductItemComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  products: ProductResponse[] = [];

  constructor(private productService: ProductService){

  }

  ngOnInit(): void {
    this.fetchedProduct()
  }

  fetchedProduct(): void {
    this.productService.product_list().subscribe({
      next:((response)=>{
        this.products = response
        console.log(this.products)
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }

  format_date(date :Date){
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
  }

}
