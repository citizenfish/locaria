import { createSlice } from '@reduxjs/toolkit'

export const basketSlice = createSlice({
	name: 'basketSlice',
	initialState: {
		items: [],
		open: false,
	},
	reducers: {
		setOpen: (state,action) => {
			state.open=action.payload;
		},
		setItems:(state,action) =>	{
			state.items=action.payload;
		},
		addItem:(state,action) =>	{
			// dedupe items
			if(!state.items.find(item => item === action.payload)){
				state.items.push(action.payload);
			}
		},
		removeItem:(state,action) =>	{
			const index = state.items.findIndex(item => item === action.payload);
			if(index >= 0){
				state.items.splice(index,1);
			}
		}
	},
})

// Action creators are generated for each case reducer function
export const { setOpen,setItems,addItem,removeItem } = basketSlice.actions

export default basketSlice.reducer