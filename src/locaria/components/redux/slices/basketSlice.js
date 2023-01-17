import { createSlice } from '@reduxjs/toolkit'

export const basketSlice = createSlice({
	name: 'basketSlice',
	initialState: {
		items: [],
		open: false,
	},
	reducers: {
		reloadItems: (state) => {
			state.items = JSON.parse(localStorage.getItem('items'));
			if(state.items===null)
				state.items = [];
		},
		setOpen: (state,action) => {
			state.open=action.payload;
		},
		setItems:(state,action) =>	{
			state.items=action.payload;
			localStorage.setItem('items', JSON.stringify(action.payload));
		},
		addItem:(state,action) =>	{
			// dedupe items
			if(!state.items.find(item => item === action.payload)){
				state.items.push(action.payload);
			}
			localStorage.setItem('items', JSON.stringify(state.items));
		},
		removeItem:(state,action) =>	{
			const index = state.items.findIndex(item => item === action.payload);
			if(index >= 0){
				state.items.splice(index,1);
			}
			localStorage.setItem('items', JSON.stringify(state.items));
		}
	},
})

// Action creators are generated for each case reducer function
export const { setOpen,setItems,addItem,removeItem ,reloadItems} = basketSlice.actions

export default basketSlice.reducer