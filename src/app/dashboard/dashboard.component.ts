import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.loginCheck();
    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });
      $(function(){
        $('#sidebar a').click(function(){
          $(this).parent().addClass('active').siblings().removeClass('active');
        });
      });
  });
  }

  logOut() {
    this.userService.logout();
  }

}
