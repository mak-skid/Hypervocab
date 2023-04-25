import { Action } from "./actions";

export interface RootState {
    inputWord: string,
    cardData: string,
    favDictionaries: string,
    folderList: string,
    savedWordList: string | number,
}

const initialState = {
    inputWord: "",
    cardData: "",
    favDictionaries: "",
    folderList: "",
    savedWordList: "",
}

export default function reducer(state: RootState = initialState, action: Action) {
    switch (action.type) {
        case 'updateTextInput':
            return {...state, inputWord: action.payload};
        case 'updateCardData':
            return {...state, cardData: action.payload};
        case 'updateFavDictionaries':
            return {...state, favDictionaries: action.payload};
        case 'updateFolderList':
            return {...state, folderList: action.payload};
        case 'updateSavedWordList':
            return {...state, savedWordList: action.payload};
        default:
            return state
    }
};