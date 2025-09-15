import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OuServer {
  constructor(private http: HttpClient) {}

  getOrgUnits(): Observable<any> {
    let orgUnit = this.http.get<any>('/assets/metadata.json');
    return orgUnit as Observable<any>;
  }
}
