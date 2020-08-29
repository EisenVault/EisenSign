/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {ListItem} from 'react-native-elements';

import base64 from 'react-native-base64';

const TaskDetails = ({route, navigation}) => {
  const taskItem = route.params;
  const [taskDocs, setTaskDocs] = useState([]);
  //Use Effect to fetch Documents (items) of workflow item in question
  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let instanceURL;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        instanceURL = await AsyncStorage.getItem('instanceURL');

        fetchTaskDocs(instanceURL, userToken);
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
    };

    bootstrapAsync();
  }, []);

  //Function to connect to API and fetch list of documents for the task at hand
  async function fetchTaskDocs(instanceURL, userToken) {
    //Base64 encode ticket
    var encodedTicket = base64.encode(userToken);
    var endPoint =
      instanceURL +
      '/alfresco/api/-default-/public/workflow/versions/1/tasks/' +
      taskItem.entry.id +
      '/items';

    try {
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
        setTaskDocs(json.list.entries);
      } else {
        console.log('Could not fetch documents ' + response.status);
        alert('Could not fetch documents.');
      }
    } catch (error) {
      console.log(error);
      alert('Could not fetch documents. Please check Server URL.');
    }
  }

  return (
    <View>
      {taskDocs.map((l, i) => (
        <ListItem
          key={i}
          title={l.entry.name}
          bottomDivider
          onPress={() => navigation.navigate('DocumentPreview', l)}
        />
      ))}
    </View>
  );
};

export default TaskDetails;
