import { Component, Input } from '@angular/core';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
 @Input({required:true}) chart!: Chart;
 
}
