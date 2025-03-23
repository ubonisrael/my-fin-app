import { useState, useEffect } from "react";
import { Transaction, TransactionType, TransactionCategory } from "@/lib/types";
import { Button } from "@progress/kendo-react-buttons";
import { plusOutlineIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { createPortal } from "react-dom";
import { FloatingLabel, Hint, Label } from "@progress/kendo-react-labels";
import {
  Input,
  InputChangeEvent,
  TextArea,
  TextAreaChangeEvent,
} from "@progress/kendo-react-inputs";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { useNotification } from "@/components/context/NotificationsProvider";

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  type?: TransactionType;
}

export function AddTransactionDialog({
  onAddTransaction,
  type = "expense",
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(type);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "">("");

  const { setNotificationMessage } = useNotification()

  const transactionTypes: string[] = ['expense', 'income']

  const incomeCategories: TransactionCategory[] = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Other Income",
  ];

  const expenseCategories: TransactionCategory[] = [
    "Housing",
    "Transportation",
    "Food",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Education",
    "Personal",
    "Debt",
    "Other Expenses",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction = {
      amount: parseFloat(amount),
      description,
      category: category as TransactionCategory,
      date: new Date().toISOString(),
      type: transactionType,
    };
    // console.log(newTransaction);

    onAddTransaction(newTransaction);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNotificationMessage("Transaction added successfully")
    setAmount("");
    setDescription("");
    setCategory("");
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // reset category after transaction type is changed
  useEffect(() => {
    setCategory("");
  }, [transactionType]);

  return (
    <>
      <Button
        startIcon={<SvgIcon icon={plusOutlineIcon} fill="white" />}
        rounded="large"
        className="bg-primary px-4 py-2 text-white hover:text-black hover:bg-white"
        onClick={handleOpenModal}
      >
        Add Transaction
      </Button>
      {open &&
        createPortal(
          <Dialog width={300}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <DropDownList
                  data={transactionTypes}
                  onChange={(event: DropDownListChangeEvent) => {
                    setTransactionType(event.target.value);
                  }}
                  value={transactionType}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label editorId={"amount"}>Amount</Label>
                <Input
                  id={"amount"}
                  value={amount}
                  type="number"
                  onChange={(e: InputChangeEvent) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label editorId={"description"}>Description</Label>
                <TextArea
                  id={"description"}
                  value={description}
                  rows={5}
                  maxLength={50}
                  className="w-full"
                  onChange={(e: TextAreaChangeEvent) => setDescription(e.target.value)}
                />
              <Hint direction="end">{description.length} / 50</Hint>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <DropDownList
                  data={
                    transactionType === "income"
                      ? incomeCategories
                      : expenseCategories
                  }
                  onChange={(event: DropDownListChangeEvent) =>
                    setCategory(event.target.value)
                  }
                  value={category}
                />
              </div>
              <DialogActionsBar layout="end">
                <Button
                  type="button"
                  themeColor="primary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button disabled={!amount || !description || !category} type="submit" themeColor="tertiary">
                  Add Transaction
                </Button>
              </DialogActionsBar>
            </form>
          </Dialog>,
          document.body
        )}
    </>
  );
}
