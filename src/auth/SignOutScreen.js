import * as React from 'react';
import baseStyles from '../styles/baseStyles';
import {AuthContext} from './AuthContext';
import {View, Text, TouchableOpacity} from 'react-native';

const SignOutScreen = ({navigation}) => {
  const {signOut} = React.useContext(AuthContext);
  const logout = () => {
    signOut();
  };
  return (
    <View style={baseStyles.body}>
      <TouchableOpacity
        style={baseStyles.loginScreenButton}
        onPress={logout()}
        underlayColor="#fff">
        <Text style={baseStyles.loginText}>Tap Here to Confirm Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignOutScreen;
