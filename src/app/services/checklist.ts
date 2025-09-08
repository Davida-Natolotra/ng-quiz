import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChecklistBase } from '../models/spt.interface';

@Injectable({
  providedIn: 'root',
})
export class Checklist {
  constructor(private http: HttpClient) {}

  getChecklists(): Observable<ChecklistBase[]> {
    return this.http.get<ChecklistBase[]>('/assets/spt-chk.json');
  }
}
