import {IonSpinner, IonCard, IonContent, IonFabButton, IonIcon, IonInput, IonItem, IonList, IonPage, useIonViewWillEnter, IonToast } from "@ionic/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../utils/nhost";
import styled from "styled-components";
import {renderToStaticMarkup} from "react-dom/server";
import {arrowForwardCircle, personAddOutline} from "ionicons/icons";
import WaveBlob from "../components/WaveBlob";

const waveBlobString = encodeURIComponent(renderToStaticMarkup(<WaveBlob/>));

const Login = () => {
  console.log(waveBlobString);
  let history = useHistory();

  /*Regner med at placeholderne under er selvforklarende :)*/ 
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const [showErrorToast2, setShowErrorToast2] = useState<boolean>(false);
  const [showErrorToastFailRegistry, setShowErrorToastFailRegistry] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    if(auth.isAuthenticated()) {
      history.replace("/home");
    }
  });

  //Sjekke om det brukeren taster inn er en gyldig bruker/passord
  const authenticateUser = async () => {
    setIsAuthenticating(true);
    try {
      await auth.login(emailAddress, password);
      setIsAuthenticating(false);
      history.replace("/home");
    } catch(exception) {
      console.error(exception);
      setIsAuthenticating(false);
      setShowErrorToast(true);
    }
  }

//registrerer bruker ved hjelp av inntastet data og auth.register
  const registerUser = async () => {
try{
await auth.register(emailAddress,password);
setShowErrorToast2(true);
} catch(exception) 
{
  console.log(exception)
setShowErrorToastFailRegistry(true);
}
  }

  return (
    <IonPage>
      <IonContentStyled>
        <CenterContainer>
          <PageTitle> TripShare</PageTitle>
        <LoginCard>
          <IonList>
            <IonItem>
              <IonInput placeholder="Epostadresse" onIonInput={(e: any) => setEmailAddress(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonInput placeholder="Passord" type="password" onIonInput={(e: any) => setPassword(e.target.value)} />
            </IonItem>
            
          </IonList>
        </LoginCard>
          <LoginButton onClick={authenticateUser}>
            {
              isAuthenticating ? 
              <IonSpinner name="crescent"/> : 
              <IonIcon icon={arrowForwardCircle}/>
            }
          </LoginButton>
         
         <LoginButton onClick={registerUser}>
           <IonIcon icon={personAddOutline}></IonIcon>
         </LoginButton>

          </CenterContainer>

          <IonToast
        isOpen={showErrorToast}
        onDidDismiss={() => setShowErrorToast(false)}
        message="Feil Brukernavn eller Passord!!"
        duration={3000}
        color="light"
      />

<IonToast
isOpen={showErrorToast2}
onDidDismiss= {()=> setShowErrorToast2(false)}
message=  {"Bruker opprettet: " + emailAddress}
duration={3000}
color= "light"
/>

<IonToast
isOpen={showErrorToastFailRegistry}
onDidDismiss= {() => setShowErrorToastFailRegistry(false)}
message ={"Bruker eksisterer allerede, eller Feil format på epostadressen!"}
duration={3000}
color= "danger"
/>


      </IonContentStyled>
    </IonPage>
  );
};

const LoginCard = styled(IonCard)`
padding: 20px;
`;

const IonContentStyled = styled(IonContent)`
--background: none;
background: url("data:image/svg+xml,${waveBlobString}") no-repeat fixed;
background-size: cover
`;

const PageTitle = styled.h1`
font-size: 3em;
align-self: center;
color: #37323E;
font-family: 'Quicksand', sans-serif;
`;

const LoginButton = styled(IonFabButton)`
--background: #37323E;
align-self: center;
`;

const CenterContainer = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
height: 100%;
`;

export default Login; 