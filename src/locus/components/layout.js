import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Divider, Icon,Menu,Label } from 'semantic-ui-react';

import styles from './css/styles.css';

const Layout = ({ children }) => {
	return (
		<Container>
			<Link to="/">


				<Header className={styles.headSection}>
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
				<span className={styles.logoBw}></span>
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
	);
};

export default Layout;