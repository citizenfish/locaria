import React, {useEffect, useState,useCallback} from "react"
import Box from "@mui/material/Box";
import StripedDataGrid from "../../widgets/data/stripedDataGrid";

export default function AdminRowEditor(props) {

    const [tableData,setTableData] = useState([])
    const columns = [
        {field: 'key', headerName: 'Column', flex: 0.25, minWidth: 100},
        {field: 'value', headerName: 'Value', flex: 0.75,  minWidth: 300, editable: true}
    ]

    useEffect(() => {

        //console.log(props.rowData)
        let rows = []
        let id = 0
        for(let i in props.rowData.data){
           rows.push({
               id: id++,
               key : i,
               value: props.rowData.data[i]
           })
        }
        setTableData(rows)
    },[])

    const handleRowEditStop = (params, event) => {
        console.log(params)
        console.log(event)
    }

        return(
        <Box
            sx ={{
                minWidth: '800px'
            }}
        >
            <StripedDataGrid
                style={{width: '100%'}}
                columns={columns}
                rows={tableData}
                autoHeight
                rowHeight={30}
                editMode="row"
                onRowEditStop={handleRowEditStop}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'asc' }],
                    },
                }}
            />
        </Box>
    )
}