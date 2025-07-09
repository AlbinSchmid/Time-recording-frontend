import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient)

  API_URL = 'http://localhost:8000/api/';
  PROJECTS_URL = this.API_URL + 'projects/';
  STAFF_NAMES_URL = this.API_URL + 'staff-names/';
  TIME_ENTRIES_URL = this.API_URL + 'time-entries/';

  sendGetRequest(url: string) {
    return this.http.get(url);
  }
}
