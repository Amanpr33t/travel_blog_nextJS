import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEdit: false,
    content: null,
    title: null,
    cloudinaryURL: null
}

const EditSlice = createSlice({
    name: 'edit',
    initialState: initialState,
    reducers: {
        setEdit(state, action) {
            state.isEdit = action.payload.isEdit
            state.content = action.payload.content
            state.title = action.payload.title
            state.cloudinaryURL = action.payload.cloudinaryURL
        }
    }
})

export default EditSlice
export const EditActions = EditSlice.actions