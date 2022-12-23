import React from "react";
import { Button, Stack, Toolbar } from "@mui/material";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import DataCard from "../featureCards/dataCard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { newSearch, setFeatures } from "../../redux/slices/searchDrawerSlice";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { setItems } from "../../redux/slices/basketSlice";

export default function BasketDisplay({ field }) {
  const dispatch = useDispatch();
  const features = useSelector((state) => state.searchDraw.features);
  const items = useSelector((state) => state.basketSlice.items);

  useEffect(() => {
    if (items.length > 0) {
      dispatch(newSearch({ categories: "*", fids: items, rewrite: false }));
    } else {
      dispatch(setFeatures(undefined));
    }
  }, [items]);

  function BasketNav() {
    return (
      <Toolbar>
		<Button startIcon={<ClearAllIcon />} onClick={() => dispatch(setItems([]))}>Clear</Button>
      </Toolbar>
    );
  }

  if (features && features.features && features.features.length > 0) {
    let featureArray = [];
    features.features.forEach((feature) => {
      featureArray.push(
        <DataCard
          key={v4()}
          clickEnabled={false}
          feature={feature}
          field={field}
          sx={{
            //TODO move into config
            borderRadius: "5px",
            border: "1px solid rgb(228, 230, 230)",
            margin: "5px",
            backgroundColor: "rgba(218, 210, 210, 0.03)",
          }}
        ></DataCard>
      );
    });
    return (
      <>
        <BasketNav />
        {featureArray}
      </>
    );
  } else {
    return (
      <Stack>
        <p>Nothing in your basket</p>
      </Stack>
    );
  }
}
