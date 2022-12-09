import {createSlice} from '@reduxjs/toolkit'

export const formSlice = createSlice({
	name: 'layout',
	initialState: {
		formData: {},
		formValid: true,
		formSubmitted:undefined,
		formPage:0,
		formPageMode: false
	},
	reducers: {
		setFormMode: (state, action) => {
			state.formPageMode = action.payload
		},
		formReset: (state) => {
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
		},
		// To stop a recursion issue from top level components we only copy over when the form is submitted
		//
		submitForm:(state,action) => {
			state.formSubmitted=JSON.parse(JSON.stringify(state.formData));
		},
		clearSubmitted:(state) => {
			state.formSubmitted = undefined;
		},
		setFormPage:(state,action) => {
			state.formPage=action.payload;
		}


	},
})

// Action creators are generated for each case reducer function
export const {setFieldValue,setupField,submitForm,formReset,clearSubmitted,setFormMode,setFormPage} = formSlice.actions

export default formSlice.reducer