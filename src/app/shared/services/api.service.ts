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
  TIME_RECORD_URL = this.API_URL + 'time-records/';
  SINGLE_TIME_RECORD_URL = this.API_URL + 'time-record/';
  
  timeRecords: TimeRecord[] = [];

  /**
   * Sends an HTTP GET request to the specified URL.
   *
   * @param url - The endpoint URL to which the GET request will be sent.
   * @returns An Observable emitting the response data from the GET request.
   */
  sendGetRequest(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  /**
   * Sends a POST request to the specified URL with the provided data.
   *
   * @param url - The endpoint URL to which the POST request will be sent.
   * @param data - The payload to be sent in the body of the POST request.
   * @returns An Observable emitting the created or updated `TimeRecord` object returned by the server.
   */
  sendPostRequest(url: string, data: any): Observable<TimeRecord> {
    return this.http.post<TimeRecord>(url, data);
  }

  /**
   * Sends a PATCH request to the specified URL with the provided data.
   *
   * @param url - The endpoint URL to which the PATCH request will be sent.
   * @param data - The data payload to be included in the PATCH request body.
   * @returns An Observable that emits the updated `TimeRecord` returned by the server.
   */
  sendPatchRequest(url: string, data: any): Observable<TimeRecord> {
    return this.http.patch<TimeRecord>(url, data);
  }

  /**
   * Sends an HTTP DELETE request to the specified URL.
   *
   * @param url - The endpoint URL to which the DELETE request will be sent.
   * @returns An Observable emitting the response from the DELETE request.
   */
  sendDeleteRequest(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }
}
