import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FacturationResponse } from '../../classes/interfaces';

@Component({
  selector: 'app-facture-item',
  imports: [],
  templateUrl: './facture-item.component.html',
  styleUrl: './facture-item.component.css'
})
export class FactureItemComponent {

  @Input() facture!: FacturationResponse;
  @Output() edit = new EventEmitter<FacturationResponse>();
  @Output() delete = new EventEmitter<FacturationResponse>();
  @Output() detail = new EventEmitter<FacturationResponse>();

  onEdit(): void {
    this.edit.emit(this.facture);
  }

  onDelete(): void {
    this.delete.emit(this.facture);
  }

  onDetail(): void {
    this.detail.emit(this.facture);
  }

}
