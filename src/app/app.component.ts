import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {PostsService} from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  constructor(private http: HttpClient, private postsSercice: PostsService) {}

  ngOnInit() {
    this.getPosts();
  }

  private getPosts() {
    this.isFetching = true;
    this.postsSercice.fetchPosts().subscribe((postData) => {
      this.isFetching = false;
      this.loadedPosts = postData;
    }, (error: HttpErrorResponse) => {
      this.isFetching = false;
      console.log(error);
      this.error = error.error.error;
    });
  }

  onCreatePost(postData: Post) {
    this.postsSercice.createAndStorePost(postData.title, postData.content)
      .subscribe(
        () => {
          this.getPosts();
        }
      );
  }

  onFetchPosts() {
    this.getPosts();
  }

  onClearPosts() {
    this.postsSercice.clearPosts().subscribe(
      () => {
        this.getPosts();
      }
    );
  }
}
