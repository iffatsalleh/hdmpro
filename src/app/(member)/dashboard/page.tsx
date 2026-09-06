"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Scale, MessageSquare, Flame, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LogWeightModal } from "@/components/dashboard/log-weight-modal";
import { LogFoodModal } from "@/components/dashboard/log-food-modal";

export default function DashboardPage() {
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  // Dynamic state for optimistic interaction in Phase 2
  const [currentWeight, setCurrentWeight] = useState(78.4);
  const targetWeight = 72.0;
  const startingWeight = 88.0;

  const totalToLose = startingWeight - targetWeight;
  const lostSoFar = startingWeight - currentWeight;
  const progressPercent = Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)));
  const remainingKg = Math.max(0, Number((currentWeight - targetWeight).toFixed(1)));

  const [meals, setMeals] = useState([
    {
      id: "1",
      title: "Sarapan Pagi",
      desc: "3 Telur Rebus, 2 Roti Gandum",
      calories: 380,
    },
    {
      id: "2",
      title: "Makan Tengah Hari",
      desc: "Dada Ayam Panggang, Nasi 1 Senduk",
      calories: 560,
    },
  ]);

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const targetCalories = 2000;
  const caloriePercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));

  return (
    <div className="flex flex-col gap-5">
      {/* Modals */}
      <LogWeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSuccess={() => {}}
      />
      <LogFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Selamat pagi 👋</p>
          <h1 className="text-xl font-bold tracking-tight">Progres HDM Anda</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1.5 border border-border">
          <Flame className="h-4 w-4 text-warning fill-warning" />
          <span className="text-xs font-bold text-foreground">8 Hari Streak</span>
        </div>
      </div>

      {/* Target Progress Card */}
      <Card variant="highlight" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Berat Semasa</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">{currentWeight}</span>
              <span className="text-sm font-semibold text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sasaran</span>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-xl font-bold text-primary">{targetWeight}</span>
              <span className="text-xs font-medium text-muted-foreground">kg</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Kemajuan Sasaran</span>
            <span className="text-primary font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Mula: {startingWeight} kg</span>
            <span>Baki: {remainingKg} kg</span>
          </div>
        </div>
      </Card>

      {/* Daily Macros Snapshot */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Kalori Hari Ini</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">{totalCalories.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/ {targetCalories.toLocaleString()} kcal</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Protein Hari Ini</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">135</span>
            <span className="text-xs text-muted-foreground">/ 150 g</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tindakan Pantas</span>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="md"
            className="flex flex-col h-auto py-3 gap-1.5"
            onClick={() => setIsFoodModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Log Makan</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="flex flex-col h-auto py-3 gap-1.5"
            onClick={() => setIsWeightModalOpen(true)}
          >
            <Scale className="h-5 w-5 text-warning" />
            <span className="text-xs font-medium">Log Berat</span>
          </Button>
          <Link href="/coach" className="w-full">
            <Button variant="secondary" size="md" className="flex flex-col h-auto py-3 gap-1.5 w-full">
              <MessageSquare className="h-5 w-5 text-success" />
              <span className="text-xs font-medium">Tanya AI</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's Meals Timeline */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Makanan Hari Ini</span>
          <span className="text-xs font-semibold text-primary">{meals.length} Hidangan</span>
        </div>

        <div className="flex flex-col gap-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between rounded-xl bg-secondary/60 p-2.5 border border-border/40"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{meal.title}</p>
                  <p className="text-[11px] text-muted-foreground">{meal.desc}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-foreground shrink-0">{meal.calories} kcal</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
