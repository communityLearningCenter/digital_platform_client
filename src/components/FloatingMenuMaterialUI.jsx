import { useState, useRef } from "react";
import { Fab, Tooltip, Popper, Paper, IconButton, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function FloatingMenuMaterialUI({
  tooltip = "Menu",
  actions = [],
  position = { bottom: 32, right: 32 },
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleActionClick = (action) => {
    setOpen(false);
    if (action.onClick) action.onClick();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: position.bottom,
        right: position.right,
        zIndex: 9999,
      }}
    >
      <Tooltip title={tooltip} placement="left">
        <Fab
          color="primary"
          ref={anchorRef}
          onClick={handleToggle}
          aria-controls={open ? "floating-menu-list" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {open ? <CloseIcon /> : <AddIcon />}
        </Fab>
      </Tooltip>

      {/* ✅ Only render Popper when ref exists */}
      {anchorRef.current && (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="top-start"
          disablePortal
          modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
          sx={{ zIndex: 9999 }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {actions.map((action) => (
                    <Tooltip key={action.id} title={action.label} placement="left">
                      <IconButton
                        color="primary"
                        onClick={() => handleActionClick(action)}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Popper>
      )}
    </Box>
  );
}