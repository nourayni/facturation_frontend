import { Component, Input } from '@angular/core';
import { ProductResponse } from '../../classes/interfaces';
import { format } from 'date-fns';

@Component({
  selector: 'app-product-item',
  imports: [],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {

  constructor() { }
  @Input() product!: ProductResponse;

  format_date(date :Date){
      return format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
    }

}
