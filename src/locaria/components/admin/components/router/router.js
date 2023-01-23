import React from 'react';

import {useDispatch} from "react-redux";
import {reloadProfile} from "components/redux/slices/userSlice";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AdminDataDashBoard from "components/admin/pages/adminDataDashboard";
import AdminModerationList from "components/admin/pages/adminModerationList";
import AdminModerationDataView from "components/admin/pages/adminModerationDataView";
import AdminDownload from "components/admin/pages/adminDownload";
import AdminFileManager from "components/admin/pages/adminFileManager";
import AdminAPISettings from "components/admin/pages/adminAPISettings";
import AdminSettingsAppearance from "components/admin/pages/adminSettingsAppearance";
import AdminSettingsAppearanceEdit from "components/admin/pages/adminSettingsAppearanceEdit";
import AdminUsersManage from "components/admin/pages/adminUsersManage";
import AdminUsersManageEdit from "components/admin/pages/adminUsersManageEdit";
import AdminConfig from "components/admin/pages/adminConfig";
import AdminConfigParameters from "components/admin/pages/adminConfigParameters";
import AdminContentPages from "components/admin/pages/adminContentPages";
import AdminContentPagesEdit from "components/admin/pages/adminContentPagesEdit";
import AdminContentData from "components/admin/pages/adminContentData";
import AdminContentDataEdit from "components/admin/pages/adminContentDataEdit";
import AdminHome from "components/admin/pages/adminHome";

const AdminAppRouter = () => {
	const dispatch=useDispatch();

	React.useEffect(() => {
		dispatch(reloadProfile());

	},[]);

	return (
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
	)

}

export default AdminAppRouter;