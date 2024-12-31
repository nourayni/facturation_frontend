import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductResponse } from '../../classes/interfaces';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  product!:ProductResponse

  constructor(private productService: ProductService, private router: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getProduct();
  }
  getProduct(): void{
    const id = this.router.snapshot.paramMap.get('id');
    this.productService.product_detail(id!).subscribe(
      {
        next: (product) => {
          console.log('Product fetched:', product);  // Affiche le produit dans la console pour le debuggage
          this.product = product
        },
        error: (error) => {
          console.error('Error fetching product', error);
        }
      }
    )
  }


}
