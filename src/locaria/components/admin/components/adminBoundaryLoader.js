import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Checkbox from '@mui/material/Checkbox';
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";


export default function AdminBoundaryLoader(props) {

    const [authorities,setAuthorities] = useState(null)
    const [loadingAuthorities, setLoadingAuthorities] = useState(false)
    const [chosenAuthority,setChosenAuthority] = useState({id:0})
    const [chosenBoundaries, setChosenBoundaries] = useState([])
    const [cookies, setCookies] = useCookies(['location'])
    const open = useSelector((state) => state.adminUploadDrawer.open);


    const boundaries = [
        {id: 'boundary_line_ceremonial_counties', name: 'Ceremonial Counties'},
        {id: 'boundary_line_historic_counties', name : 'Historic Counties'},
        {id: 'community_ward', name: 'Community wards'},
        {id: 'county', name: 'Counties'},
        {id: 'county_electoral_division', name :'County Electoral Divisions'},
        {id: 'district_borough_unitary_ward', name: 'Local Authority wards'},
        {id: 'greater_london_const', name : 'Greater London Constituencies'},
        {id: 'historic_european_region', name: 'Historic European Regions'},
        {id: 'parish', name: 'Parishes'},
        {id: 'polling_districts_england', name: 'English Polling Districts'},
        {id: 'scotland_and_wales_const', name : 'Scottish Constituencies'},
        {id: 'scotland_and_wales_region', name: 'Scottish and Welsh Regions'},
        {id: 'unitary_electoral_division', name: 'Unitary Electoral Divisions'},
        {id: 'westminster_const', name: 'Parliamentary Constituencies'}
    ]

    useEffect(() =>{
        if(open) {
            //WS for adding data to system
            window.websocket.registerQueue("addBoundaryFile", function (json) {
                props.forceRefresh(Date.now())
            })

            //WS for getting a list of authorities
            window.websocket.registerQueue("getAuthorities", function (json) {
                let res = json.packet
                if (res.authorities && res.authorities.length !== 0) {
                    //TODO generic sort function
                    res.authorities.push({id: 0, name: '-- Choose Local Authority --'})
                    res.authorities.sort(function (a, b) {
                        var textA = a.name.toUpperCase();
                        var textB = b.name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                    setAuthorities(res.authorities)
                }
            })
            //Get authority list if exists
            window.websocket.send({
                    "queue": 'getAuthorities',
                    "api": "sapi",
                    "data": {
                        "method": "report",
                        'report_name': 'get_local_authority_list',
                        "id_token": cookies['id_token']
                    }
                }
            )
        }
    },[])


    const authoritiesList = (arr) => {

        return arr.map((key) =>(
            <MenuItem key = {key.id} value={key.id} name={key.name}>{key.name}</MenuItem>
        ))

    }

    const handleAuthorityChosen = (e,name) => {
        setChosenAuthority({id: e.target.value, name:name.props.name})
    }

    const handleBoundaryChosen = (e) => {

        setChosenBoundaries(e.target.value)
    }

    const loadLocalAuthorityBoundary = (e) => {
        window.websocket.send({
            queue : 'addBoundaryFile',
            api : "lapi",
            data : {
                method: "add_file",
                file_attributes : {
                    ext: "gpkg",
                    name: "Local Authority Boundaries",
                    format: "GeoPackage",
                    product: "BoundaryLine",
                    custom_loader: "os_opendata",
                    table_name: "no_table_name",
                    layer : ['district_borough_unitary'],
                    post_process_report : "os_boundary_district_borough_unitary_post_process"
                 },
                "contentType" : '',
                "id_token": cookies['id_token']
            }
        })

        setLoadingAuthorities(true)
    }

    const loadBoundaryData = () => {
        window.websocket.send({
            queue : 'addBoundaryFile',
            api : "lapi",
            data : {
                method: "add_file",
                file_attributes : {
                    ext: "gpkg",
                    name: chosenBoundaries.join(','),
                    format: "GeoPackage",
                    product: "BoundaryLine",
                    custom_loader: "os_opendata",
                    table_name: "no_table_name",
                    layer : chosenBoundaries,
                    bounding_la_id: chosenAuthority.id,
                    bounding_la_name: chosenAuthority.name
                },
                "contentType" : '',
                "id_token": cookies['id_token']
            }
        })

        setChosenBoundaries([])
    }

    return(
        <Box
            component="div" sx={{
            p:2,
            mt:2,
            border: '1px solid grey',
            borderRadius: '5px' }}>

            {authorities === null &&
                <Button
                    variant="outlined"
                    component="span"
                    disabled={loadingAuthorities}
                    onClick={() => loadLocalAuthorityBoundary()}
                >
                    Load Local Authority Boundaries
                </Button>
            }
            {authorities !== null &&
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            loadBoundaryData()
                        }}
                        component="span"
                        disabled={chosenAuthority.id === 0 || chosenBoundaries.length === 0}
                    >
                        Load Boundary Data
                    </Button>

                    &nbsp;&nbsp;
                    <Select
                        id="laSelectControl"
                        value={chosenAuthority.id}
                        label={chosenAuthority.name}

                        onChange={handleAuthorityChosen}
                    >
                        {authoritiesList(authorities)}

                    </Select>
                </>
            }
            {
                chosenAuthority.id !== 0 &&
                <>

                    <Select
                        id="boundarySelectControl"
                        multiple
                        value={chosenBoundaries}
                        onChange={handleBoundaryChosen}

                    >
                        {boundaries.map((boundary) => (
                            <MenuItem key={boundary.id} value={boundary.id} name={boundary.name}>
                                <Checkbox checked={chosenBoundaries.indexOf(boundary.id) > -1}/>
                                {boundary.name}
                            </MenuItem>
                        ))}

                    </Select>

                </>
            }


        </Box>
    )
}