import React from "react";
import { Button, Stack, Toolbar } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { newSearch, setFeatures } from "../../redux/slices/searchDrawerSlice";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import { setItems } from "../../redux/slices/basketSlice";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {FieldView} from "widgets/data/fieldView";

export default function BasketDisplay({ field }) {
  const dispatch = useDispatch();
  const features = useSelector((state) => state.searchDraw.features);
  const items = useSelector((state) => state.basketSlice.items);
  const history = useHistory();

    //TODO useful function move to library
    function get_next_week_start() {
        let now = new Date();
        let next_week_start = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
        return next_week_start;
    }

    //TODO add day ordinals th/st/nd
    let dt = get_next_week_start().toLocaleDateString('en-uk', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})

  useEffect(() => {
    if (items.length > 0) {
      dispatch(newSearch({ categories: "*", fids: items, rewrite: false }));
    } else {
      dispatch(setFeatures(undefined));
    }
  }, [items]);

  function BasketNav() {
    return (

        <Box
            sx = {{
                width: "100%", mb:1, height: '50%'
            }}
        >
            <Divider sx={{mb:2}}/>
            <Typography align={"center"} variant={"h6"}>Week Beginning: {dt}</Typography>
            <Divider sx={{mt:2}}/>

        </Box>
    );
  }

  if (features && features.features && features.features.length > 0) {
    let featureArray = [];
    features.features.forEach((feature) => {
      featureArray.push(
          <FieldView data={feature} mode={"read"} fields={field} ></FieldView>
      );
    });
    return (
        //TODO add print and email functionality
      <>
        <BasketNav />
        {featureArray}
          <Typography align={"center"} variant={"h6"} sx={{marginTop:"10px"}}>Brilliant! That’s {features.features.length} activities for next week. Keep it up!</Typography>

          <Toolbar sx={{justifyContent:"center", marginTop:"10px"}}>
              <Button startIcon={<ClearAllIcon />} onClick={() => dispatch(setItems([]))}>Clear</Button>
              <Button startIcon={<PrintIcon />} onClick={() => dispatch(setItems([]))}>Print</Button>
              <Button startIcon={<EmailIcon />} onClick={() => dispatch(setItems([]))}>Email</Button>
          </Toolbar>

      </>
    );
  } else {
    return (
        //TODO PLEASE MOVE THIS TEXT TO CONFIG
        //TODO remove hardcoded image as per searchLocationFiltersNoResults.js
      <Stack>

        <Box
            component={"img"}
            sx = {{
              width: "100%", mb:1, height: '50%'
            }}
            src = "http://activeprescriptiondev.myactiveprescription.com/assets/bfa57a48-4c35-4eb2-9fcc-e42bd2b940df.jpg"
        />
        <Grid container
              direction="column"
              alignItems="center"
              justifyContent="center">
          <Grid item md={6}>
            <p>You do not have any items in your Active Prescription</p>
          </Grid>
          <Grid item md ={6}>
            <Button variant={"outlined"}
                    sx = {{width: '200px'}}
                    onClick={()=>{history.push("/")}}>
              {/* TODO reset filters when this is selected*/}
              Search
            </Button>
          </Grid>
        </Grid>

      </Stack>
    );
  }
}
