import useLocalStorage from "use-local-storage";
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardCard } from '@/components/DashboardCard';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { DeleteSavingsGoalDialog } from '@/components/DeleteSavingsGoalDialog';
import { ClearGoalsDialog } from '@/components/ClearGoalsDialog';
import { SavingsGoal } from '@/lib/types';
import { mockSavingsGoals } from '@/lib/mockData';
import { Button } from "@progress/kendo-react-buttons";
import { formatCurrency, formatDate } from '@/lib/financeUtils';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import {
  plusIcon,
  calendarDateIcon,
  dribbbleIcon
} from "@progress/kendo-svg-icons";
import { SvgIcon } from '@progress/kendo-react-common';

const Savings = () => {
  const [savingsGoals, setSavingsGoals] = useLocalStorage<SavingsGoal[]>("savings", []);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
    setSavingsGoals((prev) => [...prev, goal])
  }
  const handleClearGoals = () => {
    setSavingsGoals([])
  }
  const handleUpdateSavingsGoal = (goal: SavingsGoal) => {
    setSavingsGoals((prev) => prev.map((g) => {
      if (g.id !== goal.id) {
        return g
      }
      return goal
    }))
  }
  const handleDeleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id))
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // setSavingsGoals(mockSavingsGoals);
      setIsLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
            <p className="text-muted-foreground">
              Track progress towards your financial goals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddSavingsGoalDialog onAddSavingsGoal={handleAddSavingsGoal} />
            <ClearGoalsDialog handleClearGoals={handleClearGoals} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array(4).fill(0).map((_, i) => (
              <DashboardCard key={i} isLoading={true} />
            ))
          ) : (
            savingsGoals.map((goal) => {
              const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              
              return (
                <DashboardCard
                  key={goal.id}
                  className="animate-fade-up animate-once"
                  style={{ animationDelay: `${savingsGoals.indexOf(goal) * 100}ms` }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div 
                          className="p-2 rounded-full mr-3"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <SvgIcon size="large" style={{ color: goal.color }} icon={dribbbleIcon} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{goal.name || goal.goal}</h3>
                          {goal.deadline && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <SvgIcon size="large" style={{ color: goal.color }} icon={calendarDateIcon} />
                              <span className="ml-2">Target: {formatDate(goal.deadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                      <AddSavingsGoalDialog onAddSavingsGoal={handleUpdateSavingsGoal} goal={goal} />
                      <DeleteSavingsGoalDialog deleteSavingsGoal={handleDeleteSavingsGoal} id={goal.id} />
                      </div>
                    </div>
                    
                    <div className="mt-2 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mt-auto">
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                      </span>
                      <span 
                        className="font-semibold"
                        style={{ color: goal.color }}
                      >
                        {progress}%
                      </span>
                    </div>
                  </div>
                </DashboardCard>
              );
            })
          )}
        </div>
        {!isLoading && !savingsGoals.length && (<div className="w-full text-center py-8 rounded-xl glass-card">
            <p className="text-muted-foreground">No goals to display.</p>
          </div>) }
      </div>
    </MainLayout>
  );
};

export default Savings;
