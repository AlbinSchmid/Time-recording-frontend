import { Component, inject } from '@angular/core';
import { FormComponent } from "../shared/components/form/form.component";
import { ListComponent } from "./list/list.component";
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-time-tracking',
  imports: [FormComponent, ListComponent],
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss'
})
export class TimeTrackingComponent {
  apiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.sendGetRequest(this.apiService.TIME_ENTRIES_URL).subscribe({
      next: (response) => {
        this.apiService.timeRecords = response;
      },
      error: (error) => {
        console.error('Error fetching time entries:', error);
      }
    });
  }

}
