import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Toggle Button */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "absolute",
          top: 10,
          left: open ? 160 : 10,
          zIndex: 1300,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 200 : 60,
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: open ? 200 : 60,
            overflowX: "hidden",
            transition: "width 0.3s",
          },
        }}
      >
        {open && (
          <List>
            <ListItem button component={Link} to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemText primary="Showcase" />
            </ListItem>
            <ListItem button component={Link} to="/Rules">
              <ListItemText primary="Rules" />
            </ListItem>
            <ListItem button component={Link} to="/Websdk">
              <ListItemText primary="WEB SDK" />
            </ListItem>
          </List>
        )}
      </Drawer>
    </Box>
  );
}
