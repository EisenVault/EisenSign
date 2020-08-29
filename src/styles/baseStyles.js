import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height - 200;
const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    resizeMode: 'contain',
    height: 80,
  },
  signFlowSubtitle: {
    color: '#3f403e',
    fontSize: 30,
    fontStyle: 'italic',
  },
  mast: {
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    height: 200,
    flex: 2,
  },
  loginView: {
    flexDirection: 'column',
    flex: 3,
    width: '100%',
  },

  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#f4511e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width: 343,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    height: 44,
    width: 343,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingLeft: 10,
    color: 'black',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  inboxList: {
    flex: 1,
    padding: 0,
    width: '100%',
  },
  inboxListItem: {
    width: '100%',
    color: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    color: '#508DBC',
    fontSize: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  pdf: {
    width: windowWidth,
    height: windowHeight,
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#f4511e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  message: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF88C',
  },
});
