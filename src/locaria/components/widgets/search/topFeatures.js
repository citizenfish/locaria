import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigCard from "../featureCards/bigCard";



const TopFeatures = (props) => {

    const [results,setResults] = useState(undefined);

    useEffect(() => {
        window.websocket.registerQueue("topFeatures", function (json) {
            setResults(json.packet.geojson.features);
        });

        let packetSearch = {
            "queue": "topFeatures",
            "api": "api",
            "data": {
                "method": "search",
                "category": props.category,
                "search_text": props.search,
                "limit": props.limit

            }
        };
        if(props.tags)
            packetSearch.data.tags=props.tags;
        window.websocket.send(packetSearch);

    },[]);

    if(results===undefined) {
        return (<></>);
    }
    else {
        return (
            <Box sx={{
                margin: "10px",
            }}>
                <Grid container spacing={2} sx={{
                    flexGrow: 1
                }}>
                    {results.map((result)=> {
                        return (
                            <Grid item xs={3} key={result.properties.fid}>
                               <BigCard feature={result}></BigCard>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        );
    }
}

export default TopFeatures;