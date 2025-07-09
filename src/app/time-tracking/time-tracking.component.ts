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

}
