import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { timeInterval } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  apiService = inject(ApiService);

  formData = {
    staff_name: '',
    date: new Date(),
    project_name: '',
    comment: ''
  }

  projects = [
    { value: '', viewValue: '' },
  ];

  staffNames = [
    { value: '', viewValue: '' },
  ];

  ngOnInit(): void {
    this.getProjects();
    this.getStaffNames();
    
  }
  
  /**
   * Fetches the list of projects from the API and maps them to an array of objects
   * with `value` and `viewValue` properties for use in form controls.
   *
   * The method sends a GET request to the projects endpoint using `apiService`.
   * On success, it assigns the mapped project data to the `projects` property.
   * On error, it logs the error to the console.
   */
  getProjects() : void {
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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form Submitted!', this.formData);
    }
  }
}
