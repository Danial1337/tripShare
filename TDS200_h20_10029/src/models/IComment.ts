interface IComment {
    id: number;
    text: string;
    user: {
        display_name: string;
    };
}

export default IComment;