import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from 'axios';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {useCookies} from "react-cookie";

export default function AdminFloodMonitoringLoader(props) {

    const [counties,setCounties] =useState(null)
    const [chosenCounty,setChosenCounty] = useState('-- Select County --')
    const [cookies, setCookies] = useCookies(['location'])

    useEffect(() =>{
        window.websocket.registerQueue("addFloodFile", function (json) {
            props.forceRefresh(Date.now())
        })

        //TODO in database
        const url = 'https://environment.data.gov.uk/flood-monitoring/id/floodAreas'

        //Get list of counties from flood areas
        axios.get(url).then((res) =>{
            //Bit convoluted way to get counties from api
            const ids = res.data.items.map(o => o.county.split(','))
            let merged = [].concat.apply([], ids);
            merged = merged.map(o => o.trim())
            let unique = merged.filter((v, i, a) => a.indexOf(v) === i);
            unique.sort(function(a, b) {
                return (a < b) ? -1 : (a > b) ? 1 : 0;
            })
            unique.unshift(chosenCounty)
            setCounties(unique)
        })


    },[])


    const countyList = (arr) => {
        return arr.map((key) =>(
            <MenuItem key = {key} value={key} name={key}>{key}</MenuItem>
        ))
    }

    const handleCountyChosen = (e) => {
        setChosenCounty(e.target.value)
    }

    const loadFloodData = () => {
        window.websocket.send({
            "queue" : 'addFloodFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "custom_loader" : 'flood_loader',
                    "name" : `${chosenCounty} - Flood Data`,
                    "county" : chosenCounty,
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
                variant="outlined"
                onClick={() => {
                    loadFloodData()
                }}
                disabled = {chosenCounty ==='-- Select County --' ? true : false}
                component="span"
            >
                Load Flood Data
            </Button>
            &nbsp;:&nbsp;

            <Select
                id="countySelectControl"
                value={chosenCounty}
                label={chosenCounty}
                onChange={handleCountyChosen}
            >
                {
                    counties && countyList(counties)
                }
            </Select>


        </Box>
    )
}