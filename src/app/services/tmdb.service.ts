import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = '59f270f929f661b5df4c110724fd38fb';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getDetails(id: string, type: 'movie' | 'tv'): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}&append_to_response=videos`);
  }

  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}`);
  }

  getPopularTVShows(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/top_rated?api_key=${this.apiKey}`);
  }

  search(query: string, type: 'movie' | 'tv'): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${type}?query=${query}&api_key=${this.apiKey}`);
  }
}
