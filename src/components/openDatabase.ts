// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import SQLite from 'react-native-sqlite-storage';

const successEjDictOP = () => {console.log("successfully opened ejdictDB")};
const successUserDBOP = () => {console.log('successfully opened UserDatabase')};
const errorCB = (error: any) => {console.log("ERROR: " + error)};

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