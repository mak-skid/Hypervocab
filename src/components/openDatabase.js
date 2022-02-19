import SQLite from 'react-native-sqlite-storage';

const successEjDictOP = () => {console.log("successfully opened ejdictDB")};
const successUserDBOP = () => {console.log('successfully opened UserDatabase')};
const errorCB = error => {console.log("ERROR: " + error)};

const ejdictdb = SQLite.openDatabase(
    {
        name: 'ejdict.db',
        readOnly: true,
        createFromLocation: 1,
        location: 'Documents',
    },
    successEjDictOP, errorCB
);

const UserDatabaseDB = SQLite.openDatabase(
    {
        name: 'UserDatabase.db',
        createFromLocation: 1,
        location: 'Documents',
    },
    successUserDBOP, errorCB
);

export {ejdictdb, UserDatabaseDB}