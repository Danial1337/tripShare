import React from "react";

import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonText, IonIcon, IonRow, IonGrid, IonCol, IonImg } from "@ionic/react";
import IPost from "../models/IPost";
import styled from "styled-components";
import {pin} from 'ionicons/icons'

const PostCard = ({ id, title, description, user, image_filename, start_place,end_place, geocordinate }: IPost) => {

  return (

    <IonCardStyled>

  <IonGrid> 
  <IonRow>
      <IonCol size="20">
      <IonIconStyled icon={pin}></IonIconStyled>
  <IonTextStyled> &bull; {geocordinate}</IonTextStyled>
      </IonCol>
  </IonRow>
</IonGrid>


<IonImgStyled src={`https://backend-gnr5daib.nhost.app/storage/o/public/${image_filename}`}> </IonImgStyled>
    
        
      <IonCardHeader>
        <IonCardSubtitleStyled>
  @ {user.display_name} &bull; XX likes
        </IonCardSubtitleStyled>
        
        <IonCardTitleStyled>
          {title}
        </IonCardTitleStyled>
        <IonCardSubtitleStyled2>
          {description}
        </IonCardSubtitleStyled2>
       
      </IonCardHeader>

      <IonCardContent>
       
       <IonListStyled>
         <IonItemStyled> Startpunkt:  {start_place}</IonItemStyled>
  <IonItemStyled>Endepunkt: {end_place}</IonItemStyled>
       </IonListStyled>
        
      </IonCardContent>
    </IonCardStyled>
  )
};

const IonIconStyled = styled(IonIcon)`
color: black;
`;

const IonImgStyled = styled(IonImg)`

`;

const IonItemStyled = styled(IonList)`
--background: none;
background-color: transparent;
color: #F3EAC2;
`; 

const IonTextStyled = styled(IonText)`
color: black;
`;

const IonCardTitleStyled = styled(IonCardTitle)`
color: white;
background-color: transparent;

`;

const IonCardSubtitleStyled=styled(IonCardSubtitle)`
color: white;
background-color: transparent;
`;

const IonCardSubtitleStyled2=styled(IonCardSubtitle)`
color: white;
background-color: transparent;

`;


const IonCardStyled = styled(IonCard)`
background-color: #B6991A;
`;

const IonListStyled = styled(IonList)`
--background: none;
background-color: transparent;
`; 
export default PostCard;