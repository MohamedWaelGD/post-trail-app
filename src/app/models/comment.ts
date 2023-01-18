export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    // repliedComments: string[];
    // replyCommentId?: number;
    createdAt: Date;
}
