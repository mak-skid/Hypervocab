import React, { useEffect } from 'react';
import { ShareMenuReactView } from 'react-native-share-menu';

/*
const Button = ({onPress, title, style}) => (
  <Pressable onPress={onPress}>
    <Text style={[{fontSize: 16, margin: 16}, style]}>{title}</Text>
  </Pressable>
)

const Share = () => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    ShareMenuReactView.data().then(({mimeType, data}) => {
      setSharedData(data);
      setSharedMimeType(mimeType);    
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
          style={styles.destructive}
        />
        <Button
          title={opening ? "Opening..." : 'Open'}
          onPress={() => {
            setOpening(true);
            ShareMenuReactView.continueInApp()
          }}
          disabled={opening}
          style={opening ? styles.sending : styles.send}
        />
      </View>
      {sharedMimeType === 'text/plain' && <Text style={{color:'white'}}>{sharedData}</Text>}
      <SearchBar 
        placeholder="Look up a word (Type exactly)" 
        onChangeText={setSharedData} 
        value={sharedData}
        inputStyle={{color:'black'}}
        inputContainerStyle={{backgroundColor:'white'}}
        containerStyle={{backgroundColor:'black'}}
        searchIcon={<Icon name='search' type='font-awesome' color='black' />}
        showCancel={true}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destructive: {
    color: 'red',
    fontWeight: 'bold'
  },
  send: {
    color: 'rgb(0, 122, 255)',
    fontWeight: 'bold',
  },
  sending: {
    color: 'white',
  },
  image: {
    width: '100%',
    height: 200,
  },
  buttonGroup: {
    alignItems: 'center',
  },
});
*/



function Share() {
    ShareMenuReactView.continueInApp()
    return null;
}

export default Share;