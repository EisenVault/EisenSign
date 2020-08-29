import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Header from '../components/shared/Header';
import InboxScreen from '../components/inbox/InboxScreen';
import TaskDetails from '../components/inbox/TaskDetails';
import DocumentPreview from '../components/documentComponents/DocumentPreview';
import AnnotateDocument from '../components/documentComponents/AnnotateDocument';
import TaskContextProvider from '../components/inbox/TaskContext';
import {AuthContext} from '../auth/AuthContext';
import {useContext} from 'react';
import LoginScreen from '../auth/LoginScreen';
import SignOutScreen from '../auth/SignOutScreen';

// home stack navigator screens
const Stack = createStackNavigator();

const HomeStack = () => {
  const {authState} = useContext(AuthContext);
  //console.log('Reached start of Home Stack. Auth State is:');
  //console.log(authState);

  var returnString = '';
  if (authState.userToken != null) {
    //console.log('Trying to display inbox screen');
    returnString = (
      <TaskContextProvider>
        <Stack.Navigator
          initialRouteName="Inbox"
          screenOptions={{
            defaultNavigationOptions: {
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            },
          }}>
          <Stack.Screen
            name="Inbox"
            component={InboxScreen}
            options={({navigation}) => ({
              headerTitle: () => (
                <Header title="Task Inbox" navigation={navigation} />
              ),
            })}
          />
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetails}
            options={{title: 'Task Details'}}
          />
          <Stack.Screen
            name="DocumentPreview"
            component={DocumentPreview}
            options={{title: 'Document Preview'}}
          />
          <Stack.Screen
            name="AnnotateDocument"
            component={AnnotateDocument}
            options={{title: 'Add Signature'}}
          />
          <Stack.Screen
            name="Logout"
            component={SignOutScreen}
            options={{title: 'Logout'}}
          />
        </Stack.Navigator>
      </TaskContextProvider>
    );
  } else {
    returnString = (
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          },
        }}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
      </Stack.Navigator>
    );
  }

  return returnString;
};

export default HomeStack;
