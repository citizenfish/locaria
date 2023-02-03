import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Badge,
    Checkbox,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import { useDispatch, useSelector } from "react-redux";
import { objectPathExists, objectPathGet } from "libs/objectTools";
import {
  clearFilterItem,
  setFilterItem,
} from "../../redux/slices/searchDrawerSlice";
import Button from "@mui/material/Button";
import {v4} from "uuid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import {deepOrange, grey} from "@mui/material/colors";
import TypographyHeader from "widgets/typography/typographyHeader";

export default function SearchToggleBox({
        name,
        path,
        Icon
}) {
  const searchParams = useSelector((state) => state.searchDraw.searchParams);
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.searchDraw.counts);

  const key = useRef(0);

  useEffect(() => {
    key.current++;
  }, []);

  function handleToggle() {
    if (objectPathExists(searchParams.filters, path)) {
      dispatch(clearFilterItem({ path: path }));
    } else {
      dispatch(setFilterItem({ path: path, value: true }));
    }
  }



  return (
    <Accordion expanded={false} onChange={handleToggle}>
        <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Avatar sx={{background:objectPathGet(searchParams.filters,path)? deepOrange[500] : grey[300]}}><Icon/></Avatar>


            <TypographyHeader sx={{"color": "#1976d2", "fontSize": "0.9rem", padding:"13px"}}
                              element={"h2"}>{name}</TypographyHeader>
        </AccordionSummary>
        <AccordionDetails>

        </AccordionDetails>
    </Accordion>
  );
}
