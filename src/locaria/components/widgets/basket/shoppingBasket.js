import React from 'react';
import {useSelector} from "react-redux";
import {Badge} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeaturedPlayListTwoToneIcon from '@mui/icons-material/FeaturedPlayListTwoTone';

import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

// Note if your looking for the basket cookie updates they are in renderPage.js

export default function ShoppingBasket({url='/Basket/'}) {

	const items = useSelector((state) => state.basketSlice.items);
	const history = useHistory();

	return (
		<Button onClick={()=>{
			history.push(url);
		}}>
			<Badge badgeContent={items.length} color="secondary">
				<FeaturedPlayListTwoToneIcon/>
			</Badge>
		</Button>
	)

}