import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  title: string = '';
  description: string = '';
  coverImageUrl: string = '';
  trailerUrl: SafeResourceUrl = '';

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const type = params['type'];

      this.tmdbService.getDetails(id, type).subscribe(data => {
        this.title = data.title || data.name;
        this.description = data.overview;
        this.coverImageUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

        if (data.videos && data.videos.results.length > 0) {
          const trailer = data.videos.results.find((video: any) => video.type === 'Trailer');
          if (trailer) {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${trailer.key}`);
          }
        } else {
          console.log('No videos available.');
        }
      });
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}