import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'flexible-video-archive';

  slides = [
    { image: "assets/img/baner1.jpg" }, 
    { image: "assets/img/baner2.jpg" }, 
    { image: "assets/img/baner3.jpg" }
  ]
}
