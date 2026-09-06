"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, X } from "lucide-react";
import { logFoodAction } from "@/app/actions/diet";

interface LogFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LogFoodModal({ isOpen, onClose, onSuccess }: LogFoodModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await logFoodAction(formData);

    setLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || "Gagal merekod makanan.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm flex flex-col gap-4 p-5 bg-card border-border shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <PlusCircle className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Log Hidangan Makanan</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-danger/10 p-2.5 text-xs text-danger border border-danger/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Waktu Hidangan</label>
            <select
              name="mealType"
              defaultValue="LUNCH"
              className="w-full rounded-xl bg-input px-3 py-2.5 text-sm text-foreground border border-border focus:border-primary focus:outline-none"
            >
              <option value="BREAKFAST">Sarapan Pagi (Breakfast)</option>
              <option value="LUNCH">Tengah Hari (Lunch)</option>
              <option value="DINNER">Malam (Dinner)</option>
              <option value="SNACK">Snek (Snack)</option>
              <option value="DRINK">Minuman (Drink)</option>
              <option value="OTHER">Lain-lain</option>
            </select>
          </div>

          <Input
            label="Penerangan Makanan / Menu"
            name="description"
            type="text"
            placeholder="cth: Dada ayam panggang + nasi 1 senduk"
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Kalori (kcal)"
              name="calories"
              type="number"
              placeholder="cth: 550"
              required
            />
            <Input
              label="Protein (g)"
              name="protein"
              type="number"
              step="0.1"
              placeholder="cth: 42"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" isLoading={loading}>
              Simpan (+10 XP)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
