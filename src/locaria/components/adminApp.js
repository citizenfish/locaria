import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

//import store from './admin/redux/store'
import store from './redux/store'
import {Provider} from 'react-redux'

import AdminHome from "./admin/pages/adminHome";
import AdminContentPages from "./admin/pages/adminContentPages";
import AdminContentData from "./admin/pages/adminContentData";
import AdminContentPagesEdit from "./admin/pages/adminContentPagesEdit";
import AdminSettingsAppearance from "./admin/pages/adminSettingsAppearance";
import AdminSettingsAppearanceEdit from "./admin/pages/adminSettingsAppearanceEdit";
import AdminContentDataEdit from "./admin/pages/adminContentDataEdit";
import AdminAPISettings from "./admin/pages/adminAPISettings";
import AdminFileManager from "./admin/pages/adminFileManager";
import AdminDownload from "./admin/pages/adminDownload";
import AdminUsersManage from "./admin/pages/adminUsersManage";
import AdminUsersManageEdit from "./admin/pages/adminUsersManageEdit";
import AdminModerationList from "./admin/pages/adminModerationList";
import AdminConfig from "./admin/pages/adminConfig";
import AdminConfigParameters from "./admin/pages/adminConfigParameters";
import AdminDataDashBoard from "./admin/pages/adminDataDashboard";
import AdminModerationDataView from "./admin/pages/adminModerationDataView";

const AdminApp = () => {

	// fix our cookie defaults

	//const cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});

	/*const [cookies, setCookies] = useCookies(['location']);

	if (cookies.location === undefined) {
		const ol = new Openlayers();

		setCookies('location', configs.defaultLocation, {
			path: '/',
			sameSite: true
		});
	}
	if (cookies.distanceSelect === undefined) {
		setCookies('distanceSelect', configs.defaultDistanceSelect, {path: '/', sameSite: true});
	}
	if (cookies.distance === undefined) {
		setCookies('distance', configs.defaultDistance, {path: '/', sameSite: true});
	}
*/

	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path="/Admin/Reports/Dashboard" component={AdminDataDashBoard}/>
					<Route exact path="/Admin/Content/Moderation"  component={AdminModerationList}/>
					<Route exact path="/Admin/Content/Moderation/View/:fid?"  component={AdminModerationDataView}/>
					<Route exact path="/Admin/Import/Download"  component={AdminDownload}/>
					<Route exact path="/Admin/Import/Upload"  component={AdminFileManager}/>
					<Route exact path="/Admin/API/Settings"  component={AdminAPISettings}/>
					<Route exact path="/Admin/Settings/Appearance"  component={AdminSettingsAppearance}/>
					<Route exact path="/Admin/Settings/Appearance/Edit"  component={AdminSettingsAppearanceEdit}/>
					<Route exact path="/Admin/Users/Manage"  component={AdminUsersManage}/>
					<Route exact path="/Admin/Users/Manage/:user"  component={AdminUsersManageEdit}/>
					<Route exact path="/Admin/Config"  component={AdminConfig}/>
					<Route exact path="/Admin/Config/Parameters/:selectedConfig?"  component={AdminConfigParameters}/>
					<Route exact path="/Admin/Content/Pages"  component={AdminContentPages}/>
					<Route exact path="/Admin/Content/Pages/Edit/:selectedPage?"  component={AdminContentPagesEdit}/>
					<Route exact path="/Admin/Content/Data"  component={AdminContentData}/>
					<Route exact path="/Admin/Content/Data/Edit/:fid?"  component={AdminContentDataEdit}/>
					<Route exact path="/Admin/:id_token?" component={AdminHome}/>
					<Route exact path="/Admin/"  component={AdminHome}/>
					<Route exact path="/Admin/Home/"  component={AdminHome}/>
					<Route component={AdminHome}/>
				</Switch>
			</Router>
		</Provider>

	);
};

export default AdminApp;