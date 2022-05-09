import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonPage, IonProgressBar, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { useCamera } from "@capacitor-community/react-hooks/camera"
import { useHistory } from 'react-router-dom';
import { CameraResultType, Geolocation } from "@capacitor/core";
import { auth, storage } from "../utils/nhost";
import Background  from "../components/Background";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { cameraOutline } from "ionicons/icons";
import styled from "styled-components";
import { renderToStaticMarkup } from "react-dom/server";


const background= encodeURIComponent(renderToStaticMarkup(<Background/>));

const INSERT_POST = gql`
mutation InsertPost($post: posts_insert_input!) {
    insert_posts_one(object:$post){
      title,
      user_id,
      description,
      image_filename,
      start_place,
      end_place,
      geocordinate
    }
  }
  `;

  //funksjon for opplastning av bilder til storage. Denne funksjonen gir oss også et objekt uploadprogress som lar oss definere en loading-bar
const useImageUpload = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const startUploading = async ({ base64string, filenameWithExtension }: { base64string: string, filenameWithExtension: string }) => {
        try {
            await storage.putString(`/public/${filenameWithExtension}`, base64string, "data_url", null, (pe: ProgressEvent) => {
                setUploadProgress((pe.loaded / pe.total) * 100);
            });
        } catch (e) {
            console.warn(e);
        }
    };
    return {
        uploadProgress: uploadProgress,
        startUploading: startUploading
    }
};

const NewPost = () => {
    const {startUploading, uploadProgress} = useImageUpload();
    const { photo, getPhoto } = useCamera();
    const [insertPostMutation] = useMutation(INSERT_POST);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [start_place, setStartPlace] = useState<string>("");
    const [end_place, setEndPlace] = useState<string>("");
    const [geoCordinate, setGeocordinate] = useState<string>("");
const [filename, setFilename] = useState<string>("");

    let history = useHistory();

    //funksjon for geolokasjoner
    const getLocation = async () => {
        try {
            const geoLatitude = (await Geolocation.getCurrentPosition()).coords.latitude;
            const geoLongitude = (await Geolocation.getCurrentPosition()).coords.longitude;
            const cordinateAsString = "Lat: " + geoLatitude.toString() + ", Lon: " + geoLongitude.toString();//omgjør number til string
            setGeocordinate(cordinateAsString);

            console.log(cordinateAsString);
        } catch (e) {
            console.log(e)
        }
    }

    //aktivere Kamera slik at det kan tas bilder. I denne funksjonen hentes også geolokasjoner.
    const triggerCamera = async () => {
        getLocation()
        await getPhoto({
            resultType: CameraResultType.DataUrl,
            quality: 20,
            allowEditing: false
        });
        setFilename(`${Date.now().toString()}.jpeg`)
    }

    

    const InsertPost = async () => {
        if (photo?.dataUrl){ //sjekk om bilde er tatt, og  start uploading hvis dette er true. alert hvis det ikke er tatt bilde.
            await startUploading({
                base64string: photo.dataUrl,
                filenameWithExtension: filename
            })
           }else {
               alert("Du må ta et bilde!")   
           }
              
            try {
                await insertPostMutation({ //Legger til post i DB
                    variables: {
                        post: {
                            title: title,
                            description: description,
                            image_filename: filename,
                            user_id: auth.getClaim('x-hasura-user-id'),
                            start_place: start_place,
                            end_place: end_place,
                            geocordinate: geoCordinate
                        }
                    }
                })
                
              
            } catch (e) {
                console.warn(e);
            }
            history.push("/home");
        }


    return (

        <IonPage>
            <IonHeader>
                <IonToolbarStyled>

                    <IonButtons slot={'start'}>
                        <IonBackButton defaultHref="/home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Legg til ny tur!</IonTitle>


                </IonToolbarStyled>
            </IonHeader>
            
            <IonContentStyled>
                <IonCardStyled>

                    <img src={photo?.dataUrl} />

                    <IonProgressBarStyled value={uploadProgress}/>
                    <IonListStyled>

                    <IonItemStyled>
                            <IonInput placeholder="Tittel" onIonInput={(e: any) => setTitle(e.target.value)} />
                        </IonItemStyled>

                        <IonItem>
                            <IonInputStyled placeholder="Beskrivelse" onIonInput={(e: any) => setDescription(e.target.value)} />
                        </IonItem>

                        <IonItemStyled>
                            <IonInputStyled placeholder="Hvor starter turen?" onIonInput={(e: any) => setStartPlace(e.target.value)} />
                        </IonItemStyled>

                        <IonItemStyled>
                            <IonInput placeholder="Hvor ender turen?" onIonInput={(e: any) => setEndPlace(e.target.value)} />
                        </IonItemStyled>

                    </IonListStyled>



                    <IonButton onClick={triggerCamera}><IonIcon icon={cameraOutline} /></IonButton>

                    <IonButton onClick={InsertPost}>Del Din tur med  omverdenen!</IonButton>
                   
                </IonCardStyled>
            </IonContentStyled>

        </IonPage>
    );
    }
    
const IonProgressBarStyled=styled(IonProgressBar)`
--background: green;
    --buffer-background: black;
    --progress-background: yellow;
`

const IonContentStyled = styled(IonContent)`
    --background: none;
    background: url("data:image/svg+xml,${background}") no-repeat fixed;
    background-size: cover;
`; 

const IonToolbarStyled = styled(IonToolbar)`
    --background: #DEB841;
    background-size: cover;
`

const IonCardStyled=styled(IonCard)`
background-color: #B6991A;
`;

const IonListStyled = styled(IonList)`
background-color: #B6991A;
color: #B6991A;
`;

const IonItemStyled = styled(IonItem)`
background-color: #B6991A;
color: #B6991A;
`;

const IonInputStyled=styled(IonInput)`

color: #B6991A;
`;

export default NewPost;