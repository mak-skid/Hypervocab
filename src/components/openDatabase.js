import SQLite from 'react-native-sqlite-storage';

const successCB = () => { console.log("successfully opened db")};
const errorCB = error => { console.log("ERROR: " + error)};

const ejdictdb = SQLite.openDatabase(
    {
        name: 'ejdict.db',
        createFromLocation: 1,
        location: 'Documents',
    },
    successCB, errorCB
);

const UserDatabaseDB = SQLite.openDatabase(
    {
        name: 'UserDatabase.db',
        createFromLocation: 1,
        location: 'Documents',
    },
    successCB, errorCB
);

export {ejdictdb, UserDatabaseDB}