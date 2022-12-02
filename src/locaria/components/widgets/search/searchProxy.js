import React, {useEffect} from 'react';
import {
	setCounts,
	setFeatures, setRefreshCounts,
	setTotalPages,
	startLoading,
	stopLoading
} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {encodeSearchParams} from "../../../libs/searchParams";
import {objectPathGet, setObjectWithPath} from "../../../libs/objectTools";

export default function SearchProxy() {

	const dispatch = useDispatch();

	const ready = useSelector((state) => state.searchDraw.ready);
	const schema = useSelector((state) => state.searchDraw.schema);
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const refreshCounts = useSelector((state) => state.searchDraw.refreshCounts);
	const rewrite = useSelector((state) => state.searchDraw.rewrite);

	let {page} = useParams();

	useEffect(() => {

		window.websocket.registerQueue("searchFeatures", function (json) {
			//console.log(json.packet);
			dispatch(setFeatures(json.packet.geojson));
			if (json.packet.counts)
				dispatch(setCounts(json.packet.counts));
			const displayLimit = searchParams.displayLimit || 20;
			let count = (searchParams.page - 1) * displayLimit;
			let pageTotal = (json.packet.options.count + count) / displayLimit;

			dispatch(setTotalPages(Math.ceil(pageTotal)));
			let encodedPage = `/${page}/sp/${searchParams.categories}` + encodeSearchParams({
				location: searchParams.location,
				subCategories: searchParams.subCategories,
				distance: searchParams.distance,
				tags: searchParams.tags,
				page: searchParams.page,
				search: searchParams.search
			})
			if (rewrite === true)
				window.history.replaceState(null, "New Page Title", encodedPage)
			dispatch(stopLoading());

		});
	}, [searchParams]);

	function doSearch() {
		dispatch(startLoading());
		let packetSearch = {
			"queue": "searchFeatures",
			"api": "api",
			"data": {
				"category": searchParams.categories,
				"search_text": searchParams.search
			}
		};

		if (refreshCounts === true) {
			packetSearch.data.method = "report";
			packetSearch.data.report_name = "search_counts";
			dispatch(setRefreshCounts(false));
		} else {
			packetSearch.data.method = "search";

		}

		let jsonPath = undefined;

		// implement schema
		for (let s in schema) {

			// Filters

			if (schema[s].type === 'filter') {
				let value = objectPathGet(searchParams.filters, schema[s].path);
				if (value) {
					if (packetSearch.data.filter === undefined)
						packetSearch.data.filter = {};
					setObjectWithPath(packetSearch.data.filter, schema[s].path, value);
				}
			}

			// json path
			if (schema[s].type === 'jsonpath') {
				let value = objectPathGet(searchParams.filters, schema[s].path);
				if (value && typeof value === 'object') {
					if (jsonPath === undefined) {
						jsonPath = 'lax (';
					} else {
						jsonPath += ' && (';
					}
					let valueLength=Object.keys(value).length;
					let valueIndex=0;
					for(let i in value) {
						if(schema[s].unique===true) {
							jsonPath += `$.${schema[s].path} == \"${i}\" `;
						} else {
							jsonPath += `$.${schema[s].path}.${i} == \"${value[i]}\" `;
						}
						valueIndex++;
						if(valueIndex<valueLength)
							jsonPath += '||'
					}
					jsonPath+=')';
				}
			}
		}

		console.log(searchParams.filters);

		if(jsonPath!==undefined) {
			packetSearch.data.jsonpath = jsonPath;
		}


		if (searchParams.bbox.length > 0) {
			packetSearch.data.bbox = `${searchParams.bbox[0]} ${searchParams.bbox[1]}, ${searchParams.bbox[2]} ${searchParams.bbox[3]}`;
		} else {
			if (searchParams.location) {
				packetSearch.data.location = `SRID=4326;POINT(${searchParams.location[0]} ${searchParams.location[1]})`;
				if (searchParams.distance > 0) {
					packetSearch.data.location_distance = searchParams.distance * 1000;
				}
			}
		}
		if (searchParams.limit) {
			packetSearch.data.limit = searchParams.limit;
		}

		if (searchParams.tags && searchParams.tags.length > 0)
			packetSearch.data.tags = searchParams.tags;

		const displayLimit = searchParams.displayLimit || 20;
		packetSearch.data.display_limit = displayLimit;
		//packetSearch.data.limit = displayLimit;

		packetSearch.data.offset = ((searchParams.page - 1) * packetSearch.data.display_limit);


		/*if ((searchParams.subCategories['subCategory1'] && searchParams.subCategories['subCategory1'].length > 0) || (searchParams.subCategories['subCategory2'] && searchParams.subCategories['subCategory2'].length > 0)) {
			jsonPath = "lax ";
			let i = 0;

			if (searchParams.subCategories['subCategory1'] && searchParams.subCategories['subCategory1'].length > 0) {
				jsonPath += '(';

				for (let sub in searchParams.subCategories['subCategory1']) {
					i++;
					jsonPath += `$.data.subCategory1 == \"${searchParams.subCategories['subCategory1'][sub]}\" `;
					if (i < searchParams.subCategories['subCategory1'].length)
						jsonPath += ' || ';
				}

				jsonPath += ') ';

			}

			i = 0;

			if (searchParams.subCategories['subCategory2'] && searchParams.subCategories['subCategory2'].length > 0) {
				if (searchParams.subCategories['subCategory1'] && searchParams.subCategories['subCategory1'].length > 0)
					jsonPath += ' && ';
				jsonPath += '(';
				for (let sub in searchParams.subCategories['subCategory2']) {
					i++;
					jsonPath += `$.data.subCategory2 == \"${searchParams.subCategories['subCategory2'][sub]}\"`;
					if (i < searchParams.subCategories['subCategory2'].length)
						jsonPath += ' || ';
				}
				jsonPath += ') ';

			}
			packetSearch.data.jsonpath = jsonPath;

		}
*/
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
		if (ready === true)
			doSearch();
	}, [searchParams]);

	return (<></>)
}