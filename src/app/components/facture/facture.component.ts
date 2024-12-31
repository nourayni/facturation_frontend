import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FactureService } from '../../service/facture.service';
import { ProductService } from '../../service/product.service';
import { FacturationDto, FacturationResponse, ProductResponse } from '../../classes/interfaces';

@Component({
  selector: 'app-facture',
  imports: [
    ReactiveFormsModule
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

  constructor(private factureService: FactureService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadFactures();
  }

  private initForm(): void {
    this.facturationForm = this.fb.group({
      clientName: [''],
      clientPhoneNumber: [''],
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
  get ligneFacturation(): FormArray {
    return this.facturationForm.get('lignesFacturation') as FormArray
  }

  // ajouter une ligne de facturation dans la liste de ligne de facturation
  addLigneFacturation(): void {
    this.ligneFacturation.push(this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    }))
  }

  removeLigneFacturation(index: number): void {
    // Vérifier si l'index est valide
    if (index < 0 || index >= this.ligneFacturation.length) {
      console.error('Index invalide pour la suppression de ligne');
      return;
    }

    // Supprimer la ligne du FormArray
    this.ligneFacturation.removeAt(index);

    // Si c'était la dernière ligne, on peut vouloir ajouter une ligne vide
    // ou afficher un message (selon les besoins)
    if (this.ligneFacturation.length === 0) {
      // Optionnel : ajouter automatiquement une nouvelle ligne vide
      // this.addLigneFacturation();
      console.log('Toutes les lignes ont été supprimées');
    }

    // Optionnel : recalculer les totaux ou mettre à jour d'autres éléments
    // this.updateTotals();
  }

  //
  onProductSelected(index: number, event: any): void {
    //
    const selectedproduct = this.products.find(product => product.id === event.target.value);
    if(selectedproduct){
      // mettre a jour le produit selectionne dans la ligne de facturation
      this.ligneFacturation.at(index).patchValue({
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
        this.ligneFacturation.clear()
        this.isSubmitted = false
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
        console.log(this.factures)
      }),
      error:((err)=>{
        console.error(err)
      })
    })
  }



}
