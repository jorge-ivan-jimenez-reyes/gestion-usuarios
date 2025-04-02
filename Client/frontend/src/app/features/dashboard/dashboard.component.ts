import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createBarChart();
    this.createLineChart();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  createBarChart() {
    if (this.barChart) {
      new Chart(this.barChart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
          datasets: [
            {
              label: 'Product Sales',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Service Revenue',
              data: [28, 48, 40, 19, 86, 27, 90],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  createLineChart() {
    if (this.lineChart) {
      new Chart(this.lineChart.nativeElement, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Product Sales Trend',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Service Revenue Trend',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
