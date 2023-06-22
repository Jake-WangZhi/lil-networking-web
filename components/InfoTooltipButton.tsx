import { Tooltip, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { Info, X } from "react-feather";
import { Button } from "./Button";

export const InfoTooltipButton = () => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const tooltipContent = (
    <div className="flex justify-between px-2 py-3">
      <div>
        <Typography variant="body1">
          Past due: Items that have been actionable for 10+ days
        </Typography>
        <br />
        <Typography variant="body1">
          New Actions: Items that have been actionable between 0-10 days.
        </Typography>
      </div>
      <div className="flex items-start">
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ zIndex: 10, height: "auto" }}
        >
          <X size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </Button>
      </div>
    </div>
  );

  return (
    <Button variant="text" onClick={handleClick} sx={{ px: "8px" }}>
      <Tooltip
        open={open}
        onClose={handleClose}
        title={tooltipContent}
        arrow
        placement="bottom-start"
      >
        <Info
          size={32}
          fill="white"
          color="#0F1A24"
          className="md:w-10 md:h-10 lg:w-12 lg:h-12 "
        />
      </Tooltip>
    </Button>
  );
};
