import { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { trashIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { createPortal } from "react-dom";
import { useNotification } from "@/components/context/NotificationsProvider";

interface ClearTransactionsDialogProps {
    handleClearTransactions: () => void
}

export function ClearTransactionsDialog({
    handleClearTransactions
}: ClearTransactionsDialogProps) {
  const [open, setOpen] = useState(false);
  const { setNotificationMessage } = useNotification()

  const handleConfirm = () => {
    handleClearTransactions();
    setNotificationMessage("All transactions successfully cleared")
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
        Clear Transactions
      </Button>
      {open &&
        createPortal(
          <Dialog title={'Please confirm'} width={300}>
            <p style={{ margin: '25px', textAlign: 'center' }}>Are you sure you want to clear all transactions?</p>
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
