import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class NotificationService {

  constructor(private http: Http) { }


  sendMail(data){
    return this.http.post('http://localhost:3000/notify/send_mail', data)
    .map(res => {
      return res.json();
    }
    )
  }
}
