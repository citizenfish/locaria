import React from "react";
import Grid from "@mui/material/Grid";
import DataItemLinkButton from "widgets/data/dataItemsRead/dataItemLinkButton";
import Divider from "@mui/material/Divider";
import DataItemImage from "widgets/data/dataItemsRead/dataItemImage";
import {useSelector} from "react-redux";
import {nth} from "libs/dates";
import DataItemP from "widgets/data/dataItemsRead/dataItemP";

export default function ActiveBasketView({data, category}) {
	const mobile = useSelector((state) => state.mediaSlice.mobile);


	let date = new Date(data.properties.metadata.sd);
	let dateDay = date.toLocaleDateString('en-UK', {day: "numeric"});
	dateDay += nth(dateDay);
	let dateString = date.toLocaleDateString('en-UK', {
		weekday: "long",
	});
	dateString += ' ' + dateDay;

	if (mobile) {
		return (
			<Grid container alignItems="center" spacing={2} sx={{
				marginTop: "10px",
			}}>
				<Grid item xs={2}>
					<DataItemImage data={data.properties.data.images} category={category} sx={{
						"height": "50px",
						"maxWidth": "50px",
						"borderRadius": "4px",
						"marginLeft": "7px"
					}}/>
				</Grid>
				<Grid item xs={10}>
					<Grid container>
						<Grid item xs={12}>
							<DataItemP data={data.properties.description.title} category={category}
									   sx={{
										   "color": "#000",
										   "textOverflow": "ellipsis",
										   "whiteSpace": "nowrap",
										   "overflow": "hidden",
										   "fontSize": "0.9rem"
									   }}/>
						</Grid>
						<Grid item xs={12}>
							<Grid container>
								<Grid item xs={6}>
								<DataItemP data={dateString} category={category}
										   sx={{
											   "color": "#000",
											   "textOverflow": "ellipsis",
											   "whiteSpace": "nowrap",
											   "overflow": "hidden",
											   "fontSize": "0.9rem"
										   }}/>
								</Grid>
								<Grid item xs={6} justify="flex-end">
									<DataItemLinkButton data={data.properties.data.url} category={category} name={"Book"}
														size={"small"} sx={{
										"color": "#000"
									}}/>
								</Grid>
							</Grid>
						</Grid>

					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Divider sx={{borderStyle: 'dashed'}} variant="middle"/>
				</Grid>
			</Grid>
		)
	}

	return (
		<Grid container alignItems="center" spacing={2} sx={{
			marginTop: "10px",
		}}>
			<Grid item md={1}>
				<DataItemImage data={data.properties.data.images} category={category} sx={{
					"height": "50px",
					"maxWidth": "50px",
					"borderRadius": "4px",
					"marginLeft": "7px"
				}}/>
			</Grid>
			<Grid item md={9}>
				<DataItemP data={dateString + ' | ' + data.properties.description.title} category={category} sx={{
					"color": "#000",
					"textOverflow": "ellipsis",
					"whiteSpace": "nowrap",
					"overflow": "hidden",
					"fontSize": "0.9rem"
				}}/>
			</Grid>
			<Grid item md={2}>
				<DataItemLinkButton data={data.properties.data.url} category={category} name={"Book"} size={"small"}
									sx={{
										"color": "#000"
									}}/>
			</Grid>
			<Grid item md={12}>
				<Divider sx={{borderStyle: 'dashed'}} variant="middle"/>
			</Grid>
		</Grid>
	);
}