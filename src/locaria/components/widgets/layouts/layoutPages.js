import React from 'react';
import RenderNav from "../navs/renderNav";
import HomeDrawer from "../drawers/homeDrawer";
import RenderFooter from "../footers/renderFooter";
import {useLocation, useParams} from "react-router-dom";
import PathRouter from "../../../libs/PathRouter"
import LandingDrawer from "../drawers/landingDrawer";
import {SearchDrawer} from "../drawers/searchDrawer";
import {ViewDrawer} from "../drawers/viewDrawer";
import SiteMap from "../pages/siteMap";
import LogoStrapLine from "../logos/logoStrapLine";
import {openViewDraw} from "../../redux/slices/viewDrawerSlice";
import {useDispatch} from "react-redux";
import Divider from "@mui/material/Divider";


const LayoutPages = () => {
    const location = useLocation();
    const dispatch = useDispatch()

    let {category} = useParams();
    let {feature} = useParams();

    let route = PathRouter(location.pathname);
    let mode = route==='/Home'? 'full':'small';

    const PageRender = () => {
        switch (route) {
            case '/Home':
                return <HomeDrawer mode={"page"}/>;
            case '/Search':
                return <SearchDrawer mode={"page"}/>;
            case '/View':
                return <ViewDrawer mode={"page"} fid={feature} category={category}/>;
            default:
                return <LandingDrawer mode={"page"}/>;
        }

    }

    return (
        <>
            <RenderNav/>
            <SiteMap mode={mode}/>
            <LogoStrapLine/>
            <Divider/>
            <PageRender/>
            <RenderFooter/>
        </>
    )
}

export default LayoutPages;