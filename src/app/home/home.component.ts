import { Component, inject, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { RouterLink,  RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, 
    RouterOutlet,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    HttpClientModule, 
    MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  title = 'admin-mns';
  authentification: AuthentificationService = inject(AuthentificationService);
  user_firstname: string | null = null;
  user_lastname: string | null = null;
  user_id: number | null = null;
  latenessUser: any = [];
  absenceUser: any = [];
  latenessList: any = [];
  absenceList: any = [];
  showList: boolean = true;
  activeButton: string = 'lateness';
  html: HttpClient = inject(HttpClient);

  constructor(private authService: AuthentificationService, private http: HttpClient) {}

  ngOnInit(): void {

    this.user_firstname = this.authService.user_firstname;
    this.user_lastname = this.authService.user_lastname;
    this.user_id = this.authService.user_id;
    const role = this.authService.role_name;

    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      const headers = new HttpHeaders().set('Authorization', jwt);

      if (role === 'Etudiant' && this.user_id) {
      const params = new HttpParams().set('user_id', this.user_id.toString());

      this.http.get<any[]>('http://backendadminmns.local/user-lateness.php', { headers, params })
        .subscribe({
          next: (result) => (this.latenessUser = result),
          error: () => alert('Erreur inconnue, contactez votre administrateur.')
        });

        this.http.get<any[]>('http://backendadminmns.local/user-absence.php', { headers, params })
        .subscribe({
          next: (result) => (this.absenceUser = result),
          error: () => alert('Erreur inconnue, contactez votre administrateur.')
        });
      } else {
        this.http.get<any[]>('http://backendadminmns.local/all-lateness.php', { headers })
         .subscribe({
            next: (result) => (this.latenessList = result),
            error: () => alert('Erreur inconnue, contactez votre administrateur.')
          });

          this.refresh();
      }
    } 
  }

  toggleList(type: string) {
    this.showList = type === 'lateness';
    this.activeButton = type;
  }

  refresh() {
    const jwt = localStorage.getItem("jwt");

    if(jwt) {
      this.http.get<any[]>('http://backendadminmns.local/all-absence.php', {'headers': {'Authorization': jwt}})
         .subscribe({
            next: (result) => (this.absenceList = result),
            error: () => alert('Erreur inconnue, contactez votre administrateur.')
          });
        }
  }

  onJustifiedAbsence(absence_id : number) {
      const jwt = localStorage.getItem("jwt");

      console.log(absence_id);

      if(jwt) {
        this.html
        .get('http://backendadminmns.local/justified-absence.php?absence_id=' + absence_id, {'headers': {'Authorization': jwt}})
        .subscribe({
          next: (result) => this.refresh(),
          error: () => alert('Erreur inconnue, contactez votre administrateur.')
        })
      }
  }

  onUnjustifiedAbsence(absence_id : number) {
      const jwt = localStorage.getItem("jwt");

      console.log(absence_id);

      if(jwt) {
        this.html
        .get('http://backendadminmns.local/unjustified-absence.php?absence_id=' + absence_id, {'headers': {'Authorization': jwt}})
        .subscribe({
          next: (result) => this.refresh(),
          error: () => alert('Erreur inconnue, contactez votre administrateur.')
        })
      }
    }

    getProofUrl(fileName: string): string {
      const basePath = 'http://backendadminmns.local/proof/'; // Remplacez par le chemin de base de vos justificatifs
      return `${basePath}${fileName}`;
    }
}
