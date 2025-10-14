import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() label: string = '';
  @Input() title: string = '';

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isBrowser) return; // ⚠️ Evita ejecutar Chart.js en SSR
    if (!this.labels.length || !this.data.length) return;

    if (this.chart) {
      this.chart.destroy(); // Destruye chart anterior
    }

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          label: this.label,
          data: this.data,
          backgroundColor: this.labels.map(() => this.getRandomColor()),
          hoverOffset: 4
        }]
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
