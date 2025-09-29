import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChecklistBase } from '../../models/chk-spt.interface';

@Injectable({
  providedIn: 'root',
})
export class ExtChecklist {
  constructor(private http: HttpClient) {}

  getChecklists(): Observable<ChecklistBase[]> {
    return this.http.get<ChecklistBase[]>('/assets/flt-spchck.json');
  }

  getChecklist({
    ou_level,
    department,
    health_area,
  }: {
    ou_level: number;
    department: string;
    health_area: string;
  }): Observable<ChecklistBase | undefined> {
    console.log(
      'ou_level = ',
      ou_level,
      'department = ',
      department,
      'health_area = ',
      health_area
    );
    const datas = this.http.get<ChecklistBase[]>('/assets/flt-spchck.json');

    let filter = (chk: ChecklistBase) =>
      chk.ou_level == ou_level && chk.department == department && chk.health_area == health_area;
    return datas.pipe(map((checklists) => checklists.find(filter)));
  }
}
