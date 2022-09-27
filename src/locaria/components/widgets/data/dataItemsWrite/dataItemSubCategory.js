import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {TreeItem, TreeView} from "@mui/lab";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useDispatch} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import DataItemsTypography from "./dataItemsTypography";

const DataItemSubCategory = ({id,name,data,prompt,required}) => {

    const dispatch = useDispatch()

    const [selected, setSelected] = React.useState([]);

    const handleSelect = (event, nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        dispatch(setFieldValue({index:id,value:nodeIds}))
    };


    useEffect(() => {
        dispatch(setupField({index: id, value: data,required:required}))
    },[]);


    function DataMapTreeLevel({ptr,color='white'}) {
        let treeLevel=[];
        for(let p in ptr) {
            if(ptr[p].color)
                color=ptr[p].color;
            treeLevel.push(
                <TreeItem label={ptr[p].name} nodeId={ptr[p].id} sx={{
                    background: color
                }}>
                    {ptr[p].subs &&
                        <DataMapTreeLevel ptr={ptr[p].subs} color={color}/>
                    }
                </TreeItem>
            );
        }
        return treeLevel;
    }

    return (
        <Grid container spacing = {2}>
            <Grid item md={4}>
                <DataItemsTypography name={name} prompt={prompt} required={required}/>
            </Grid>
            <Grid item md={8}>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    selected={selected}
                    onNodeSelect={handleSelect}
                >
                    <DataMapTreeLevel ptr={window.dataMap}/>
                </TreeView>
            </Grid>

    </Grid>

    )
}



export default DataItemSubCategory;