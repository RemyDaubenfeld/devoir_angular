import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

  http: HttpClient = inject(HttpClient);
  formBuilder: FormBuilder = inject(FormBuilder);
  snackBar: MatSnackBar = inject(MatSnackBar);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute)

  formulaire: FormGroup = this.formBuilder.group({
    user_mail: ['', [Validators.required, Validators.email]],
    user_password: ['', [Validators.required]],
    user_firstname: ['', [Validators.required]],
    user_lastname: ['', [Validators.required]],
    role_name: ['Etudiant', [Validators.required]],
  });

  roleList: string[] = ['Etudiant', 'Gestionnaire', 'Administrateur'];

  userId? : number;

  ngOnInit() {
    this.route.params.subscribe(parametres => {

      // si il y a bien un paramètre dans l'url et que c'est bien un nombre
      if(parametres['user_id'] && !isNaN(parametres['user_id'])) {

        this.userId = parametres['user_id'];

        this.formulaire = this.formBuilder.group({
          user_mail: ['', [Validators.required, Validators.email]],
          user_password: ['',],
          user_firstname: ['', [Validators.required]],
          user_lastname: ['', [Validators.required]],
          role_name: ['Etudiant', [Validators.required]],
        })

        const jwt = localStorage.getItem('jwt');

        if(jwt) {
          this.http
            .get('http://backendadminmns.local/get-user.php?user_id=' + parametres['user_id'], { headers: { Authorization: jwt }})
            .subscribe({
              next : (user) => this.formulaire.patchValue(user),
              error: (erreur) => alert(erreur.error.message),
            })
          }
      } else {
        this.formulaire = this.formBuilder.group({
        user_mail: ['', [Validators.required, Validators.email]],
        user_password: ['', [Validators.required]],
        user_firstname: ['', [Validators.required]],
        user_lastname: ['', [Validators.required]],
        role_name: ['Etudiant', [Validators.required]],
        })
      }
    })
  }

  onAddUser() {
    if (this.formulaire.valid) {

      const url = this.userId ? 'http://backendadminmns.local/edit-user.php?user_id=' + this.userId : 'http://backendadminmns.local/add-user.php';

      const jwt = localStorage.getItem('jwt');

      if(jwt) {
        this.http
        .post(url, this.formulaire.value, { headers: { Authorization: jwt }})
        .subscribe({
          next: (result) => {
            this.snackBar.open("L'utilisateur a bien été " + (this.userId ? 'modifié' : 'ajouté'), undefined,{duration: 3000,});
            this.router.navigateByUrl('/gestion-utilisateurs');
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