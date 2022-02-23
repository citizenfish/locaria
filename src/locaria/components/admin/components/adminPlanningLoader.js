import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from 'axios';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {useCookies} from "react-cookie";

export default function AdminPlanningLoader(props) {

    const [authorities,setAuthorities] =useState(null)
    const [chosenLA,setChosenLA] = useState({id:0})
    const [cookies, setCookies] = useCookies(['location'])

    useEffect(() =>{

        window.websocket.registerQueue("addPlanningFile", function (json) {
            props.forceRefresh(Date.now())
        })

        //TODO in database
        const url = 'https://www.planit.org.uk/api/areas/json?select=area_name,area_id'

        //Get list of planning authorities
        axios.get(url).then((res) =>{
            //Sort them alphabetically on area_name
            res.data.records.push({area_id:0, area_name: '-- None Selected --'})
            res.data.records.sort(function(a, b) {
                var textA = a.area_name.toUpperCase();
                var textB = b.area_name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })

            setAuthorities(res.data.records)
        })


    },[])


    const authorityList = (arr) => {

        return arr.map((key) =>(
            <MenuItem value={key.area_id} name={key.area_name}>{key.area_name}</MenuItem>
        ))

    }

    const handleLAChosen = (e,name) => {
        setChosenLA({id: e.target.value, name:name.props.name})
    }

    const loadPlanningData = () => {
        window.websocket.send({
            "queue" : 'addPlanningFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "custom_loader" : 'planning_loader',
                    "name" : `${chosenLA.name} - Planning`,
                    "authority" : chosenLA.id,
                    //TODO get this out of here!
                    "url" : 'https://www.planit.org.uk/api/applics/json',
                    "ext" : 'json',
                    "file_type" : 'json'
                },
                "contentType" : '',
                "id_token": cookies['id_token']
            }
        })
    }

    return(
        <Box
            component="div" sx={{
            p:2,
            mt:2,
            border: '1px solid grey',
            borderRadius: '5px' }}>

            <Button
                variant="contained"
                onClick={() => {
                    loadPlanningData()
                }}
                component="span"
            >
                Load Planning Data
            </Button>
            &nbsp;:&nbsp;
            <Select
                id="laSelectControl"
                value={chosenLA.id}
                label={chosenLA.id}
                onChange={handleLAChosen}
            >
                {
                    authorities && authorityList(authorities)
                }
            </Select>

        </Box>
    )
}