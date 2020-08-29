/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import base64 from 'react-native-base64';
export const AuthContext = createContext();

const AuthContextProvider = ({children}) => {
  const [authState, setAuthState] = useState([
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userId: null,
      userFirstName: null,
      userLastName: null,
      instanceURL: null,
    },
  ]);
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let instanceURL;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        instanceURL = await AsyncStorage.getItem('instanceURL');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      restoreToken(userToken, instanceURL);
    };

    bootstrapAsync();
  }, []);

  const signIn = async (data) => {
    // In a production app, we need to send some data (usually username, password) to server and get a token
    // We will also need to handle errors if sign in failed
    // After getting token, we need to persist the token using `AsyncStorage`
    // In the example, we'll use a dummy token

    var authToken = null;
    const ticketEndPoint =
      '/alfresco/api/-default-/public/authentication/versions/1/tickets';
    var fullTicketURL = data.instanceURL + ticketEndPoint;

    try {
      let response = await fetch(fullTicketURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.username,
          password: data.password,
        }),
      });
      if (response.ok) {
        let json = await response.json();
        authToken = json.entry.id;
        AsyncStorage.setItem('userToken', authToken);
        AsyncStorage.setItem('instanceURL', data.instanceURL);
      } else {
        console.log('Login has failed with code ' + response.status);
        alert('Login Failed. Please check Username and Password.');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      alert('Login Failed. Please check Server URL.');
    }

    restoreUserDetailsFromAlfresco(authToken, data.instanceURL);
  };

  //SignOut Functionalitu
  const signOut = () => {
    setAuthState({
      userToken: null,
      isSignout: true,
      isLoading: false,
      userId: null,
      userFirstName: null,
      userLastName: null,
      instanceURL: null,
    });
    try {
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('instanceURL');
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  //Restoring user token
  const restoreToken = (token, instanceURL) => {
    //Get user details from Alfresco
    if (token) {
      restoreUserDetailsFromAlfresco(token, instanceURL);
    }
  };

  async function restoreUserDetailsFromAlfresco(token, instanceURL) {
    //Base64 encode ticket
    var encodedTicket = base64.encode(token);
    //Build full endpoint url
    var peopleDetailsEndpoint =
      instanceURL +
      '/alfresco/api/-default-/public/alfresco/versions/1/people/-me-';

    try {
      let response = await fetch(peopleDetailsEndpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + encodedTicket,
        },
      });
      if (response.ok) {
        let json = await response.json();

        setAuthState({
          isSignout: false,
          userToken: token,
          isLoading: false,
          userId: json.entry.id,
          userFirstName: json.entry.firstName,
          userlastName: json.entry.lastName,
          instanceURL: instanceURL,
        });
      } else {
        console.log('Could not fetch user details ' + response.status);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  return (
    <AuthContext.Provider value={{authState, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
