import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {Badge, ListItem, ListItemText} from "@mui/material";
import {useCookies} from "react-cookie";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

export default function ShoppingBasket({title="Your basket",url='/Basket/'}) {

	const items = useSelector((state) => state.basketSlice.items);
	const [cookies, setCookies] = useCookies(['basket']);
	const history = useHistory();


	useEffect(() => {
		//compare items and cookies
		if(items.length > 0 && (cookies.basket === undefined || items.length !== cookies.basket.length)) {
			//update cookies
			setCookies('basket', items, {path: '/', sameSite: true});
		}

		//console.log(items);
	},[items]);

	/**
	 * Kept for reference incase we want a display mode
	 * @returns {*[]}
	 * @constructor
	 */
	function ShowBasketItems() {
		let itemsArray=[];

		for(let i=0; i<items.length; i++){
			itemsArray.push(
				<ListItem sx={{padding: "0px"}} key={items[i]}>
					<ListItemText primary={items[i]}/>
				</ListItem>
			)
		}

		return itemsArray;
	}

	return (
		<Button onClick={()=>{
			history.push(url);
		}}>
			<Badge badgeContent={items.length} color="secondary">
				<ShoppingCartIcon/>
			</Badge>
		</Button>
	)

}