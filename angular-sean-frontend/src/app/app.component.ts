import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private sanatizer: DomSanitizer
  ) {}

  ngOnInit() {
  }

  sanatizeImageUrl(imagePath: string): SafeUrl {
    return this.sanatizer.bypassSecurityTrustUrl(imagePath);
  }

}
