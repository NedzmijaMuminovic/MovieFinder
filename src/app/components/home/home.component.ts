import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  tvShows: any[] = [];
  searchControl: FormControl = new FormControl();
  searchResults: any[] = [];
  showMovies: boolean = true;

  constructor(private tmdbService: TmdbService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('homeState');
      if (savedState) {
        const { showMovies, searchTerm } = JSON.parse(savedState);
        this.showMovies = showMovies;
        this.searchControl.setValue(searchTerm);

        if (searchTerm && searchTerm.length >= 3) {
          this.performSearch(searchTerm);
        }
      } else {
        this.showMovies = false;
      }
    } else {
      console.log('localStorage is not available');
    }

    this.loadContent();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm: string) => {
        this.performSearch(searchTerm);
      });
  }

  loadContent() {
    if (!this.searchControl.value || this.searchControl.value.length < 3) {
      if (this.showMovies) {
        this.tmdbService.getPopularMovies().subscribe((data: any) => {
          this.movies = data.results.slice(0, 10);
        });
      } else {
        this.tmdbService.getPopularTVShows().subscribe((data: any) => {
          this.tvShows = data.results.slice(0, 10);
        });
      }
    }
  }

  performSearch(searchTerm: string): void {
    if (searchTerm.length >= 3) {
      this.tmdbService.search(searchTerm, this.showMovies ? 'movie' : 'tv').subscribe((response: any) => {
        if (Array.isArray(response.results)) {
          this.searchResults = response.results;
        } else {
          this.searchResults = [];
        }
      });
    } else {
      this.searchResults = [];
      this.loadContent();
    }
  }

  toggleView(showMovies: boolean) {
    this.showMovies = showMovies;
    this.loadContent();

    if (this.searchControl.value && this.searchControl.value.length >= 3) {
      this.performSearch(this.searchControl.value);
    }
  }

  navigateToDetails(result: any) {
    let mediaType: string;
    const itemId = result.id;

    if (result.title) {
      mediaType = 'movie';
    } else if (result.name) {
      mediaType = 'tv';
    } else {
      console.error('Unable to determine media type:', result);
      return;
    }

    localStorage.setItem('homeState', JSON.stringify({
      showMovies: this.showMovies,
      searchTerm: this.searchControl.value
    }));

    this.router.navigate(['/details', mediaType, itemId]);
  }
}