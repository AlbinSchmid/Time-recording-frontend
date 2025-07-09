import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatListModule, MatIconModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  apiService = inject(ApiService);
}
