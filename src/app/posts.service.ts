import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  url = 'https://ng-complete-guide-8e024.firebaseio.com/posts.json';
  error = new Subject<HttpErrorResponse>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content};

    return this.http.post<{ name: string }>(
      this.url,
      postData,
      {
        observe: 'response'
      }
    );
  }

  fetchPosts() {
    let searchParam = new HttpParams();
    searchParam = searchParam.append('print', 'pretty');
    searchParam = searchParam.append('Custom', 'key');
    return this.http.get<{ [key: string]: Post }>(
      this.url,
      {
        headers: new HttpHeaders({
          'Custom-headers': 'hello'
        }),
        params: searchParam
      }
    )
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({...responseData[key], id: key});
          }
        }
        return postsArray;
      }));
  }

  clearPosts() {
    return this.http.delete(this.url);
  }
}
