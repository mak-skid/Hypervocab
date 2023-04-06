import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function StarterPage() {
  return (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <View style={styles.container}>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Text style={TextStyles.container}>Hypervocab</Text>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Text style={{fontSize: 15, color: 'white'}}>by Makoto Ono</Text>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <StatusBar style='light' />
      </View> 
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      }
    },
  );
  const TextStyles = StyleSheet.create({
    container: {
      color: 'white',
      fontSize: 40,
      }
    }
  );
