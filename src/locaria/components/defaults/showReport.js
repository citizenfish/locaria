import Typography from "@mui/material/Typography";
import React from "react";
import {useStyles} from 'stylesLocaria';

import Button from "@mui/material/Button";

import CardImageLoader from "../widgets/cardImageLoader";
import {configs} from "themeLocaria";
import LinearProgress from "@mui/material/LinearProgress";

import SearchDrawCard from "../widgets/searchDrawCard";

import {FieldView} from '../widgets/fieldView'

const ShowReport = ({reportId, reportData,viewWrapper}) => {

	const classes = useStyles();

	if (reportData && reportData.feature &&reportData.feature.packet && reportData.feature.packet.features.length > 0) {

		return (

				<div>
					<div className={classes.ReportProfileHeader}>
						<div className={classes.ReportProfileImageContainer}>
							<CardImageLoader className={classes.ReportProfileImage}
							                 images={reportData.feature.packet.features[0].properties.description.images}
							                 defaultImage={configs.defaultImage} gallery={true}/>
						</div>
							<FieldView data={reportData.feature.packet.features[0].properties}></FieldView>


						{/*	<div className={classes.ReportMainInfoRow}>
								<div className={classes.ReportMainInfoPart}>
									<Typography variant={'h5'} className={classes.ReportInfoTitle}>Place of
										birth</Typography>
									<Typography variant={'subtitle'}
									            className={classes.ReportInfoText}>{reportData.feature.packet.features[0].properties.description.data.place_of_birth_town}</Typography>
								</div>
								<div className={classes.ReportMainInfoPart}>
									<Typography variant={'h5'} className={classes.ReportInfoTitle}>Date of
										birth</Typography>
									<Typography variant={'subtitle'}
									            className={classes.ReportInfoText}>{reportData.feature.packet.features[0].properties.description.data.date_of_birth}</Typography>
								</div>
							</div>

							<div className={classes.ReportMainInfoRow}>
								<div className={classes.ReportMainInfoPart}>
									<Typography variant={'h5'} className={classes.ReportInfoTitle}>Rank</Typography>
									<Typography variant={'subtitle'}
									            className={classes.ReportInfoText}>{reportData.feature.packet.features[0].properties.description.data.rank_branch}</Typography>
								</div>
								<div className={classes.ReportMainInfoPart}>
									<Typography variant={'h5'} className={classes.ReportInfoTitle}>Date of
										death</Typography>
									<Typography variant={'subtitle'}
									            className={classes.ReportInfoText}>{reportData.feature.packet.features[0].properties.description.data.date_of_death}</Typography>
								</div>
							</div>*/}

							<Button variant="contained"
							        className={classes.ReportShareButton}>Share</Button>
					</div>
					{reportData.links.packet.features.map((item, index) => (
						<SearchDrawCard key={index} {...item} viewWrapper={viewWrapper}/>
					))}
				</div>
			);
	} else {
		return (
			<LinearProgress/>

		)
	}
}

export default ShowReport;