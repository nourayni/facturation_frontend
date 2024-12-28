import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    // pour que la formulaire fonctionne dans angular il faut importer ReactiveFormsModule
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup
  message : string = '';

  constructor(private authService : AuthService, private formBuilder:FormBuilder) { }

  

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
      password: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur' // Mise à jour à la perte du focus
      }],
    });
  }

  register(): void {
    if(this.registerForm.invalid){
      this.message = 'Veuillez remplir tous les champs';
      return;
    }
    this.authService.register(this.registerForm.value).subscribe(
      {
        next:((response)=>{
          this.message = 'Inscription réussie';
          console.log(response);
        }),
        error:((error)=>{
          this.message = 'Inscription échouée';
          console.log(error);
        })
      }
    )
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // Obtention du message d'erreur
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
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
