const {writeCSV} = require('../../../scripts/data_loading/loader_utils.js')

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

    let ret = await writeCSV({data:data})


    console.log(ret)
}

test()