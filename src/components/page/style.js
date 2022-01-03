import { StyleSheet, Dimensions, Platform } from 'react-native';

export const width = Dimensions.get('window').width
export const height = Dimensions.get("window").height

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    subContainer: {
        margin: 20,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        flexDirection: 'row',
    },  
    input: {
        height: 40,
        width: 320,
        marginHorizontal: 12,
        borderWidth: Platform.OS === 'ios' ? 10 : 0,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5
    },
    searchContainer:{
        flex: 2,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 20,
        backgroundColor:'black',
    }
})