import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductRequest, ProductResponse } from '../../classes/interfaces';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { ProductItemComponent } from "../product-item/product-item.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [ProductItemComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  products: ProductResponse[] = [];
  productForm!: FormGroup
  productRequest!: ProductRequest
  productPage: ProductResponse[] = []

  // pagination variables
  page: number = 0
  size:number = 1
  sorted:string = 'createdAt'
  direction:string = 'asc'
  totalElements: number = 0
  totalPages:number = 0


  constructor(private productService: ProductService,
    private formBuilder: FormBuilder
  ){

  }

  ngOnInit(): void {
    this.fetchedProduct()
    this.getProductPage()

    this.productForm = this.formBuilder.group({
      nomProduct: ['',{
        validators: [Validators.required, Validators.minLength(4)],
        updateOn:'blur',
      }
    ],
      price: ['',{
        validators: [Validators.required, Validators.minLength(4)],
        updateOn:'blur'
      }
    ],
    })
  }

  save_product(): void {
    this.productRequest = this.productForm.value
    this.productService.new_product(this.productRequest).subscribe({
      next:((response)=>{
        console.log(response)
        this.productForm.reset()
        this.fetchedProduct()
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }

  fetchedProduct(): void {
    this.productService.product_list().subscribe({
      next:((response)=>{
        this.products = response
        //console.log(this.products)
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }

  
  deleteProduct(id: string): void {
    this.productService.product_delete(id).subscribe({
      next:((response)=>{
        console.log(response)
        this.fetchedProduct()
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }

  getProductPage():void{
    this.productService.getAllproductByPageAndSort(this.page, this.size, this.sorted, this.direction).subscribe(
      {
        next:((response)=>{
          console.log( response)
          console.log(response.totalElements, response.size)
          this.productPage = response.content
          this.totalPages = response.totalPages
          this.totalElements = response.totalElements
        }),
        error:((err)=>{
          console.error(err.message)
        })
      }
    )
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getProductPage();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getProductPage();
    }
  }

  

  format_date(date :Date){
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // Obtention du message d'erreur
  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return `Le champ ${controlName} est requis`;
    }
    if (control.errors['minlength']) {
      return `Le champ ${controlName} doit contenir au moins 3 caractères`;
    }
    return '';
  }

}
