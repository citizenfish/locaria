import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useStyles} from 'themeLocaria';


const ShowReport = ({reportId,data}) => {

	const classes = useStyles();

	if (data.features.length > 0) {
		return (data.features
				.map(feature => (
					<Card variant="outlined" className={classes.categoryResultsCard}>
						<CardHeader
							avatar={
								<Avatar aria-label="recipe" className={classes.avatar}>
									{feature.properties.description.title}
								</Avatar>
							}
							title={feature.properties.title}
						/>
						<CardActionArea>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									{feature.properties.title}
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									{feature.properties.description.text}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				))
		)
	} else {
		return (
			<Card className={classes.channelCardForm}>
				<CardContent>
					<Typography variant="h2" component="h2" gutterBottom>
						No results found
					</Typography>
					<p>Try adjusting your location</p>
				</CardContent>
			</Card>
		)
	}
}

export default ShowReport;