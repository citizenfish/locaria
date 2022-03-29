import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useCookies} from "react-cookie";


export default function AdminEventsLoader(props) {

    const [authorities,setAuthorities] = useState(null)
    const [chosenAuthority,setChosenAuthority] = useState({id:0})
    const [cookies, setCookies] = useCookies(['location'])


    useEffect(() =>{

        //WS for adding data to system
        window.websocket.registerQueue("addEventsFile", function (json) {
            props.forceRefresh(Date.now())
        })

        //WS for getting a list of authorities
        //TODO refactor as we are getting authorities in 2 components
        window.websocket.registerQueue("getAuthoritiesEvents", function (json) {
            let res = json.packet
            if(res.authorities && res.authorities.length !== 0) {
                //TODO generic sort function
                res.authorities.push({id:0, name:'-- Choose Local Authority --'})
                res.authorities.sort(function(a, b) {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })

                setAuthorities(res.authorities)
            }
        })
        //Get authority list if exists
        window.websocket.send({
                "queue" : 'getAuthoritiesEvents',
                "api" : "sapi",
                "data" : {
                    "method": "report",
                    'report_name' :'get_local_authority_list',
                    "id_token": cookies['id_token']
                }
            }
        )
    },[])


    const authoritiesList = (arr) => {

        return arr.map((key) =>(
            <MenuItem key = {key.id} value={key.id} name={key.name}>{key.name}</MenuItem>
        ))

    }

    const handleAuthorityChosen = (e,name) => {
        setChosenAuthority({id: e.target.value, name:name.props.name})
    }



    const loadEventsData = (e) => {
        window.websocket.send({
            queue : 'addEventsFile',
            api : "lapi",
            data : {
                method: "add_file",
                file_attributes : {
                    ext: "json",
                    name: `Events for ${chosenAuthority.name}`,
                    bounding_la_id: chosenAuthority.id,
                    bounding_la_name: chosenAuthority.name,
                    format: "json",
                    custom_loader: "thelist_events"
                },
                "contentType" : '',
                "id_token": cookies['id_token']
            }
        })

        //setLoadingAuthorities(true)
    }



    return(
        <Box
            component="div" sx={{
            p:2,
            mt:2,
            border: '1px solid grey',
            borderRadius: '5px' }}>


            {authorities !== null &&
            <>
                <Button
                    variant="outlined"
                    onClick={() => {
                        loadEventsData()
                    }}
                    component="span"
                    disabled={chosenAuthority.id === 0 }
                >
                    Load Events
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

        </Box>
    )
}