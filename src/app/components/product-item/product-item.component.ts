import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductResponse } from '../../classes/interfaces';
import { format } from 'date-fns';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {

  constructor() { }
  @Input() product!: ProductResponse;
  @Output() deleteProduct = new EventEmitter<string>();

  format_date(date :Date){
      return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
    }

    onDelete(){
      this.deleteProduct.emit(this.product.id);
    }

}
