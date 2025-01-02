import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../service/facture.service';
import { ActivatedRoute } from '@angular/router';
import { FacturationResponse } from '../../classes/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facture-detail',
  imports: [CommonModule],
  templateUrl: './facture-detail.component.html',
  styleUrl: './facture-detail.component.css'
})
export class FactureDetailComponent implements OnInit {
  facture!: FacturationResponse

  constructor(private factureService:FactureService,
      private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.router.snapshot.params['id'];
    this.factureService.factureDetail(id).subscribe(facture => {
      this.facture = facture;
      console.log('Facture:', facture); // Debugging purposes only
    });
  }

}
