import React, {useEffect} from 'react';
import {clearRefresh, setFeatures} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {encodeSearchParams} from "../../../libs/searchParams";

export default function SearchProxy() {

	const dispatch = useDispatch();
	const history = useHistory();

	const refresh = useSelector((state) => state.searchDraw.refresh);
	const categories = useSelector((state) => state.searchDraw.categories);
	const subCategories = useSelector((state) => state.searchDraw.subCategories);
	const search = useSelector((state) => state.searchDraw.search);
	const limit = useSelector((state) => state.searchDraw.limit);
	const location = useSelector((state) => state.searchDraw.location);
	const displayLimit = useSelector((state) => state.searchDraw.displayLimit);
	const rewrite = useSelector((state) => state.searchDraw.rewrite);

	let {page} = useParams();

	useEffect(() => {

		window.websocket.registerQueue("searchFeatures", function (json) {
			dispatch(setFeatures(json.packet.geojson));
			let encodedPage = `/${categories}/sp/${page}` + encodeSearchParams({
				location: location,
				subCategories: subCategories
			})
			if (rewrite === true)
				window.history.replaceState(null, "New Page Title", encodedPage)
		});
	},[location,subCategories]);

	function doSearch() {
		let packetSearch = {
			"queue": "searchFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": categories,
				"search_text": search,

			}
		};

		if(location)
			packetSearch.data.location=`SRID=4326;POINT(${location[0]} ${location[1]})`;
		if(limit)
			packetSearch.data.limit=limit;
		if(displayLimit)
			packetSearch.data.display_limit=displayLimit;

		if((subCategories['subCategory1']&&subCategories['subCategory1'].length>0)||(subCategories['subCategory2']&&subCategories['subCategory2'].length>0)) {
			let jsonPath="lax ";
			let i=0;

			if(subCategories['subCategory1']&&subCategories['subCategory1'].length>0) {
				jsonPath+= '(';

				for (let sub in subCategories['subCategory1']) {
					i++;
					jsonPath += `$.subCategory1 == \"${subCategories['subCategory1'][sub]}\" `;
					if (i < subCategories['subCategory1'].length)
						jsonPath += ' || ';
				}

				jsonPath+= ') ';

			}

			i=0;

			if(subCategories['subCategory2']&&subCategories['subCategory2'].length>0) {
				if(subCategories['subCategory1']&&subCategories['subCategory1'].length>0)
					jsonPath+=' && ';
				jsonPath+= '(';
				for (let sub in subCategories['subCategory2']) {
					i++;
					jsonPath += `$.subCategory2 == \"${subCategories['subCategory2'][sub]}\"`;
					if (i < subCategories['subCategory2'].length)
						jsonPath += ' || ';
				}
				jsonPath+= ') ';

			}
			packetSearch.data.jsonpath=jsonPath;

		}

		/*if(subCategories && subCategories.length > 0) {
			let jsonPath="lax ";
			let i=0;
			for(let sub in subCategories) {
				i++;
				jsonPath+=`$.categoryLevel1 == \"${subCategories[sub]}\"`;
				if(i<subCategories.length)
					jsonPath+=' || ';
			}
			packetSearch.data.jsonpath=jsonPath;
		}*/
		window.websocket.send(packetSearch);
	}

	useEffect(() => {



		if (refresh === true&&categories) {
			dispatch(clearRefresh());
			doSearch();
		}

	}, [refresh,displayLimit,limit,subCategories,search,location]);

	return (<></>)
}