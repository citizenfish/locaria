import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link, useParams, useLocation} from 'react-router-dom';
import {channels, useStyles, configs} from 'themeLocus';


import AdminLayout from './adminLayout';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useCookies} from "react-cookie";

const AdminData = () => {
	const classes = useStyles();

	const [tables, setTables] = React.useState(null);
	const [cookies, setCookies] = useCookies(['location']);

	window.websocket.registerQueue("tablesLoader", function (json) {
		console.log(json.packet.tables);
		setTables(json.packet.tables);
	});

	React.useEffect(() => {
		if (tables === null) {
			window.websocket.send({
				"queue": "tablesLoader",
				"api": "sapi",
				"data": {
					"method": "get_tables",
					"id_token": cookies['id_token']
				}
			});
		}
	});

	function handleClose() {

	}

	function handleChange() {

	}

	if (tables !== null) {
		return (
			<AdminLayout>
				<Paper elevation={3} className={classes.paperMargin}>
					<Grid container className={classes.root} spacing={2} justifyContent="center">
						<h1>ADMIN DATA </h1>
						<FormControl className={classes.formControl} fullWidth>

							<InputLabel id="filter-tag-select-label">Tags</InputLabel>
							<Select
								labelId="filter-tag-select-label"
								id="tag-select"
								value=""
								onChange={handleChange}
								onClose={handleClose}
								input={<Input/>}
								renderValue={(selected) => selected.join(', ')}
							>
								{tables.map(function (table) {
									return (
										<MenuItem key={table} value={table}>
											<Checkbox/>
											<ListItemText primary={table}></ListItemText>
										</MenuItem>)
								})}

							</Select>
						</FormControl>
					</Grid>
				</Paper>
			</AdminLayout>
		);
	} else {
		return (
			<AdminLayout>
				<LinearProgress/>
			</AdminLayout>
		)
	}
};


export default AdminData;