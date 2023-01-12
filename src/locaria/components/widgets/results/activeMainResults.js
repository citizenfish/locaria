import React from "react";
import Grid from "@mui/material/Grid";
import DataItemImage from "widgets/data/dataItemsRead/dataItemImage";
import DataItemP from "widgets/data/dataItemsRead/dataItemP";
import DataItemLinkButton from "widgets/data/dataItemsRead/dataItemLinkButton";
import Divider from "@mui/material/Divider";
import {nth} from "libs/dates";
import DataItemMinMedMax from "widgets/data/dataItemsRead/dataItemMinMedMax";
import DataItemPhoneButton from "widgets/data/dataItemsRead/dataItemPhoneButton";
import DataItemBasket from "widgets/data/dataItemsRead/dataItemBasket";
import DataItemCost from "widgets/data/dataItemsRead/dataItemCost";
import DataItemDescriptionSummary from "widgets/data/dataItemsRead/dataItemDescriptionSummary";
import {useSelector} from "react-redux";
import {Stack} from "@mui/material";

export default function ActiveMainResults({data, category}) {

	const mobile = useSelector((state) => state.mediaSlice.mobile);
	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);


	let date = new Date(data.properties.metadata.sd);
	let dateDay = date.toLocaleDateString('en-UK', {day: "numeric"});
	dateDay += nth(dateDay);
	let dateString = date.toLocaleDateString('en-UK', {
		weekday: "long",
	});
	dateString += ' ' + dateDay;

	if (mobile) {
		return (
			<Grid container alignItems={"center"} justifyContent={"space-evenly"} spacing={2} direction="row" sx={{
				marginTop: "10px",
				maxWidth: `${innerWidth}px`
			}}>
				<Grid item md={12}>
					<DataItemImage data={data.properties.data.images} category={category} sx={{
						"height": "200px",
						"borderRadius": "4px",
						"width":`${innerWidth - 20}px`
					}}/>
				</Grid>
				<Grid item md={12}>
					<Stack>
						<DataItemP data={dateString + ' | ' + data.properties.description.title} category={category}
								   sx={{
									   "color": "#000",
									   "textOverflow": "ellipsis",
									   "whiteSpace": "nowrap",
									   "overflow": "hidden",
									   "fontSize": "0.9rem",
									   "width": `${innerWidth - 40}px`,
									   paddingLeft: "5px"
								   }}/>
						<Stack direction={"row"}>
							<DataItemLinkButton data={data.properties.data.url} category={category} name={"Book"}
												size={"small"} sx={{
								"color": "#000",
								paddingLeft: "5px"
							}}/>
							<DataItemPhoneButton data={data.properties.data.phone} category={category} name={"Phone"}
												 sx={{
													 "color": "#000",
													 paddingLeft: "5px"
												 }}/>
							<DataItemBasket data={data.properties.fid} category={category} allData={data} name={"Add"}
											sx={{
												"color": "#000",
												paddingLeft: "5px"
											}}/>
						</Stack>
						<DataItemP data={data.properties.data.organisation_name} category={category} sx={{
							"color": "#837d7d",
							paddingLeft: "5px"
						}}/>
						<DataItemP data={"Where: "+data.properties.data.event_location} variant={"body1"} category={category}
								   sx={{
									   "color": "#837d7d",
									   paddingLeft: "5px"
								   }}/>
						<DataItemCost data={"Cost: "+data.properties.data.cost} name={"Cost"} category={category} sx={{
							"color": "#837d7d",
							paddingLeft: "5px"
						}}/>
						<DataItemDescriptionSummary data={data.properties.description.text} allData={data}
													length={100} sx={{
							"color": "#837d7d",
							"fontSize": "0.85rem",
							"lineHeight": 1,
							paddingLeft: "5px"
						}}/>
					</Stack>
				</Grid>
				<Grid item md={12}>
					<Divider sx={{borderStyle: 'dashed'}} variant="middle"/>
				</Grid>
			</Grid>
		)
	} else {
		return (
			<Grid container alignItems="center" spacing={2} sx={{
				marginTop: "10px",
			}}>
				<Grid item md={4}>
					<DataItemImage data={data.properties.data.images} category={category} sx={{
						"height": "200px",
						"borderRadius": "4px",
						"marginLeft": "7px"
					}}/>
				</Grid>
				<Grid item md={8}>
					<Grid container spacing={2}>
						<Grid item md={12}>
							<DataItemP data={dateString + ' | ' + data.properties.description.title} category={category}
									   sx={{
										   "color": "#000",
										   "textOverflow": "ellipsis",
										   "whiteSpace": "nowrap",
										   "overflow": "hidden",
										   "fontSize": "0.9rem"
									   }}/>
						</Grid>
						<Grid item md={3}>
							<DataItemMinMedMax textPrompts={true} data={data.properties.distance} category={category}
											   sx={{
												   "marginTop": "5px"
											   }}/>
							<DataItemLinkButton data={data.properties.data.url} category={category} name={"Book"}
												size={"small"} sx={{
								"color": "#000"
							}}/>
							<DataItemPhoneButton data={data.properties.data.phone} category={category} name={"Phone"}
												 sx={{
													 "color": "#000",
													 "marginTop": "5px"
												 }}/>
							<DataItemBasket data={data.properties.fid} category={category} allData={data} name={"Add"}
											sx={{
												"color": "#000",
												"marginTop": "5px"
											}}/>
						</Grid>

						<Grid item md={4}>
							<DataItemP data={data.properties.data.organisation_name} category={category} sx={{
								"color": "#837d7d",
								"fontWeight": 550
							}}/>
							<DataItemP data={data.properties.data.event_location} variant={"body1"} category={category}
									   sx={{
										   "marginTop": "10px",
										   "color": "#837d7d"
									   }}/>
							<DataItemCost data={data.properties.data.cost} name={"Cost"} category={category} sx={{
								"marginTop": "10px",
								"color": "#837d7d"
							}}/>
						</Grid>

						<Grid item md={5}>
							<DataItemDescriptionSummary data={data.properties.description.text} allData={data}
														length={100} sx={{
								"color": "#837d7d",
								"fontSize": "0.85rem",
								"lineHeight": 1
							}}/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item md={12}>
					<Divider sx={{borderStyle: 'dashed'}} variant="middle"/>
				</Grid>
			</Grid>
		)
	}
}