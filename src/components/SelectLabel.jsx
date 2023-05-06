import { Close } from "@mui/icons-material";
import { Box, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const SelectLabel = ({ open, handleClose, label }) => {
  const style = {
    position: "absolute",
    top: "5%",
    left: "5%",
    transform: "translate(-5%, -5%)",
    width: { xs: 400 },
    height: 150,
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="flex justify-between">
            <Typography id="transition-modal-title" variant="h5" fontSize="20px" fontWeight="600" color="#192F60">
              Select {label}
            </Typography>
            <div className="cursor-pointer" onClick={handleClose}>
              <Close />
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SelectLabel;
