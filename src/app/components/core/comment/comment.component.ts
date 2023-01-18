import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CommentsService } from 'src/app/services/comments/comments.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @ViewChild('comment') comment: any;
  @Input() commentData: any;
  commentInput: any;
  commentUserOwner: any;
  activeUser!: any;

  constructor(private usersService: UsersService, 
    private commentsService: CommentsService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.usersService.currentUserProfile$.subscribe((user) => {
      this.activeUser = user;
    });
    this.usersService.getUserWithUid(this.commentData.data.userId).subscribe((user) => {
      this.commentUserOwner = user;
    })
  }

  ngOnDestroy() { }

  deleteComment() {
    this.toastr.info("Deleting comment...", "Delete Comment");
    this.commentsService.deleteComment(this.commentData.id).subscribe((result) => {
      this.toastr.success("Comment successfully deleted", "Delete Comment");
      //this.comment.nativeElement.style.display = 'none';
    })
  }
}
