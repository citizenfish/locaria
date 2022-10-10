import React, {useEffect} from 'react';
import {clearRefresh, setFeatures} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";

export default function SearchProxy() {

	const dispatch = useDispatch();

	const refresh = useSelector((state) => state.searchDraw.refresh);
	const categories = useSelector((state) => state.searchDraw.categories);
	const subCategories = useSelector((state) => state.searchDraw.subCategories);
	const search = useSelector((state) => state.searchDraw.search);

	useEffect(() => {
		window.websocket.registerQueue("searchFeatures", function (json) {
			dispatch(setFeatures(json.packet.geojson));
		});

	}, []);


	function doSearch() {
		let packetSearch = {
			"queue": "searchFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": categories,
				"search_text": search

			}
		};

		if(subCategories&&subCategories.length>0) {
			packetSearch.data.jsonpath='lax $.categoryLevel1 == "Shops"';
		}
		window.websocket.send(packetSearch);

	}
	useEffect(() => {


		if (refresh === true) {
			doSearch();
			dispatch(clearRefresh());

		}

	}, [refresh]);

	return (<></>)
}