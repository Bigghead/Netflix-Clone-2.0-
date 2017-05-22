// import { AuthService } from './../Services/Authentication.service';
import { Keys } from '../../../keys';
import { MovieDataService } from '../../Services/moviedata.service';
import { Http } from '@angular/http';
import { Component, OnInit, Injectable, Input, ElementRef } from '@angular/core';

import { Flickity } from 'flickity';

declare var $: any;
@Component({
  selector: 'app-movie-row',
  templateUrl: './movie-row.component.html',
  styleUrls: ['./movie-row.component.css']
})

@Injectable()
export class MovieRowComponent implements OnInit {

  constructor(private http: Http, 
              private movieData: MovieDataService, 
              private el: ElementRef) {

  }

  @Input() movieObj: {
    heading: string,
    type: string,
    url: string,
    fetchMethodName: any
  }

  movies: any[];
  imageUrl = 'https://image.tmdb.org/t/p/w640';

  
  ngOnInit() {

    this.fetchData();
  }


  fetchData() {
    let type = this.movieObj.type;
    let dataFetched = this.movieData[type];
    console.log(this.movieData.allMovies);
    
    // First time load, get data from an outside api
    if (!dataFetched) {
      this.http.get(this.movieObj.url)
        .map(res => res.json())
        .map(res => {

          res.results.forEach(movie => {
            if (!movie.type) {
              movie.type = this.movieObj.type;

            }
          })
          return res;
        })
        .subscribe(
        (res) => {
          this.movies = res.results;
          this.movieData[this.movieObj.type] = true;

          const newArr = this.movieData.allMovies.concat(this.movies);
          this.movieData.allMovies = newArr;
          this.movieData.allDataFetched.next(true);

          setTimeout(this.loadFlickity);
          }
        )

    } else {

      this.movies = this.movieObj.fetchMethodName;
      setTimeout(this.loadFlickity);

    }
  }

  loadFlickity() {
    const el = document.querySelector('.carousel');
    const carouselOn = new Flickity(el, {
      // contain: true,
      freeScroll: true,
      wrapAround: true,
      initialIndex: 0
    });
  }

  // logIn(){
  //   this.authService.login();
  // }

}
