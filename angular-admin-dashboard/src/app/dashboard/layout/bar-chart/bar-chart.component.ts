import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables} from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
   @Input() labels: string[] = [];
  @Input() dataset: {
    label: any;
    data: number[];
    borderColor: string;
    backgroundColor: string
}[] = [];
  @Input() title: string = '';

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isBrowser) return; // ⚠️ Evita ejecutar Chart.js en SSR
    if (!this.labels.length || !this.dataset.length) return;

    if (this.chart) {
      this.chart.destroy(); // Destruye chart anterior
    }

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.dataset
      },
      options: {
          responsive: true,
        plugins: {
          title: {
            display: !!this.title,
            text: this.title
          }
        }
      }
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }


  getRandomColor(): string {
  const hue = ((Math.random() * (0.360- 0.001) + 0.1)*360).toFixed(2); 
  const saturation = 60;
  const lightness = 70;  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
}
