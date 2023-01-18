import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SearchService } from 'src/app/services/search/search.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  @ViewChild('searchData') searchData : any;

  usersSearch!: any;
  inputSearch: any = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private searchSerivce: SearchService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    
  }

  ngOnDestroy() { }

  logout() {
    this.authService.logout().subscribe(()=>{
      this.router.navigate(['/auth/login']);
      this.toastr.success("You have logged out successfully");
    });
  }

  onSearch(searchInput: any) {
    this.inputSearch = searchInput.target.value;
    if (this.inputSearch == '')
    {
      this.searchData.nativeElement.style.display = 'none';
      return;
    }
    
    this.searchData.nativeElement.style.display = 'block';
    this.searchSerivce.searchUsers(this.inputSearch).subscribe(data => {
      this.usersSearch = data.slice(0, 5);
    })
  }

  onFocusSearch() {
    this.searchData.nativeElement.style.display = 'block';
  }
  
  onFocusoutSearch() {
    setTimeout(()=>{
      this.searchData.nativeElement.style.display = 'none';
    }, 200)
  }
}
