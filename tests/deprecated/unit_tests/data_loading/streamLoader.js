const {streamLoader} = require('../../../../scripts/data_loading/loader_utils.js')

async function test(){

    let data = [{
        category : 1,
        attributes : JSON.stringify({foo: 'foo', wibble: 'wibble'})
    },
        {
            category : 1,
            attributes : JSON.stringify({foo: 'foo2', wibble: 'wibble2'})
        }
    ]

    let ret = await streamLoader({data:data, table:'locus_core.test_events_load'})


    console.log(ret)
}

test()