import React, {useEffect} from 'react';
import {
	clearWait,
	setCounts,
	setFeatures, setRefreshCounts, setResultBbox,
	setTotalPages,
	startLoading,
	stopLoading
} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {encodeSearchParams} from "libs/searchParams";
import {objectPathGet, setObjectWithPath} from "libs/objectTools";
import {distanceActual} from "libs/Distance";

export default function SearchProxy() {

	const dispatch = useDispatch();

	const ready = useSelector((state) => state.searchDraw.ready);
	const schema = useSelector((state) => state.searchDraw.schema);
	const wait = useSelector((state) => state.searchDraw.wait);
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
			dispatch(setResultBbox(json.packet.options.bbox));
			//debugger;
			let encodedPage = `/${page}/sp/${searchParams.categories}` + encodeSearchParams({
				location: searchParams.location,
				subCategories: searchParams.subCategories,
				distance: searchParams.distance,
				tags: searchParams.tags,
				page: searchParams.page,
				search: searchParams.search,
				bbox: searchParams.bbox
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
				"search_text": searchParams.search,
				"bbox_srid":"4326"
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
				if (value && typeof value === 'object' && Object.keys(value).length > 0) {
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

		if(jsonPath!==undefined) {
			packetSearch.data.jsonpath = jsonPath;
		}


		if (searchParams.bbox.length > 0) {
			packetSearch.data.bbox = `${searchParams.bbox[0]} ${searchParams.bbox[1]}, ${searchParams.bbox[2]} ${searchParams.bbox[3]}`;
		} else {
			if (searchParams.location) {
				packetSearch.data.location = `SRID=4326;POINT(${searchParams.location[0]} ${searchParams.location[1]})`;
				if (searchParams.distance > 0) {
					packetSearch.data.location_distance = distanceActual(searchParams.distance,searchParams.distanceType);
				}
			}
		}
		if (searchParams.limit) {
			packetSearch.data.limit = searchParams.limit;
		}

		if (searchParams.tags && searchParams.tags.length > 0)
			packetSearch.data.tags = searchParams.tags;

		packetSearch.data.display_limit = searchParams.displayLimit || 20;

		packetSearch.data.offset = ((searchParams.page - 1) * packetSearch.data.display_limit);

		window.websocket.send(packetSearch);
	}

	useEffect(() => {
		if (ready === true) {
			if( wait ) {
				dispatch(clearWait());
			} else {
				doSearch();
			}
		}
	}, [searchParams]);

	return (<></>)
}