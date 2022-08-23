import React from "react"
import { DataGrid, GridToolbarQuickFilter, gridClasses } from "@mui/x-data-grid"
import { alpha, styled } from '@mui/material/styles';

export default function StripedDataGrid(props) {

    const ODD_OPACITY = 0.2;

    const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
        [`& .${gridClasses.row}.even`]: {
            backgroundColor: theme.palette.grey[200],
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
            '&.Mui-selected': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY + theme.palette.action.selectedOpacity,
                ),
                '&:hover, &.Mui-hovered': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY +
                        theme.palette.action.selectedOpacity +
                        theme.palette.action.hoverOpacity,
                    ),
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        backgroundColor: alpha(
                            theme.palette.primary.main,
                            ODD_OPACITY + theme.palette.action.selectedOpacity,
                        ),
                    },
                },
            },
        },
    }));

    return (
        <StripedDataGrid     {...props}
                             disableColumnSelector
                             disableDensitySelector
                             components={{Toolbar: GridToolbarQuickFilter}}
                             getRowClassName={(params) =>
                                 params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                             }/>
    )

}