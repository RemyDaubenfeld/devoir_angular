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
  selector: 'app-absence',
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
  templateUrl: './absence.component.html',
  styleUrl: './absence.component.scss',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
  
export class AbsenceComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  
  formulaire: FormGroup = this.formBuilder.group({
    absence_date: ['', Validators.required],
    absence_reason: ['', Validators.required],
    absence_proof: ['']
  });
  snackBar: MatSnackBar = inject(MatSnackBar);
  router: Router = inject(Router);
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.formulaire.patchValue({ absence_proof: this.selectedFile.name });
    }
  }

  onAddAbsence() {
    if (this.formulaire.valid) {
      const formData = new FormData();
      formData.append('absence_date', this.formulaire.get('absence_date')?.value.toISOString().substring(0, 10) ?? '');
      formData.append('absence_reason', this.formulaire.get('absence_reason')?.value ?? '');

      if (this.selectedFile) {
        formData.append('absence_proof', this.selectedFile, this.selectedFile.name);
      }

        formData.forEach((value, key) => {
          console.log(key, value);
        });

        const jwt = localStorage.getItem('jwt');

      if (jwt) {
        this.http.post('http://backendadminmns.local/add-absence.php', formData, {
          headers: { 'Authorization': jwt }
        }).subscribe({
          next: (result) => {
            this.snackBar.open("L'absence a bien été enregistré", undefined,{duration: 3000,});
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

