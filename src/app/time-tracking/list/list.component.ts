import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../shared/services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatListModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  apiService = inject(ApiService);

  data = {
    time_end: ''
  }

  totalMinutes = 0;

  /**
   * Updates the `time_end` property of the current record to the current time (in "HH:MM" format)
   * and calls `updateRecord` with the provided record ID.
   *
   * @param recordID - The unique identifier of the record to be edited. Can be `number` or `undefined`.
   */
  editRecord(recordID: number | undefined): void {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    this.data.time_end = timeString;
    this.updateRecord(recordID);
  }

  /**
   * Updates the end time of a time tracking record to the current time and sends a PATCH request to update the record on the server.
   * 
   * @param recordID - The unique identifier of the record to update. Can be a number or undefined.
   * 
   * This method sets the `time_end` property of the `data` object to the current time (in HH:mm format),
   * then sends a PATCH request to update the record on the backend. On success, it saves the updated record locally.
   * Logs an error to the console if the update fails.
   */
  updateRecord(recordID: number | undefined): void {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    this.data.time_end = timeString;
    this.apiService.sendPatchRequest(this.apiService.SINGLE_TIME_RECORD_URL + recordID + '/', this.data).subscribe({
      next: (updatedRecord) => {
        this.saveUpdatedRecordInJson(recordID, updatedRecord);
      },
      error: (error) => {
        console.error('Error updating record:', error);
      }
    });
  }

  /**
   * Deletes a time record with the specified ID by sending a DELETE request to the API.
   * 
   * @param recordID - The unique identifier of the time record to delete. Can be a number or undefined.
   * 
   * Removes the deleted record from the local `timeRecords` array upon successful deletion.
   * Logs an error to the console if the deletion fails.
   */
  deleteRecord(recordID: number | undefined): void {
    this.apiService.sendDeleteRequest(this.apiService.SINGLE_TIME_RECORD_URL + recordID + '/').subscribe({
      next: () => {
        this.apiService.timeRecords = this.apiService.timeRecords.filter(record => record.id !== recordID);
      },
      error: (error) => {
        console.error('Error deleting record:', error);
      }
    });
  }

  /**
   * Updates a time record in the local JSON array by replacing the record with the specified `recordID` with the provided `updatedRecord`.
   *
   * @param recordID - The unique identifier of the record to update. Can be `number` or `undefined`.
   * @param updatedRecord - The new record object that will replace the existing record with the matching `recordID`.
   */
  saveUpdatedRecordInJson(recordID: number | undefined, updatedRecord: any): void {
    this.apiService.timeRecords = this.apiService.timeRecords.map(record => {
      if (record.id === recordID) {
        return updatedRecord;
      }
      return record;
    });
  }

  /**
   * Calculates and returns the total tracked time as a formatted string in hours and minutes.
   *
   * This method first updates the total minutes by calling `getTotalMinutes()`, then
   * computes the equivalent hours and remaining minutes. The result is returned as a
   * string in the format "Xh Ymin".
   *
   * @returns {string} The total time formatted as "Xh Ymin".
   */
  getTotalHours(): string {
    this.getTotalMinutes();
    const hours = Math.floor(this.totalMinutes / 60);
    const minutes = Math.round(this.totalMinutes % 60);
    return `${hours}h ${minutes}min`;
  }

  /**
   * Calculates the total number of minutes from all valid time records
   * in the `apiService.timeRecords` array and updates the `totalMinutes` property.
   *
   * For each record, if both `time_start` and `time_end` are present,
   * it parses the times (in "HH:mm:ss" format), computes the difference in minutes,
   * and adds the positive differences to the total.
   *
   * Records with invalid or negative durations are ignored.
   */
  getTotalMinutes(): void {
    this.totalMinutes = 0;
    this.apiService.timeRecords.forEach(record => {
      if (record.time_start && record.time_end) {
        const [startH, startM, startS] = record.time_start.split(':').map(Number);
        const [endH, endM, endS] = record.time_end.split(':').map(Number);
        const start = startH * 60 + startM + startS / 60;
        const end = endH * 60 + endM + endS / 60;
        const diff = end - start;
        if (diff > 0) {
          this.totalMinutes += diff;
        }
      }
    });
  }

  /**
   * Calculates the total number of time records that are associated with a project.
   * 
   * Iterates through the `timeRecords` array from the `apiService` and counts
   * the records that have a defined `project_name` property.
   *
   * @returns The number of time records linked to a project.
   */
  getTotalProjects(): number {
    return this.apiService.timeRecords.filter(record => record.project_name).length;
  }
}
