import {createSlice} from '@reduxjs/toolkit'

export const formSlice = createSlice({
	name: 'layout',
	initialState: {
		formData: {},
		formValid: true
	},
	reducers: {
		reset: (state) => {
			state.formData = {};
		},
		setFieldValue: (state,action) => {
			state.formData[action.payload.index].value=action.payload.value;
			state.formData[action.payload.index].complete=true;
		},
		setupField: (state,action) =>{
			state.formData[action.payload.index]={value:action.payload.value,required:action.payload.required,complete:false};
			if(action.payload.required!==true)
				state.formData[action.payload.index].complete=true;

		}
	},
})

// Action creators are generated for each case reducer function
export const {setFieldValue,setupField} = formSlice.actions

export default formSlice.reducer