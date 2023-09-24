import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {env} from 'env';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private api : string = env.api;
  constructor(private http:HttpClient) { }


  login(user:any){
    return this.http.post(`${this.api}/login`,user);
  }

  create(user:any){
    return this.http.post(`${this.api}/register`,user);
  }
}
