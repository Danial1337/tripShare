import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { NhostAuthProvider, NhostApolloProvider } from "react-nhost";
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import { auth } from './utils/nhost';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import NewPost from './pages/NewPost';
import PrivateRoute from './components/PrivateRoute';



const App: React.FC = () => (
  <NhostAuthProvider auth={auth}>
    <NhostApolloProvider auth={auth} gqlEndpoint={'https://hasura-gnr5daib.nhost.app/v1/graphql'}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" component={Login} exact={true} />
            <PrivateRoute path="/home" component={Home} exact={true} />
            <PrivateRoute path="/newpost" component={NewPost} exact={true} /> 
            <Route path="/detail/:id" component={Detail} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </NhostApolloProvider>
  </NhostAuthProvider>
);

export default App;
