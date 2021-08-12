import React from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import {channels, useStyles} from "../../theme/locus";
import {Link} from "react-router-dom";



const Layout = ({ children }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const isMenuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const menuId = 'primary-search-account-menu';

	function channelDisplay(channel) {
		if(channel.type==='Report')
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.report_name}`} key={channel.key} content={channel.description}>{channel.description}</MenuItem>)
		else
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.category}`} key={channel.key} content={channel.description}>{channel.description}</MenuItem>)

	}

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem component={Link} to={`/`}>Home</MenuItem>
			{channels.map(channel => (
				channelDisplay(channel)
			))}
		</Menu>
	);

	return (
		<Container>
		<div className={classes.grow}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="open drawer"
						onClick={handleMenuOpen}
					>
						<MenuIcon />
					</IconButton>
					<Typography className={classes.title} variant="h6" noWrap>
						Locus - My council name
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							defaultValue="GU15 3HD"
						/>
					</div>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</div>
		<div>
			{children}
		</div>
		</Container>
	);
};





export default Layout;

/** OLDS
 <Container>
			<Link to="/">


				<Header className="">
					<div className="page-header" id="header-target">

					</div>
					<div className="subheading" id="subheading-target">

					</div>
					<div className="postcode-search" id="location-target">

					</div>

					<Menu vertical>
						<Menu.Item name='inbox' active='true'>
							<Label color='teal'>1</Label>
							Inbox
						</Menu.Item>

					</Menu>
				</Header>
			</Link>
			<main className="document-content">
				<div className="content-holder" id="content-target">
					{children}
				</div>
			</main>
			<Divider />
			<footer role="contentinfo">
				<span className=""></span>
				<ul>
					<li><a href="https://www.surreyheath.gov.uk/council/contact-us" target="_blank">Contact</a></li>
					<li><a href="https://www.surreyheath.gov.uk/visitors/whats-on/all" target="_blank">Events</a></li>
					<li><a href="https://www.surreyheath.gov.uk/council/news" target="_blank">News</a></li>
					<li><a href="https://www.surreyheath.gov.uk/disclaimer" target="_blank">Disclaimer</a></li>
					<li><a href="https://www.surreyheath.gov.uk/cookies" target="_blank">Cookies</a></li>
					<li><a href="https://www.surreyheath.gov.uk/council/information-governance/how-we-use-your-data" target="_blank">How we use your data</a></li>
				</ul>
				<p>Surrey Heath Borough Council | Developed in partnership</p>
			</footer>
		</Container>
 **/