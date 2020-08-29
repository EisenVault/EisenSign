/* eslint-disable no-alert */
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import base64 from 'react-native-base64';
export const TaskContext = createContext();

const TaskContextProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);

  //Use Effect to fetch pending workflows from DMS and populate in state
  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let instanceURL;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        instanceURL = await AsyncStorage.getItem('instanceURL');

        fetchTasks(instanceURL, userToken);
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
    };

    bootstrapAsync();
  }, []);

  //Function to connect to API and fetch list of open tasks for logged in user
  async function fetchTasks(instanceURL, userToken) {
    //Base64 encode ticket
    var encodedTicket = base64.encode(userToken);
    var endPoint =
      instanceURL + '/alfresco/api/-default-/public/workflow/versions/1/tasks';

    try {
      console.log('Trying to fetch tasks');
      let response = await fetch(endPoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + encodedTicket,
        },
      });
      if (response.ok) {
        let json = await response.json();
        setTasks(json.list.entries);
      } else {
        console.log('Could not fetch workflows ' + response.status);
        alert('Could not fetch workflows.');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      alert('Could not fetch workflows. Please check Server URL.');
    }
  }

  return (
    <TaskContext.Provider value={{tasks}}>{children}</TaskContext.Provider>
  );
};

export default TaskContextProvider;
