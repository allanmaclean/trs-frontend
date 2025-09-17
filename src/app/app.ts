import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly gridSize = 5;
  readonly rows: number[] = Array.from({ length: this.gridSize }, (_, i) => i).reverse();
  readonly cols: number[] = Array.from({ length: this.gridSize }, (_, i) => i);

  protected readonly title = signal('trs-frontend');

  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getHello().subscribe((data) => this.title.set(data));
  }
}
