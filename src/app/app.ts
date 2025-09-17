import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('trs-frontend');
  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getHello().subscribe((data) => this.title.set(data));
  }
}
