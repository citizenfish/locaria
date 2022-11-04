import React, {useEffect} from 'react';
import {
	setFeatures,
	setTotalPages,
	startLoading,
	stopLoading
} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import { useParams} from "react-router-dom";
import {encodeSearchParams} from "../../../libs/searchParams";

export default function SearchProxy() {

	const dispatch = useDispatch();

	const ready = useSelector((state) => state.searchDraw.ready);
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const rewrite = useSelector((state) => state.searchDraw.rewrite);

	let {page} = useParams();

	useEffect(() => {

		window.websocket.registerQueue("searchFeatures", function (json) {
			//console.log(json.packet);
			dispatch(setFeatures(json.packet.geojson));
			const displayLimit=searchParams.displayLimit||20;
			let count=(searchParams.page-1)* displayLimit;
			let pageTotal=(json.packet.options.count+count)/displayLimit;

			dispatch(setTotalPages(Math.ceil(pageTotal)));
			let encodedPage = `/${searchParams.categories}/sp/${page}` + encodeSearchParams({
				location: searchParams.location,
				subCategories: searchParams.subCategories,
				distance: searchParams.distance,
				tags: searchParams.tags,
				page: searchParams.page
			})
			if (rewrite === true)
				window.history.replaceState(null, "New Page Title", encodedPage)
			dispatch(stopLoading());

		});
	},[searchParams]);

	function doSearch() {
		dispatch(startLoading());
		let packetSearch = {
			"queue": "searchFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": searchParams.categories,
				"search_text": searchParams.search
			}
		};

		if(searchParams.location) {
			packetSearch.data.location = `SRID=4326;POINT(${searchParams.location[0]} ${searchParams.location[1]})`;
			if(searchParams.distance>0) {
				packetSearch.data.location_distance=searchParams.distance*1000;
			}
		}
		if(searchParams.limit) {
			packetSearch.data.limit = searchParams.limit;
		}

		if(searchParams.tags&&searchParams.tags.length>0)
			packetSearch.data.tags=searchParams.tags;

		const displayLimit=searchParams.displayLimit||20;
		packetSearch.data.display_limit = displayLimit;

		packetSearch.data.offset=((searchParams.page-1) *  packetSearch.data.display_limit);


		if((searchParams.subCategories['subCategory1']&&searchParams.subCategories['subCategory1'].length>0)||(searchParams.subCategories['subCategory2']&&searchParams.subCategories['subCategory2'].length>0)) {
			let jsonPath="lax ";
			let i=0;

			if(searchParams.subCategories['subCategory1']&&searchParams.subCategories['subCategory1'].length>0) {
				jsonPath+= '(';

				for (let sub in searchParams.subCategories['subCategory1']) {
					i++;
					jsonPath += `$.subCategory1 == \"${searchParams.subCategories['subCategory1'][sub]}\" `;
					if (i < searchParams.subCategories['subCategory1'].length)
						jsonPath += ' || ';
				}

				jsonPath+= ') ';

			}

			i=0;

			if(searchParams.subCategories['subCategory2']&&searchParams.subCategories['subCategory2'].length>0) {
				if(searchParams.subCategories['subCategory1']&&searchParams.subCategories['subCategory1'].length>0)
					jsonPath+=' && ';
				jsonPath+= '(';
				for (let sub in searchParams.subCategories['subCategory2']) {
					i++;
					jsonPath += `$.subCategory2 == \"${searchParams.subCategories['subCategory2'][sub]}\"`;
					if (i < searchParams.subCategories['subCategory2'].length)
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
		if(ready===true)
			doSearch();
	}, [searchParams]);

	return (<></>)
}