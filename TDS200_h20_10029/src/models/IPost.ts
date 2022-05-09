import IComment from "./IComment";

interface IPost {
    id: number;
    title: string;
    description: string;
    image_filename: string;
    start_place: string;
    end_place: string;
    geocordinate: string;
    user: {
        id: string;
        display_name: string;
    };
    comments?: IComment[];
    //likes: number;
};

export default IPost;