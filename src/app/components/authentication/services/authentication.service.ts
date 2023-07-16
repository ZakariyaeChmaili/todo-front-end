import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient) { }


  login(user:any){
    return this.http.post('http://localhost:8000/api/login',user);
  }

  create(user:any){
    return this.http.post('http://localhost:8000/api/register',user);
  }
}
