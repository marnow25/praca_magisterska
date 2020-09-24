import { Component, OnInit } from '@angular/core';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  slides = [
    { image: "assets/img/baner1.jpg" }, 
    { image: "assets/img/baner2.jpg" }, 
    { image: "assets/img/baner3.jpg" }
  ]

  ngOnInit() { }

}
