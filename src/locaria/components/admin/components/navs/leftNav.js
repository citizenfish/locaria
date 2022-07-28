import React from 'react';

import {Collapse, Drawer, ListItemButton} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArticleIcon from '@mui/icons-material/Article';
import StorageIcon from '@mui/icons-material/Storage';
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import {useHistory} from "react-router-dom";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

export default function LeftNav({isOpenContent}) {

	const [openContent, setOpenContent] = React.useState(isOpenContent||false);

	const handleClickContent = () => {
		setOpenContent(!openContent);
		history.push(`/Admin/Content/Pages`);
	};

	const history = useHistory();
	return (
		<Drawer
			variant="permanent"
			anchor="left"
			sx={{
				width: "240px",
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: "240px",
					boxSizing: 'border-box',
					paddingTop: '64px',
					zIndex: 101,
					color: 'black'
				},
			}}
		>
			<Divider/>
			<List component="nav">
				<ListItemButton onClick={() => {
					window.location = '/';
					//history.push('/');
				}}>
					<ListItemIcon>
						<HomeOutlinedIcon/>
					</ListItemIcon>
					<ListItemText primary={`Back to client`}/>
				</ListItemButton>
				<Divider/>
				<ListItemButton onClick={() => {
					history.push('/Admin/');
				}}>
					<ListItemIcon>
						<HomeOutlinedIcon/>
					</ListItemIcon>
					<ListItemText primary={`Admin home`}/>
				</ListItemButton>

				<ListItemButton  onClick={() => {
					handleClickContent();
				}}>
					<ListItemIcon>
						<EditIcon/>
					</ListItemIcon>
					<ListItemText primary={"Content"}/>
					{openContent ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={openContent} timeout="auto" unmountOnExit>
					<List component="div">
						<ListItemButton  sx={{ pl: 4 }} onClick={() => {
							history.push(`/Admin/Content/Pages`);
						}}>
							<ListItemIcon>
								<ArticleIcon/>
							</ListItemIcon>
							<ListItemText primary={"Page Manager"}/>
						</ListItemButton>
						<ListItemButton  sx={{ pl: 4 }} onClick={() => {
							history.push(`/Admin/Content/Data`);
						}}>
							<ListItemIcon>
								<StorageIcon/>
							</ListItemIcon>
							<ListItemText primary={"Data Manager"}/>
						</ListItemButton>
					</List>
				</Collapse>
			</List>

		</Drawer>
	)
}