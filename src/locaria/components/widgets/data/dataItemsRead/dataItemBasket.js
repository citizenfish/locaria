import React from 'react';
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from 'react-redux';

import {addItem, removeItem} from "components/redux/slices/basketSlice";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
const DataItemBasket = ({name,data,sx,size="small",allData}) => {
    const dispatch=useDispatch();
    const items = useSelector((state) => state.basketSlice.items);

    let sxActual={...{
            margin: "2px",
            color: items.indexOf(allData.properties.fid)!==-1 ? window.systemMain.defaultIconColorSelected : window.systemMain.defaultIconColor
            //fontSize: "0.5rem"
        },...sx}
    if(items.indexOf(allData.properties.fid)!==-1) {
        return (
            <Button size={size} variant="text" sx={sxActual} onClick={() => {
                dispatch(removeItem(data));
            }} endIcon={<RemoveShoppingCartIcon
                style={{color: window.systemMain.defaultIconColorSelected}}/>}>Remove</Button>
        )
    } else {
		return (
			<Button size={size} variant="text" sx={sxActual} onClick={() => {
				dispatch(addItem(data));
			}} endIcon={<AddShoppingCartIcon
				style={{color: window.systemMain.defaultIconColor}}/>}>Add</Button>
		)
    }
}

export default DataItemBasket;