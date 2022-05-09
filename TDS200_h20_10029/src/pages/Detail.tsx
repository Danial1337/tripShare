import React, { useState } from "react";
import { IonToolbar, IonPage, IonHeader, IonTitle, IonContent, IonButtons, IonBackButton, IonLabel, IonCard, IonList, IonItem, IonButton, IonIcon, IonInput } from "@ionic/react";
import PostCard from "../components/PostCard";
import IPost from "../models/IPost";
import gql from "graphql-tag";
import { useMutation, useSubscription } from "@apollo/client";
import ICommentList from "../models/ICommentList";
import { auth } from "../utils/nhost";
import { addCircleOutline, trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import Background from "../components/Background"
import '../theme/littcss.css';
import { renderToStaticMarkup } from "react-dom/server";
import styled from "styled-components";

const background = encodeURIComponent(renderToStaticMarkup(<Background/>));

const GET_COMMENTS = gql`
  subscription getCommentsByPostID($post_id: Int!) {
    posts_by_pk(id: $post_id) {
      comments {
        text
        user {
          display_name
        }
      }
    }
  } 
`;


const INSERT_COMMENT = gql`
mutation InsertComment($comment: comments_insert_input!){
  insert_comments_one(object: $comment){
    user_id,
    post_id,
    text
  }
}
`
const DELETE_POST = gql`
mutation DeletePost($post_id: Int!){
  delete_comments(
    where: {
      post_id: {
        _eq: $post_id
      }
    }
  ){
    affected_rows
  }
  delete_posts_by_pk(
    id: $post_id
  ) { id }
}
`;

const Detail = (props: any) => {
  let history = useHistory();
  const post: IPost = props.location?.state?.post;

  const [comment, setComment] = useState<string>("");
  const [insertCommentMutation] = useMutation(INSERT_COMMENT);
  const [deletePostMutation] = useMutation(DELETE_POST);


  const { loading, data } = useSubscription<ICommentList>(GET_COMMENTS, {
    variables: {
      post_id: post?.id
    },
    fetchPolicy: "no-cache"
  });

  if (!post) {
    return <div></div>;
  }

  if (loading) { return <IonLabel>Laster kommentarer</IonLabel> }

  const insertComment = async () => {
    try {
      await insertCommentMutation({
        variables: {
          comment: {
            post_id: post?.id,
            user_id: auth.getClaim('x-hasura-user-id'),
            text: comment
          }
        }
      })
    } catch (e) {
      console.log((e))
    }
  }


  const deletePost = async () => {
    try {
      await deletePostMutation({
        variables: {
          post_id: post.id
        }
      })
      alert(`Slett id ${post.id}`)
//history.replace funker ikke særlig i async funksjoner.
      history.push("/home")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>

          <IonTitle>{post.title}</IonTitle>

          {
            post.user.id === auth.getClaim('x-hasura-user-id') &&
            <IonButtons slot="end">
              <IonButton onClick={deletePost}>
                <IonIcon color="danger" icon={trashBinOutline} />
              </IonButton>
            </IonButtons>
          }


        </IonToolbar>
      </IonHeader>
      <IonContentStyled>
        <PostCard {...post} />
        <IonCardStyled>
          <IonListStyled>
            {
              data?.posts_by_pk.comments?.map((comment, i) => (
                <IonItemStyled key={i}>
                  <IonLabel>
                    <h2>{comment.user.display_name}</h2>
                    <p>{comment.text}</p>
                  </IonLabel>
                </IonItemStyled>
              ))}
          </IonListStyled>
        </IonCardStyled>

        <IonList>
          <IonItem>
            <IonInput placeholder="Skriv en kommentar...." onIonInput={(e: any) => setComment(e.target.value)} />
            <IonButton onClick={insertComment}>
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          </IonItem>
        </IonList>



      </IonContentStyled>
    </IonPage>
  )
};

const IonContentStyled = styled(IonContent)`
    --background: none;
    background: url("data:image/svg+xml,${background}") no-repeat fixed;

     background-size: cover;
`; 

const IonListStyled = styled(IonList)`
background-color: #B6991A;
color: #B6991A;
`;

const IonItemStyled = styled(IonItem)`

color: #B6991A;
`;



const IonCardStyled = styled(IonCard)`
background-color: #B6991A;
color: #B6991A;`;
export default Detail;

