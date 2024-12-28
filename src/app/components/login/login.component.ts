import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../service/storage.service';
import { LoginResponse } from '../../classes/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  message!: string;
  login_response!:LoginResponse


  constructor(private authService:AuthService,
    private formBuilder:FormBuilder,
    private storage:StorageService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['',{
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
      password: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
    });
  }


  login(): void {
    if(this.loginForm.invalid){
      this.message = 'Veuillez remplir tous les champs';
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      {
        next:((response)=>{
          this.message = 'Connexion réussie';
          console.log(response);
          this.login_response = response; // Stockage des données de connexion
          this.storage.saveToken(this.login_response); // Sauvegarde des données de connexion
          this.router.navigate(['/products']); // Redirection vers la page principale
        }),
        error:((error)=>{
          this.message = 'Connexion échouée';
          console.log(error);
        })
      }
    )
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // Obtention du message d'erreur
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
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
