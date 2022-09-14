import TopFeatures from "../search/topFeatures";
import PageList from "../pages/pageList";
import ContactFull from "../contact/contactFull";
import ContactMailchimp from "../contact/contactMailchimp";
import NavTypeSimple from "../navs/navTypeSimple";
import SiteMap from "../pages/siteMap";
import LogoStrapLine from "../logos/logoStrapLine";
import ViewFullDetails from "../viewLayouts/viewFullDetails";
import TextSearchWidget from "../search/textSearchWidget";
import SocialIcons from "../social/socialIcons";
import SlideShow from "../images/slideShow";
import NavButton from "../navs/navButton";
import FooterTypeSimple from "../footers/footerTypeSimple";
import SimpleMap from "../maps/simpleMap";
import SearchProxy from "../search/searchProxy";
import SearchCategory from "../search/searchCategory";
import SimpleForm from "../data/simpleForm";

const pluginsDefs = {
	"SearchProxy": {
		"obj": SearchProxy,
		"description": "Search proxy",
		"params": [{param: "category", default: "News"}]
	},
	"TopFeatures": {
		"obj": TopFeatures,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"PageList": {
		"obj": PageList,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"ContactFull": {
		"obj": ContactFull,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"ContactMailchimp": {
		"obj": ContactMailchimp,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"FooterTypeSimple": {
		"obj": FooterTypeSimple,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"NavTypeSimple": {
		"obj": NavTypeSimple,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"SiteMap": {
		"obj": SiteMap,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"LogoStrapLine": {
		"obj": LogoStrapLine,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"ViewFullDetails": {
		"obj": ViewFullDetails,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"TextSearchWidget": {
		"obj": TextSearchWidget,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"SocialIcons": {
		"obj": SocialIcons,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"SlideShow": {
		"obj": SlideShow,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"NavButton": {
		"obj": NavButton,
		"description": "Show a panel of features",
		"params": [{param: "category", default: "News"}]
	},
	"SimpleMap": {
		"obj": SimpleMap,
		"description": "Searchable map",
		"params": [{param: "category", default: "News"}]
	},
	"SearchCategory": {
		"obj": SearchCategory,
		"description": "Search Category",
		"params": [{param: "category", default: "News"}]
	},
	"SimpleForm": {
		"obj": SimpleForm,
		"description": "Display simple input form",
		"params": [{param: "category", default: "News"}]
	}
}

export default pluginsDefs;