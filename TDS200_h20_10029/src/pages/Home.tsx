import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons, IonLabel, IonIcon } from '@ionic/react';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import IPostList from '../models/IPostList';
import { exitOutline, addCircleOutline } from 'ionicons/icons'
import { auth } from '../utils/nhost';
import Background from '../components/Background';
import { renderToStaticMarkup } from 'react-dom/server';
import styled from 'styled-components';

const background = encodeURIComponent(renderToStaticMarkup(<Background/>));

//Subscription for å hente ut data fra DB
const GET_POSTS = gql`
  subscription {
    posts {
      id
      title
      description
      image_filename
      start_place
      end_place
      geocordinate
      user {
        id
        display_name
      }
    }
  }
`;

const Home = () => {
  let history = useHistory();

  const { loading, data } = useSubscription<IPostList>(GET_POSTS);
//Hvis data'en fortsatt loader ønsker vi å vise "laster...."
  if (loading) {
    return <IonLabel>Laster...</IonLabel>
  }

  console.log(data);
//Veldig enkel logout ved hjelp av auth.logut())
  const logout = async () => {
    try {
      await auth.logout();
      history.replace("/login");
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbarStyled>

          <IonButtons slot={'start'}>
            <IonButton onClick={logout}>
              <IonIcon icon={exitOutline}></IonIcon>
            </IonButton>
            
          </IonButtons>

          <IonTitle>TripShare</IonTitle>

          <IonButtons slot={'end'}>
            <IonButton routerLink="/newpost">
              <IonIcon src={addCircleOutline}/>
            </IonButton>
          
          </IonButtons>

        </IonToolbarStyled>
      </IonHeader>
      <IonContentStyled fullscreen>
        {
          data?.posts.map(post => (
            <Link style={{ textDecoration: 'none' }} key={post.id} to={{
              pathname: `/detail/${post.id}`,
              state: {
                post
              }
            }}>
              <PostCard {...post} />
            </Link>
          ))
        }
      </IonContentStyled>
    </IonPage>
  );
};


const IonContentStyled = styled(IonContent)`
    --background: none;
    background: url("data:image/svg+xml,${background}") no-repeat fixed;

     background-size: cover;
`; 

const IonToolbarStyled = styled(IonToolbar)`
--background: #DEB841;
background-size: cover;
`;

export default Home;
