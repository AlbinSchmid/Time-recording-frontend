import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TimeRecord } from '../interfaces/time-record';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient)

  API_URL = 'http://localhost:8000/api/';
  PROJECTS_URL = this.API_URL + 'projects/';
  STAFF_NAMES_URL = this.API_URL + 'staff-names/';
  TIME_ENTRIES_URL = this.API_URL + 'time-records/';

  timeRecords: TimeRecord[] = [];

  sendGetRequest(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  sendPostRequest(url: string, data: any): Observable<TimeRecord> {
    return this.http.post<TimeRecord>(url, data);
  }
}
