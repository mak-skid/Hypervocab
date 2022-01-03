import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function StarterPage() {
  return (
      <View style={styles.container}>
        <Text style={TextStyles.container}>Hypervocab</Text>
        <Text style={{fontSize: 15, color: 'white'}}>by Makoto Ono</Text>
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
