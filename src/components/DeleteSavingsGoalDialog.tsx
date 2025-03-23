import { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { trashIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { createPortal } from "react-dom";
import { useNotification } from "@/components/context/NotificationsProvider";

interface DeleteSavingsGoalDialogProps {
    id: string;
    deleteSavingsGoal: (id: string) => void
}

interface NotificationState {
  success: boolean,
  error: boolean,
}

export function DeleteSavingsGoalDialog({
    id,
    deleteSavingsGoal
}: DeleteSavingsGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const { setNotificationMessage } = useNotification()

  const handleConfirm = () => {
    deleteSavingsGoal(id);
    setNotificationMessage("Saving goals deleted successfully")
    setOpen(false);
  };


  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <Button
        startIcon={<SvgIcon icon={trashIcon} />}
        rounded="large"
        className="bg-red-500 px-4 py-2 text-white hover:text-black hover:bg-white"
        onClick={handleOpenModal}
      >
        Delete
      </Button>
      {open &&
        createPortal(
          <Dialog title={'Please confirm'} width={300}>
            <p style={{ margin: '25px', textAlign: 'center' }}>Are you sure you want to delete this goal?</p>
              <DialogActionsBar layout="end">
                <Button
                  type="button"
                  themeColor="primary"
                  onClick={handleCloseModal}
                >
                  No
                </Button>
                <Button onClick={handleConfirm} themeColor="tertiary">
                  Yes
                </Button>
              </DialogActionsBar>
          </Dialog>,
          document.body
        )}
    </>
  );
}
