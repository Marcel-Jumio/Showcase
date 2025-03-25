import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

function RulesDataTable({ rules, setRules }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'rule_category', headerName: 'Category', width: 150 },
    { field: 'rule_name', headerName: 'Rule Name', width: 200 },
    { field: 'rule_labels', headerName: 'Label', width: 150 },
    { 
      field: 'rule_lhs', 
      headerName: 'Syntax', 
      width: 900,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      )
    },
    { field: 'score', headerName: 'Score', type: 'number', width: 100, editable: true }
  ];

  const processRowUpdate = (newRow, oldRow) => {
    console.log("Row updated from:", oldRow, "to:", newRow);
    // Update the state with the new row data
    setRules((prevRules) =>
      prevRules.map((rule) => (rule.id === newRow.id ? newRow : rule))
    );
    return newRow;
  };

  const handleProcessRowUpdateError = (error) => {
    console.error("Row update error:", error);
  };

  return (
    <Box sx={{ height: 1100, width: 1700, maxWidth: '100%', backgroundColor: '#f0f0f0', p: 2 }}>
      {rules && rules.length > 0 ? (
        <DataGrid
          rows={rules}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          experimentalFeatures={{ newEditingApi: true }} // if required by your version
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#d0d0d0',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              fontSize: '1rem'
            },
          }}
        />
      ) : (
        <Typography>No rules to display.</Typography>
      )}
    </Box>
  );
}

export default RulesDataTable;
