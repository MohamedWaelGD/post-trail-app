import { Component, Input, Output, OnChanges, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CommentsService } from 'src/app/services/comments/comments.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  @Output() onDelete = new EventEmitter();
  @Input() post!: any;
  @Input() activeUser!: any;
  userOwnerPost!: any;
  commentInput: any = '';
  comments: any;

  constructor(private userService: UsersService, 
    private postService: PostsService, 
    private commentsService: CommentsService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.post)
    {
      this.userService.getUserWithUid(this.post.userId).subscribe(data => {
        this.userOwnerPost = data;
      })
      this.commentsService.getCommentsOfPostRealTime(this.post.id).subscribe(data => {
        this.comments = data;
      })
    }
  }

  deletePost() {
    this.toastr.info("Deleting post...", "Delete Post");
    this.postService.deletePost(this.post.id).subscribe(data => {
      this.toastr.success("Post successfully deleted", "Delete Post");
    })
    this.onDelete.emit();
  }

  addComment() {
    this.toastr.info("Adding comment...", "Add Comment");
    console.log(this.commentInput);
    if (this.commentInput !== '')
    {
      const newComment = {
        postId: this.post.id,
        userId: this.activeUser.uid,
        content: this.commentInput,
        // repliedComments: string[];
        // replyCommentId?: number;
        createdAt: Date.now()
      };
      this.commentsService.addComment(newComment).subscribe((result) => {
        this.toastr.success("Comment is added", "Add Comment");
        this.commentInput = '';
      })
    }
  }

  onChangeComment(event: any) {
    this.commentInput = event.target.value;
  }

  copyPost(uid: any) {
    this.toastr.info("You have copied the post's link, Share it with others");
    console.log(window.location.href);
    navigator.clipboard.writeText(window.location.origin + "/search/post/" + uid);
  }

  ngOnDestroy() { }
}
