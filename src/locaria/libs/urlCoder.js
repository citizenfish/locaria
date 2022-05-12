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
            if(urlOnly===true) return match[2];
            return [match[1],match[2]];
        }
        // its not encoded
        return str;
    }


}