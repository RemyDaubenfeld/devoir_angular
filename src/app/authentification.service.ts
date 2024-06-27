import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  connecte: boolean = localStorage.getItem('jwt') != null;
  user_id: number | null = null;
  role_name: string | null = null;
  user_mail: string | null = null;
  user_firstname: string | null = null;
  user_lastname: string | null = null;

  constructor(private router: Router) {}

  login(jwt: string, userDetails: any) {
    localStorage.setItem('jwt', jwt);
    this.setUserDetails(userDetails); // Méthode pour enregistrer les détails de l'utilisateur
  }

  private setUserDetails(userDetails: any) {
    this.user_id = userDetails.user_id;
    this.role_name = userDetails.role_name;
    this.user_mail = userDetails.user_mail;
    this.user_firstname = userDetails.user_firstname;
    this.user_lastname = userDetails.user_lastname;
  }

  logout() {
  localStorage.removeItem('jwt');
  this.role_name = null;
  this.router.navigateByUrl('/accueil');
  }

  getInfoFromJwtLocalStorage() {
    const jwt = localStorage.getItem('jwt');

    if (jwt != null) {
      this.connecte = true;

      const partiesJwt = jwt.split('.');
      const bodyBase64 = partiesJwt[1];
      const jsonBody = window.atob(bodyBase64);
      const body = JSON.parse(jsonBody);

      this.user_id = body.user_id;
      this.role_name = body.role_name;
      this.user_mail = body.user_mail;
      this.user_firstname = localStorage.getItem('user_firstname');
      this.user_lastname = localStorage.getItem('user_lastname');
    }
  }

  //getUser() {
  //  return {
  //    firstname: this.user_firstname,
  //    lastname: this.user_lastname,
  //  };
  //}
//
}