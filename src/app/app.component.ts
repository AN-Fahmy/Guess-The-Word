import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuessgameComponent } from "./components/guessgame/guessgame.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GuessgameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'guessword';
}
