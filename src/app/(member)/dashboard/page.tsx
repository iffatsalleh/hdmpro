"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Scale,
  MessageSquare,
  Flame,
  CheckCircle2,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { LogWeightModal } from "@/components/dashboard/log-weight-modal";
import { LogFoodModal } from "@/components/dashboard/log-food-modal";
import { getDashboardDataAction } from "@/app/actions/dashboard";

interface MealItem {
  id: string;
  mealType: string;
  description: string;
  calories: number;
  protein: number;
  createdAt: string;
}

interface DashboardState {
  userName: string;
  currentStreak: number;
  startingWeight: number;
  currentWeight: number;
  targetWeight: number;
  remainingKg: number;
  lostSoFar: number;
  progressPercentage: number;
  calorieTarget: number;
  proteinTarget: number;
  todayCalories: number;
  todayProtein: number;
  caloriePercentage: number;
  proteinPercentage: number;
  todayMeals: MealItem[];
  onboardingCompleted: boolean;
}

export default function DashboardPage() {
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DashboardState>({
    userName: "Ahli HDM",
    currentStreak: 0,
    startingWeight: 0,
    currentWeight: 0,
    targetWeight: 0,
    remainingKg: 0,
    lostSoFar: 0,
    progressPercentage: 0,
    calorieTarget: 2000,
    proteinTarget: 150,
    todayCalories: 0,
    todayProtein: 0,
    caloriePercentage: 0,
    proteinPercentage: 0,
    todayMeals: [],
    onboardingCompleted: false,
  });

  const loadData = useCallback(async () => {
    try {
      const res = await getDashboardDataAction();
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasWeight = data.currentWeight > 0;
  const hasMeals = data.todayMeals.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Modals */}
      <LogWeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSuccess={loadData}
      />
      <LogFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Selamat datang, {data.userName} 👋
          </p>
          <h1 className="text-xl font-bold tracking-tight">Progres HDM Anda</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1.5 border border-border">
          <Flame className="h-4 w-4 text-warning fill-warning" />
          <span className="text-xs font-bold text-foreground">
            {data.currentStreak} Hari Streak
          </span>
        </div>
      </div>

      {/* Target Progress Card */}
      <Card variant="highlight" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Berat Semasa
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">
                {hasWeight ? data.currentWeight : "--"}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sasaran
            </span>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-xl font-bold text-primary">
                {data.targetWeight > 0 ? data.targetWeight : "--"}
              </span>
              <span className="text-xs font-medium text-muted-foreground">kg</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Kemajuan Sasaran</span>
            <span className="text-primary font-bold">
              {hasWeight ? `${data.progressPercentage}%` : "Belum Bermula"}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${hasWeight ? data.progressPercentage : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Mula: {data.startingWeight > 0 ? `${data.startingWeight} kg` : "--"}</span>
            <span>
              {hasWeight ? `Baki: ${data.remainingKg} kg` : "Sila timbang untuk mula"}
            </span>
          </div>
        </div>
      </Card>

      {/* Daily Macros Snapshot */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Kalori Hari Ini</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">{data.todayCalories.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">
              / {data.calorieTarget.toLocaleString()} kcal
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${data.caloriePercentage}%` }}
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Protein Hari Ini</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">{Math.round(data.todayProtein)}</span>
            <span className="text-xs text-muted-foreground">
              / {data.proteinTarget} g
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${data.proteinPercentage}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tindakan Pantas
        </span>
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
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Makanan Hari Ini
          </span>
          <span className="text-xs font-semibold text-primary">
            {data.todayMeals.length} Hidangan
          </span>
        </div>

        {hasMeals ? (
          <div className="flex flex-col gap-2">
            {data.todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-xl bg-secondary/60 p-2.5 border border-border/40"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">{meal.description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {meal.mealType} • {meal.protein}g protein
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-foreground shrink-0">
                  {meal.calories} kcal
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/30 border border-dashed border-border/80">
            <Utensils className="h-7 w-7 text-muted-foreground/50 mb-2" />
            <p className="text-xs font-semibold text-foreground">
              Belum ada makanan direkod hari ini
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              Tekan butang &apos;Log Makan&apos; di atas atau sembang dengan AI Coach untuk mula merekod hidangan anda.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
