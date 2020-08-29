/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, {useEffect, useState, useContext} from 'react';
import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../../auth/AuthContext';
import baseStyles from '../../styles/baseStyles';
import Pdf from 'react-native-pdf';
import {PDFDocument} from 'pdf-lib';
import {encode as btoa, decode as atob} from 'base-64';

const RNFS = require('react-native-fs');
//const {config, fs} = RNFetchBlob;

// eslint-disable-next-line no-undef
export default AnnotateDocument = ({route, navigation}) => {
  const source = route.params;
  const [filePath, setFilePath] = useState(
    `${RNFS.DocumentDirectoryPath}/signatures/document.pdf`,
  );
  const [signatureImagePath, setSignatureImagePath] = useState(
    `${RNFS.DocumentDirectoryPath}/signatures/signature.png`,
  );
  const [isFileDownloaded, setIsFileDownloaded] = useState(false);
  const [isSignatureDownloaded, setIsSignatureDownloaded] = useState(null);
  const {authState} = useContext(AuthContext);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [signatureBase64, setSignatureBase64] = useState(null);
  const [signatureArrayBuffer, setSignatureArrayBuffer] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  const [newPdfSaved, setNewPdfSaved] = useState(false);
  const [newPdfPath, setNewPdfPath] = useState(null);
  const [pdfEditMode, setPdfEditMode] = useState(false);

  const _base64ToArrayBuffer = (base64) => {
    // console.log('Trying to decode base64 file: ' + base64);
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };
  const _uint8ToBase64 = (u8Arr) => {
    const CHUNK_SIZE = 0x8000; //arbitrary number
    let index = 0;
    const length = u8Arr.length;
    let result = '';
    let slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  };

  const createSignatureFolder = () => {
    console.log('In create signature function');
    //if (!RNFS.exists(`${RNFS.DocumentDirectoryPath}/signatures/`)) {
    console.log("Folder doesn't exist. Trying to create");
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/signatures`).catch((err) => {
      console.error(err);
    });
    //}
  };

  const deleteSignatureFolder = () => {
    if (RNFS.exists(`${RNFS.DocumentDirectoryPath}/signatures/`)) {
      RNFS.unlink(`${RNFS.DocumentDirectoryPath}/signatures`).catch((err) => {
        console.error(err);
      });
    }
  };
  useEffect(() => {
    createSignatureFolder();
    if (!isFileDownloaded) {
      downloadFile();
    }

    if (!isSignatureDownloaded) {
      downloadSignaturePNG();
    }
    if (signatureBase64) {
      setSignatureArrayBuffer(_base64ToArrayBuffer(signatureBase64));
    }
    if (newPdfSaved) {
      setFilePath(newPdfPath);
      setPdfArrayBuffer(_base64ToArrayBuffer(pdfBase64));
    }
    handleSignature();
    console.log('filePath', filePath);
  }, [filePath, signatureBase64, newPdfSaved]);

  async function downloadSignaturePNG() {
    // Use Alfresco APIs to download file eisenflow-signature.png
    // This file can be stored anywhere in the repository. Node ID has to be retrieved via Search
    // Sample query is: https://eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes?term=eisenflow-signature.png&maxItems=1
    // Node ID will be at list.entries.entry.id in the response JSON
    // After we get node ID, we can use API to fetch the node

    //Base64 encode ticket
    var encodedTicket = btoa(authState.userToken);

    var endPoint =
      authState.instanceURL +
      '/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes?term=eisenflow-signature.png&maxItems=1';

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

        //check if user is allowed to edit

        if (
          typeof json.list.entries[0].entry.id !== 'undefined' &&
          json.list.entries[0].entry.name.includes('eisenflow-signature.png') &&
          json.list.entries[0].entry.content.mimeType === 'image/png'
        ) {
          console.log(json.list.entries[0].entry.content.mimeType);
          var signatureImageUDID = json.list.entries[0].entry.id;
          //Build URL for fetching Image file from DMS using RNFS
          var signatureImageURL =
            authState.instanceURL +
            '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' +
            signatureImageUDID +
            '/content?attachment=false';

          console.log('___downloadImage -> Start');

          RNFS.downloadFile({
            fromUrl: signatureImageURL,
            toFile: signatureImagePath,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + encodedTicket,
            },
          }).promise.then((res) => {
            //console.log('___downloadPNG -> Signature File downloaded', res);
            setIsSignatureDownloaded(true);
            readSignature();
          });
        } else {
          alert(
            'Valid Signature Image Not Found. Image should be PNG and named eisenflow-signature.png',
          );
        }
      } else {
        console.error('Could not fetch signature ' + response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const readFile = () => {
    RNFS.readFile(filePath, 'base64')
      .then((contents) => {
        setPdfBase64(contents);
        setPdfArrayBuffer(_base64ToArrayBuffer(contents));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const downloadFile = () => {
    console.log('___downloadFile -> Start');

    RNFS.downloadFile({
      fromUrl: source.uri,
      toFile: filePath,
      headers: source.headers,
    }).promise.then((res) => {
      //console.log('___downloadFile -> File downloaded', res);
      setIsFileDownloaded(true);
      readFile();
    });
  };
  const readSignature = () => {
    RNFS.readFile(signatureImagePath, 'base64')
      .then((contents) => {
        setSignatureBase64(contents);
        setSignatureArrayBuffer(_base64ToArrayBuffer(contents));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignature = (signature) => {
    //setSignatureBase64(signature.replace("data:image/png;base64,", ""));
    //setSignaturePad(false);
    setPdfEditMode(true);
  };

  /*
  page = which page of PDF are we adding signature to. This starts at 1.
  x,y = coordinates where signature is to be inserted
  */
  const handleSingleTap = async (page, x, y) => {
    console.log('Handling Tap ************');
    if (pdfEditMode) {
      setNewPdfSaved(false);
      setFilePath(null);
      setPdfEditMode(false);
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const pages = pdfDoc.getPages();
      const pageToSign = pages[page - 1];
      // The meat
      const signatureImage = await pdfDoc.embedPng(signatureArrayBuffer);
      if (Platform.OS === 'ios') {
        pageToSign.drawImage(signatureImage, {
          x: (pageWidth * (x - 12)) / Dimensions.get('window').width,
          y: pageHeight - (pageHeight * (y + 12)) / 540,
          width: 100,
          height: 100,
        });
      } else {
        pageToSign.drawImage(signatureImage, {
          x: (pageToSign.getWidth() * x) / pageWidth,
          y:
            pageToSign.getHeight() -
            (pageToSign.getHeight() * y) / pageHeight -
            25,
          width: 100,
          height: 100,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = _uint8ToBase64(pdfBytes);
      const path = `${
        RNFS.DocumentDirectoryPath
      }/signatures/react-native_signed_${Date.now()}.pdf`;
      console.log('path', path);

      RNFS.writeFile(path, pdfBase64, 'base64')
        .then((success) => {
          setNewPdfPath(path);
          setNewPdfSaved(true);
          setPdfBase64(pdfBase64);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const saveToDMS = () => {
    //Base64 encode ticket
    var encodedTicket = btoa(authState.userToken);

    var endPoint =
      authState.instanceURL +
      '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' +
      source.nodeId +
      '/content?majorVersion=false&comment=Signature Added';

    //ArrayBuffer of PDF has to go as body of request

    fetch(endPoint, {
      method: 'PUT',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/pdf',
        Authorization: 'Basic ' + encodedTicket,
      },
      body: pdfArrayBuffer,
    })
      .then((result) => {
        if (result.ok) {
          console.log(result);
          clearLocalStorageAndGoBack();
        } else {
          console.error(result);
          alert('Could not save PDF. Please try again.');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Could not save PDF. Please try again.');
      });
  };
  const clearLocalStorageAndGoBack = () => {
    console.log('clearLocalStorageAndGoBack running');
    deleteSignatureFolder();
    navigation.pop();
  };

  return (
    <View>
      {isFileDownloaded && isSignatureDownloaded ? (
        <View>
          {filePath ? (
            <View>
              <Pdf
                minScale={1.0}
                maxScale={1.0}
                scale={1.0}
                spacing={0}
                fitPolicy={0}
                enablePaging={true}
                source={{uri: filePath}}
                usePDFKit={false}
                onLoadComplete={(numberOfPages, filePath, {width, height}) => {
                  setPageWidth(width);
                  setPageHeight(height);
                }}
                onPageSingleTap={(page, x, y) => {
                  handleSingleTap(page, x, y);
                }}
                style={styles.pdf}
              />
            </View>
          ) : (
            <View style={styles.button}>
              <Text style={styles.buttonText}>Saving PDF File...</Text>
            </View>
          )}
          {pdfEditMode ? (
            <View>
              <View style={baseStyles.message}>
                <Text>* EDIT MODE *</Text>
                <Text>Touch where you want to place the signature</Text>
              </View>
              <View>
                <TouchableOpacity onPress={saveToDMS} style={baseStyles.button}>
                  <Text style={baseStyles.buttonText}>Save to DMS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={clearLocalStorageAndGoBack}
                  style={baseStyles.button}>
                  <Text style={baseStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            filePath && (
              <View>
                <TouchableOpacity
                  onPress={this.getSignature}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Sign Document</Text>
                </TouchableOpacity>
                <View>
                  <Image
                    source={{
                      uri:
                        'http://www.bouncingshield.com/icons/icon-512x512.png',
                    }}
                    style={{width: 40, height: 40, alignSelf: 'center'}}
                  />
                  <Text style={styles.headerText}>bouncingshield.com</Text>
                </View>
              </View>
            )
          )}
        </View>
      ) : (
        <Text>
          Signature file not found. Please add a file called
          eisenflow-signature.png in the DMS.
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
    width: Dimensions.get('window').width,
    height: 540,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#508DBC',
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#DAFFFF',
  },
  message: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF88C',
  },
});
