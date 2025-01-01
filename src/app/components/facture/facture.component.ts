import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FactureService } from '../../service/facture.service';
import { ProductService } from '../../service/product.service';
import { FacturationDto, FacturationResponse, ProductResponse } from '../../classes/interfaces';
import { FactureItemComponent } from "../facture-item/facture-item.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facture',
  imports: [
    ReactiveFormsModule,
    FactureItemComponent,
    CommonModule,
],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css'
})
export class FactureComponent implements OnInit {

  facturationForm!: FormGroup
  isSubmitted:boolean = false
  errorMessage: string = ''
  products: ProductResponse[] = []
  factures: FacturationResponse[] = []
  

  page: number = 0
  size:number = 4
  sorted:string = 'createdAt'
  direction:string = 'desc'

  totalElements: number = 0
  totalPages:number = 0

  facturesResponse: FacturationResponse[] = []

  factureResponseOndays: FacturationResponse[] = []

  searchForm!: FormGroup
  search: string = ''

  dateForm!: FormGroup
  date: Date = new Date()

  constructor(private factureService: FactureService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.initForm()
    this.searchForm = this.fb.group({
      search: ['']
    })
    this.dateForm = this.fb.group({
      date: [null]
    })
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadFactures();
    this.getFacturePaginated();
    this.onTodayFactures();
  }

  getFacturePaginated():void{
    this.search = this.searchForm.value.search
    this.factureService.getFacturationPaginated(this.page, this.size, this.sorted, this.direction,this.search).subscribe({
      next: ((response: any) => {
        console.log(response)
        this.facturesResponse = response.content
        this.totalElements = response.totalElements
        this.totalPages = response.totalPages
      }),
      error: ((err) => {
        console.log(err.message)
        console.error(err)
      })
    })
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getFacturePaginated();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getFacturePaginated();
    }
  }


  private initForm(): void {
    this.facturationForm = this.fb.group({
      clientName: ['',[Validators.required, Validators.minLength(3)]],
      clientPhoneNumber: ['',[Validators.required]],
      // declarer une liste de ligne facturation vide dans le formulaire
      lignesFacturation: this.fb.array([])
    })
  }


  loadProducts(): void {
    this.productService.product_list().subscribe({
      next:((response)=>{
        this.products = response
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }
  // recuperer les lignes de facturation
  get lignesFacturation(): FormArray {
    return this.facturationForm.get('lignesFacturation') as FormArray
  }

  // ajouter une ligne de facturation dans la liste de ligne de facturation
  addLigneFacturation(): void {
    this.lignesFacturation.push(this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    }))
  }

  removeLigneFacturation(index: number): void {
    // Vérifier si l'index est valide
    if (index < 0 || index >= this.lignesFacturation.length) {
      console.error('Index invalide pour la suppression de ligne');
      return;
    }

    // Supprimer la ligne du FormArray
    this.lignesFacturation.removeAt(index);

    if (this.lignesFacturation.length === 0) {
      // Optionnel : ajouter automatiquement une nouvelle ligne vide
      this.addLigneFacturation();
      console.log('Toutes les lignes ont été supprimées');
    }
  }

  //
  onProductSelected(index: number, event: any): void {
    //
    const selectedproduct = this.products.find(product => product.id === event.target.value);
    if(selectedproduct){
      // mettre a jour le produit selectionne dans la ligne de facturation
      this.lignesFacturation.at(index).patchValue({
        product: selectedproduct
      })
    }
  }

  onSubmit(): void {
    this.isSubmitted = true
    if(this.facturationForm.invalid){
      return
    }
    const facturation : FacturationDto = {
        clientName:this.facturationForm.value.clientName,
        clientPhoneNumber:this.facturationForm.value.clientPhoneNumber,
        lignesFacturation:this.facturationForm.value.lignesFacturation
    }
    // creer une facture avec les données du formulaire et envoyer le request au serveur
    this.factureService.createFacturation(facturation).subscribe({
      next:((response)=>{
        console.log(response)
        this.facturationForm.reset()
        // vider la liste des lignes de facturation
        this.lignesFacturation.clear()
        this.isSubmitted = false
        this.getFacturePaginated();
      }),
      error:((err)=>{
        this.errorMessage = err.error.message
        console.error(err)
      })
    })
  }

  loadFactures():void {
    this.factureService.getFacturationList().subscribe({
      next:((response)=>{
        this.factures = response
        //console.log(this.factures)
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }
  onTodayFactures(): void {
    if(this.dateForm.value.date!=null) {
      this.date = new Date(this.dateForm.value.date)
    }else {
      this.date = new Date()
    }
    const formattedDate = this.date.toISOString().split('T')[0];
    this.factureService.getfactureOnday(formattedDate).subscribe({
      next:((response)=>{
        this.factureResponseOndays = response
        console.log(this.factureResponseOndays)
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }
  





  // --------------------------------------
  onEdit(facture: FacturationResponse): void {
    console.log('Edit facture:', facture);
    // Logique pour éditer la facture
  }

  onDelete(facture: FacturationResponse): void {
    console.log('Delete facture:', facture);
    // Logique pour supprimer la facture
  }

  onDetail(facture: FacturationResponse): void {
    console.log('Detail facture:', facture);
    // Logique pour afficher les détails de la facture
  }



}
