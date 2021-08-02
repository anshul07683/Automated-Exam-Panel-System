import { Component, OnInit } from '@angular/core';
import { UserService, UserItem } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: UserItem[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }


  deleteExaminer(id) {
    this.userService.deleteUser(id).subscribe(res => {
      console.log(res);
      this.getUsers();
    });
  }

  getUsers(){
    this.userService.getAllUsers().subscribe(res => this.users = res );
  }

}
