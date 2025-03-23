import { useState, useEffect } from "react";
import { SavingsGoal } from "@/lib/types";
import { useNotification } from "@/components/context/NotificationsProvider";
import { generateId, getRandomHSL, isSameDay } from "@/lib/utils";
import { Button } from "@progress/kendo-react-buttons";
import { plusIcon, plusOutlineIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { createPortal } from "react-dom";
import { Hint, Label } from "@progress/kendo-react-labels";
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
import { DatePicker } from '@progress/kendo-react-dateinputs';


interface AddSavingsGoalDialogProps {
    onAddSavingsGoal: (goal: Omit<SavingsGoal, "id">) => void;
    goal?: SavingsGoal 
}

interface NotificationState {
  success: boolean,
  error: boolean,
}

export function AddSavingsGoalDialog({
    onAddSavingsGoal,
    goal
}: AddSavingsGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(goal ? goal.name : "");
  const [currentAmount, setCurrentAmount] = useState(goal ? goal.currentAmount : 0);
  const [targetAmount, setTargetAmount] = useState(goal ? goal.targetAmount : 0);
  const [deadline, setDeadline] = useState(goal && goal.deadline ? new Date(goal.deadline) : new Date());

  const { setNotificationMessage } = useNotification()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGoal = {
        name,
        currentAmount: parseFloat(currentAmount),
        targetAmount: parseFloat(targetAmount),
        color: getRandomHSL(),
      };
    
    // add id if this is a new goal
    if (!goal) {
      newGoal['id'] = generateId()
    } else {
      newGoal['id'] = goal.id
    }

    // check if deadline is different from today's date
    if (!isSameDay(deadline, new Date())) {
      newGoal['deadline'] = new Date(deadline).toISOString()
    } else if (goal) {
      newGoal['deadline'] = goal.deadline
    }
    // console.log(newGoal);

    onAddSavingsGoal(newGoal);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNotificationMessage("success", goal ? "Savings goal updated" : "New savings goal added.")
    setName("");
    setTargetAmount(0);
    setCurrentAmount(0);
    setDeadline(new Date());
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <Button
        startIcon={<SvgIcon icon={goal ? plusIcon : plusOutlineIcon} fill={goal ? null : "white"} />}
        rounded="large"
        className="bg-primary px-4 py-2 text-white hover:text-black hover:bg-white"
        onClick={handleOpenModal}
      >
        {goal ? "Add funds" : "New Goal"}
      </Button>
      {open &&
        createPortal(
          <Dialog width={300}>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label editorId={"name"}>Name</Label>
                <Input
                  id={"name"}
                  value={name}
                  type="text"
                  onChange={(e: InputChangeEvent) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label editorId={"currentAmount"}>Current Amount</Label>
                <Input
                  id={"currentAmount"}
                  value={currentAmount}
                  type="number"
                  onChange={(e: InputChangeEvent) => setCurrentAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label editorId={"targetAmount"}>Target Amount</Label>
                <Input
                  id={"targetAmount"}
                  value={targetAmount}
                  type="number"
                  onChange={(e: InputChangeEvent) => setTargetAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Deadline</Label>
                <DatePicker value={deadline} onChange={({ value }) => {
                    setDeadline(value);
                }} />
                <Hint direction="end">If the deadline is the same as today's date, then the deadline is ignored</Hint>
              </div>
              <DialogActionsBar layout="end">
                <Button
                  type="button"
                  themeColor="primary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button disabled={!name || !targetAmount } type="submit" themeColor="tertiary">
                  {goal ? "Update Goal" : "Add Goal"}
                </Button>
              </DialogActionsBar>
            </form>
          </Dialog>,
          document.body
        )}
    </>
  );
}
