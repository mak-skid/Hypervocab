
export type Action = 
    | { type: "updateTextInput", payload: string }
    | { type: 'updateCardData', payload: string}
    | { type: 'updateFavDictionaries', payload: string}
    | { type: 'updateFolderList', payload: string}
    | { type: 'updateSavedWordList', payload: string | number}

export const updateTextInput = (inputWord: string): Action => (
    {
        type: 'updateTextInput',
        payload: inputWord
    }
)

export const updateCardData = (cardData: string): Action =>(
    {
        type: 'updateCardData',
        payload: cardData
    }
)

export const updateFavDictionaries = (favDictionaries: string): Action =>(
    {
        type: 'updateFavDictionaries',
        payload: favDictionaries
    }
)

export const updateFolderList = (folderList: string): Action => (
    {
        type: 'updateFolderList',
        payload: folderList
    }
)

export const updateSavedWordList = (savedWordList: ( string | number )): Action => (
    {
        type: 'updateSavedWordList',
        payload: savedWordList
    }
)