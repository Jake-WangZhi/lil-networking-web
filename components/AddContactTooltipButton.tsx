import { Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import { PlusSquare, X } from "@phosphor-icons/react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { pauseFor } from "@/lib/utils";

interface Props {
  hasContacts?: boolean;
  hasShownTutorial?: boolean;
}

export const AddContactTooltipButton = ({
  hasContacts,
  hasShownTutorial,
}: Props) => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    pauseFor(3000).then(() => {
      if (hasContacts === false && hasShownTutorial === true)
        return setOpen(true);

      setOpen(false);
    });
  }, [hasContacts, hasShownTutorial]);

  const handleClick = useCallback(() => {
    setOpen(false);
    router.push("/contacts/create");
  }, [router]);

  const handleClose = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setOpen(false);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="flex justify-between space-x-2 items-center"
    >
      <div>
        <Typography variant="body1">Add contacts here</Typography>
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
      <Tooltip open={open} title={tooltipContent} arrow placement="left">
        <PlusSquare
          size={32}
          className="md:w-10 md:h-10 lg:w-12 lg:h-12 text-light-blue"
        />
      </Tooltip>
    </Button>
  );
};
