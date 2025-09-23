import { Component, Input } from '@angular/core';
import { Chart} from 'chart.js';


@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
 @Input({required:true}) chart!: Chart;

}
