import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) {
  }

  getConfigJson(url: any, configId: any): any {
    return this.http.get(url + '/' + configId);
  }

  getUrlOptions(url: any): any {
    return this.http.get(url);
  }

  postLead(body: any): any {
    return this.http.post('https://preschoolsnearme.com/api/leads', body);
  }

  editLead(body: any): any {
    return this.http.patch('https://preschoolsnearme.com/api/leads', body);
  }

  apiPost(body: any, url: any): any {
    return this.http.post(url, body);
  }

  apiPatch(body: any, url: any): any {
    return this.http.patch(url, body);
  }

  uploadFile(file: any, token: string) {
    let headers = new HttpHeaders().set('Authorization', 'bearer ' + token);
    return this.http.post('https://be.platform.simplifii.com/api/v1/fileupload', file, {headers: headers});
  }
}
