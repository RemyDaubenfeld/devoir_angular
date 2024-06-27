import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { LatenessComponent } from './lateness/lateness.component';
import { AbsenceComponent } from './absence/absence.component';


export const routes: Routes = [
    {path: 'accueil', component: HomeComponent},
    {path: 'ajout-utilisateur', component: EditUserComponent},
    {path: 'modifier-utilisateur/:user_id', component: EditUserComponent},
    {path: 'gestion-utilisateurs', component: ManageUserComponent},
    {path: 'connexion', component: LoginComponent},
    {path: 'retard', component: LatenessComponent},
    {path: 'absence', component: AbsenceComponent},
    {path: '', redirectTo: 'accueil', pathMatch: 'full'},
    {path: '**', component: NotFoundComponent},
]