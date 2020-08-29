/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import baseStyles from '../../styles/baseStyles';
import React, {useState, useEffect, useContext} from 'react';
import {WebView} from 'react-native-webview';
import {AuthContext} from '../../auth/AuthContext';
import {View, Text, TouchableOpacity} from 'react-native';
import {encode as btoa} from 'base-64';

const DocumentPreview = ({route, navigation}) => {
  const attachedItem = route.params;
  const [isUserAllowedToSign, setIsUserAllowedToSign] = useState(false);
  const [isUserAllowedToView, setIsUserAllowedToView] = useState(true);
  const [nodeDetails, setNodeDetails] = useState(false);
  const {authState} = useContext(AuthContext);

  async function getNodeDetails(instanceURL, userToken) {
    //Base64 encode ticket
    var encodedTicket = btoa(userToken);

    var endPoint =
      instanceURL +
      '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' +
      attachedItem.entry.id +
      '?include=allowableOperations';

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
        setNodeDetails(json.entry);
        setIsUserAllowedToView(true);

        //check if user is allowed to edit

        if (
          typeof json.entry.allowableOperations != 'undefined' &&
          json.entry.allowableOperations.includes('update') &&
          json.entry.content.mimeType == 'application/pdf'
        ) {
          setIsUserAllowedToSign(true);
        } else {
          setIsUserAllowedToSign(false);
        }
        //console.log(json);
      } else {
        console.log('Could not fetch document ' + response.status);

        setIsUserAllowedToView(false);
        setIsUserAllowedToSign(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    try {
      getNodeDetails(authState.instanceURL, authState.userToken);
    } catch (e) {
      // Restoring token failed
      console.log(e);
    }
  };
  useEffect(() => {
    bootstrapAsync();

    //console.log('isUserAllowedToView: ' + isUserAllowedToView);
    //console.log('Global Instance URL :' + authState.instanceURL);
    //console.log('Ticket' + authState.userToken);
  }, []);

  buildPreviewSource = () => {
    var sourceUrl =
      authState.instanceURL +
      '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' +
      attachedItem.entry.id +
      '/content';
    var requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(authState.userToken),
    };

    //console.log('URL for downloading is ' + sourceUrl);

    var source = {
      uri: sourceUrl,
      headers: requestHeaders,
      nodeId: attachedItem.entry.id,
    };

    return source;
  };

  if (nodeDetails.content != undefined) {
    return (
      <View>
        <View style={baseStyles.pdf}>
          <WebView startInLoadingState={true} source={buildPreviewSource()} />
        </View>

        {isUserAllowedToSign && (
          <TouchableOpacity
            style={baseStyles.loginScreenButton}
            underlayColor="#fff"
            onPress={() =>
              navigation.navigate('AnnotateDocument', buildPreviewSource())
            }>
            <Text style={baseStyles.loginText}>Add Signature</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return <Text>Could not fetch node details</Text>;
  }
};

export default DocumentPreview;
