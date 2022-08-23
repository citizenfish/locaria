import React from 'react';
import TopFeatures from "../search/topFeatures";
import PageList from "../pages/pageList";
import ContactFull from "../contact/contactFull";
import FooterTypeSimple from "../footers/footerTypeSimple";
import NavTypeSimple from "../navs/navTypeSimple";
import SiteMap from "../pages/siteMap";
import LogoStrapLine from "../logos/logoStrapLine";
import ViewFullDetails from "../viewLayouts/viewFullDetails";
import TextSearchWidget from "../search/textSearchWidget";
import SocialIcons from "../social/socialIcons";
import SlideShow from "../images/slideShow";
import ContactMailchimp from "../contact/contactMailchimp";
import NavButton from "../navs/navButton";
import pluginsDefs from "./pluginsDef"
export default function RenderPlugin({plugin,args}) {

	// TODO lets add some constant for the WYSIWYG and put it in a sperate file
/*
	const plugins = {
		"TopFeatures": TopFeatures,
		"PageList": PageList,
		"ContactFull": ContactFull,
		"ContactMailchimp": ContactMailchimp,
		"FooterTypeSimple": FooterTypeSimple,
		"NavTypeSimple": NavTypeSimple,
		"SiteMap": SiteMap,
		"LogoStrapLine": LogoStrapLine,
		"ViewFullDetails": ViewFullDetails,
		"TextSearchWidget": TextSearchWidget,
		"SocialIcons": SocialIcons,
		"SlideShow": SlideShow,
		"NavButton": NavButton
	}
*/


	if (pluginsDefs[plugin].obj) {
		let PluginComponent = pluginsDefs[plugin].obj;
		return (
				<PluginComponent {...args}/>

		)
	} else {
		return (<h1 key={"renderError"}>NO SUCH Component {plugin}</h1>)
	}

}