import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { TimeRecord } from '../../interfaces/time-record';
import Cookies from 'js-cookie';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  apiService = inject(ApiService);

  formData = {
    staff_id: '',
    date: new Date(),
    time_start: '',
    project_id: '',
    comment: ''
  };
  projects = [
    { value: '', viewValue: '' },
  ];
  staffNames = [
    { value: '', viewValue: '' },
  ];

  today: Date = new Date();
  staffNameLastSelected: string = '';

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   * Initializes the component by fetching the list of projects and staff names.
   *
   * @remarks
   * This method is automatically invoked by Angular when the component is initialized.
   */
  ngOnInit(): void {
    this.getProjects();
    this.getStaffNames();

    const savedId = Cookies.get('savedStaffId');
    if (savedId) {
      this.staffNameLastSelected = String(savedId);
    }
  }

  /**
   * Handles the staff selection change event.
   * 
   * This method is triggered when the user selects a different staff member from the dropdown.
   * It performs the following actions:
   * 1. Fetches time records associated with the newly selected user by calling `getTimeRecordsFromUser()`.
   * 2. Stores the selected staff ID in a cookie named 'savedStaffId' for persistence.
   *
   * @param event - The selection change event containing the newly selected staff ID.
   */
  changedStaff(event: MatSelectChange): void {
    this.getTimeRecordsFromUser();
    Cookies.set('savedStaffId', event.value);
  }

  /**
   * Fetches time records for the user specified in `formData.staff_id` by sending a GET request
   * to the time records API endpoint. The retrieved records are assigned to `apiService.timeRecords`.
   * Logs an error to the console if the request fails.
   *
   * @remarks
   * This method constructs the request URL by appending a `search` query parameter with the user's staff ID.
   *
   * @returns void
   */
  getTimeRecordsFromUser(): void {
    this.apiService.sendGetRequest(this.apiService.TIME_RECORD_URL + '?search=' + this.formData.staff_id).subscribe({
      next: (response) => {
        this.apiService.timeRecords = response;
      },
      error: (error) => {
        console.error('Error fetching time entries:', error);
      }
    });
  }

  /**
   * Converts a JavaScript Date object to an ISO 8601 date string (YYYY-MM-DD).
   *
   * @param date - The Date object to format.
   * @returns The ISO 8601 formatted date string (e.g., "2024-06-13").
   */
  formatDateToIso(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Fetches the list of projects from the API and maps them to an array of objects
   * with `value` and `viewValue` properties for use in form controls.
   *
   * The method sends a GET request to the projects endpoint using `apiService`.
   * On success, it assigns the mapped project data to the `projects` property.
   * On error, it logs the error to the console.
   */
  getProjects(): void {
    this.apiService.sendGetRequest(this.apiService.PROJECTS_URL).subscribe({
      next: (response: any) => {
        this.projects = response.map((project: any) => ({
          value: project.id,
          viewValue: project.name
        }));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /**
   * Fetches the list of staff names from the backend API and updates the `staffNames` property.
   *
   * Sends a GET request to the staff names endpoint using the `apiService`.
   * On success, transforms the response into an array of objects with `value` (staff ID)
   * and `viewValue` (staff name) properties for use in form controls.
   * Logs any errors encountered during the request to the console.
   */
  getStaffNames(): void {
    this.apiService.sendGetRequest(this.apiService.STAFF_NAMES_URL).subscribe({
      next: (response: any) => {
        this.staffNames = response.map((staff: any) => ({
          value: staff.id,
          viewValue: staff.name
        }));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /**
   * Handles the form submission event.
   * 
   * If the form is valid, formats the date field in the form data to ISO format
   * and then calls `saveTimeRecord` with the form and the formatted data.
   *
   * @param form - The NgForm instance representing the submitted form.
   */
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formatedData = {
        ...this.formData,
        date: this.formatDateToIso(this.formData.date)
      };
      this.saveTimeRecord(form, formatedData);
    }
  }

  /**
   * Submits a new time record to the backend API and updates the local time records list upon success.
   *
   * @param form - The Angular form instance used for the time entry, which will be reset after a successful submission.
   * @param formatedData - The data object containing the formatted time entry information to be sent to the API.
   *
   * Sends a POST request to the time entries endpoint with the provided data.
   * On success, adds the new time record to the local list and resets the form.
   * Logs errors to the console if the request fails.
   */
  saveTimeRecord(form: NgForm, formatedData: any): void {
    this.apiService.sendPostRequest(this.apiService.TIME_RECORD_URL, formatedData).subscribe({
      next: (response: TimeRecord) => {
        this.apiService.timeRecords.push(response);
        console.log('Time entry created successfully:', response);
        form.resetForm();
        this.formData.date = new Date();
      },
      error: (error) => {
        console.error('Error creating time entry:', error);
      }
    });
  }
}
