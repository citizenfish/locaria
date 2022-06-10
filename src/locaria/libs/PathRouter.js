import {openHomeDrawer} from "../components/redux/slices/homeDrawerSlice";
import {openLayout} from "../components/redux/slices/layoutSlice";
import {openSearchDrawer} from "../components/redux/slices/searchDrawerSlice";

const PathRouter=(location) => {
    if (location === '/') {
        // This is a default landing so find out if we need to direct them
        if (window.systemMain.landingRoute && window.systemMain.landingRoute !== '/')
            return window.systemMain.landingRoute;
        else
            return '/';
    }

    if (location.match('^/Home')) {
        return '/Home';
    }

    if (location.match('^/Map')) {
        return '/Map';
    }

    if (location.match('^/Search/.*') ) {
        return '/Search';
    }

    if (location.match('^/View/.*') ) {
        return '/View';
    }

    if (location.match('^/Page/.*') ) {
        return '/Page';
    }

    return '/';
}

export default PathRouter;