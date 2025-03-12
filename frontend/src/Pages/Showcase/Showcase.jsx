// Pages/Showcase/Showcase.jsx
import { Box, CssBaseline, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Paper, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConfigurablePayload from "./components/WfDefinition"; // adjust path as needed

export default function Showcase() {
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Process Steps
      </Typography>
      {/* Step 1 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Authorisation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button variant="contained" color="primary">
                Get access token
              </Button>
            </Grid>
            <Grid item>
              <Paper
                elevation={3}
                sx={{
                  width: "800px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  border: "1px solid #ccc",
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  Placeholder content
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Step 2 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Step 2: Data Collection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ConfigurablePayload />
        </AccordionDetails>
      </Accordion>

      {/* Step 3 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Step 3: Processing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Explanation of the processing phase.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Step 4 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Step 4: Finalization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Final steps and completion details.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
