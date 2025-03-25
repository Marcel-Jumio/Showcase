import React, { useState } from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

function RuleSelection({ onSelectionChange }) {
  const [selections, setSelections] = useState([]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    let newSelections;
    if (checked) {
      newSelections = [...selections, name];
    } else {
      newSelections = selections.filter(item => item !== name);
    }
    setSelections(newSelections);
    if (onSelectionChange) {
      onSelectionChange(newSelections);
      console.log(newSelections)
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Select what you want
      </Typography>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={selections.includes("ID")}
              onChange={handleChange}
              name="ID"
            />
          }
          label="ID"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selections.includes("IV")}
              onChange={handleChange}
              name="IV"
            />
          }
          label="IV"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selections.includes("DocP")}
              onChange={handleChange}
              name="DocP"
            />
          }
          label="DocP"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selections.includes("Compare (DocP)")}
              onChange={handleChange}
              name="Compare (DocP)"
            />
          }
          label="Compare (DocP)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selections.includes("Compare (ID)")}
              onChange={handleChange}
              name="Compare (ID)"
            />
          }
          label="Compare (ID)"
        />
      </FormGroup>
      <div>
        Selected: {selections.join(", ")}
      </div>
    </div>
  );
}

export default RuleSelection;
