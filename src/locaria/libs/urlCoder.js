const resources = require('../../theme/builder/resources.json');


export default class UrlCoder {


    constructor() {

    }

    encode(url,uuid) {
        if(uuid)
            return `~uuid:${uuid}~url:${url}`;
        return url;
    }

    decode(str,urlOnly) {
        if(typeof  str !== 'string')
            return undefined;
        const match=str.match(/~uuid:(.*)~url:(.*)/);
        if(match) {

            let url=match[2];
            // Localhost hacking for images
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
                url=`${resources.url}${match[2]}`;

            if(urlOnly===true) return url;
            return [match[1],url];
        }
        // its not encoded
        return str;
    }

    route(url) {
        if(typeof url !== 'string') {
            console.log('requested url is not of type string');
            return false;
        }
        if(url.match(/~uuid/)) {
            url=this.decode(url,true);
        }
        if(url.match(/^http|https/)) {
            window.location=url;
            return false;
        }
        // must be local then
        return true;
    }


}