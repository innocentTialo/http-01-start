import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {PostsService} from './posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private http: HttpClient, private postsSercice: PostsService) {}

  ngOnInit() {
    this.errorSubscription = this.postsSercice.error.subscribe(
      error => {
        this.error = error.message;
      }
    );
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
        (response) => {
          console.log(response);
          this.getPosts();
        }, error => {
          this.postsSercice.error.next(error);
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

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }
}
