import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formulaire: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthentificationService
  ) {
    this.formulaire = this.formBuilder.group({
      user_mail: ['a@a.com', [Validators.email, Validators.required]],
      user_password: ['root', [Validators.required]],
    });
  }

  onLogin() {
    if (this.formulaire.valid) {
      this.http
        .post(
          'http://backendadminmns.local/login.php',
          this.formulaire.value
        )
        .subscribe((result: any) => {
            this.authService.login(result.jwt, result.user);
            // Afficher un message de succès
            this.snackBar.open('Vous êtes connecté', undefined, {
              panelClass: 'snack-bar-valid',
              duration: 3000,
            });
            // Rediriger vers la page d'accueil
            this.router.navigateByUrl('/accueil')
        });
    }
  }
}
