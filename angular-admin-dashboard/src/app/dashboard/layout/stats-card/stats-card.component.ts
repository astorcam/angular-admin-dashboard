import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-stats-card',
  imports: [MatCardModule, CommonModule, MatIcon],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
@Input({required:true}) statsTitle!: string;
@Input({required:true}) statsIcon!: string;
@Input({required:true}) statsValue!: number;

}
