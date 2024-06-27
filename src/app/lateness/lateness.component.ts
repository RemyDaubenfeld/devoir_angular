import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../date-formats';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink,  RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lateness',
  standalone: true,
  imports: [
    MatDatepickerModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatNativeDateModule, 
    MatInputModule,
    RouterLink, 
    RouterOutlet,
    HttpClientModule],
  templateUrl: './lateness.component.html',
  styleUrl: './lateness.component.scss',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class LatenessComponent {

  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  
  formulaire: FormGroup = this.formBuilder.group({
    lateness_date: ['', Validators.required],
    lateness_reason: ['', Validators.required]
  });
  snackBar: MatSnackBar = inject(MatSnackBar);
  router: Router = inject(Router);

  onAddLateness() {
    if (this.formulaire.valid) {
      const formData = this.formulaire.value;
      const jwt = localStorage.getItem('jwt');

      if (jwt) {
        this.http.post('http://backendadminmns.local/add-lateness.php', formData, {
          headers: { 'Authorization': jwt }
        }).subscribe({
          next: (result) => {
            this.snackBar.open("Le retard a bien été enregistré", undefined,{duration: 3000,});
            this.router.navigateByUrl('/accueil');
          },
          error: (erreur) => {
            if (erreur.status == 409) {
              alert(erreur.error.message);
            } else {
              alert("Erreur inconnue, contactez votre administrateur.");
            }
          }
        });
      }
    }
  }
}
