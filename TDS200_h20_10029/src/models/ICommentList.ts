import IComment from "./IComment";

interface ICommentList {
    posts_by_pk: {
        comments: IComment[];
    }
}

export default ICommentList;