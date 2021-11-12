const {runQuery,downloadFileFromURL,unzipFile,loadGeopackage, loadCSV} = require('../loader_utils')
const fetch = require("node-fetch");

const products = {
    BoundaryLine : {
        format: 'GeoPackage',
        sqlPath : './boundaryline_view.sql',
        suffix : 'gpkg'
    },
    OpenNames : {
        format: 'GeoPackage',
        sqlPath : './opennames_view.sql',
        suffix : 'gpkg'
    },
    OpenUPRN : {
        format: 'GeoPackage',
        sqlPath : './openuprn_view.sql',
        suffix : 'gpkg'
    }
}

module.exports.load_os_opendata = async (parameters, us) => {

    if (!parameters.product || !parameters.osDataHubProductURL) {
        us({id: parameters.id, status: 'ERROR', errorMessage: 'Missing Parameters', parameters: parameters})
        return {error: 'Missing Parameters'}
    }

    //Get details of product from OS API
    let productDetails = await getProductURL(parameters.osDataHubProductURL, parameters.product);
    us({id: parameters.id, statusMessage: 'Product details retrieved', data: productDetails})

    //Check version, is it already loaded
    let version = await runQuery('SELECT parameter FROM parameters WHERE parameter_name = $1',[productDetails.version])

    if(version.rows !== undefined && version.rows[0].parameter.version === productDetails.version){
        us({id: parameters.id, statusMessage: `${parameters.product} is up to date, load cancelled`, data: productDetails})
        return productDetails
    }

    //Download the file
    let downloadFile = await downloadFileFromURL({url: productDetails.url})
    us({id: parameters.id, statusMessage : 'Data downloaded', data : downloadFile})

    //Unzip it ready for load
    let outFile = `${downloadFile.file_name}.${products[parameters.product].suffix}`
    let unzipFileDetails = await unzipFile({input : downloadFile.file_name, output: outFile})

    //Load it
    let dbLoad = products[parameters.product].format === 'GeoPackage' ? await loadGeopackage({schema: parameters.schema || 'locus_data', file: unzipFileDetails.output}) : await loadCSV(command)
    return unzipFileDetails
    /*
   This function calls the OS Data Hub API to get details of the product downloads
   If they match our requirements then a url and version is returned
    */
    async function getProductURL(url, product) {

        try {

            let json = await fetch(url).then(res => res.json());

            for (var i in json) {

                if (json[i].id === product) {

                    let pURL = json[i].url;
                    let pVer = json[i].version;

                    //get the download url which means 3 calls to OS API

                    json = await fetch(pURL).then(res => res.json())

                    const dURL = json.downloadsUrl;

                    json = await fetch(dURL).then(res => res.json())
                    for (var i in json) {


                        if (products[product].format === json[i].format) {

                            return {
                                version: pVer,
                                url: json[i].url,
                                product: product,
                                size: json[i].size,
                                format: json[i].format
                            };

                        }
                    }

                }

            }

            throw {error: `Product ${product} not found`}

        } catch(e) {

            throw ({message: 'getProductURL error', error: e})
        }

    }
}