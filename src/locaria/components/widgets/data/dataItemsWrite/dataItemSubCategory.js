import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";

import {useDispatch} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import DataItemsTypography from "./dataItemsTypography";
import Treeview from "../treeview";

const DataItemSubCategory = ({id,name,data,prompt,required,category}) => {

    const dispatch = useDispatch()

    let categorySubs=window.systemCategories.getChannelSubs(category);

    const handleSelect = (nodeIds) => {
        dispatch(setFieldValue({index:id,value:nodeIds}));
    };


    useEffect(() => {
        dispatch(setupField({index: id, value: data,required:required}))
    },[]);



    return (
        <Grid container spacing = {2}>
            <Grid item md={4}>
                <DataItemsTypography name={name} prompt={prompt} required={required}/>
            </Grid>
            <Grid item md={8}>
                <Treeview multi={true} levels={3} setFunction={handleSelect} treeData={categorySubs} selected={data}/>

            </Grid>

    </Grid>

    )
}



export default DataItemSubCategory;