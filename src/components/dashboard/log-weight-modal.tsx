"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, X } from "lucide-react";
import { logWeightAction } from "@/app/actions/weight";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LogWeightModal({ isOpen, onClose, onSuccess }: LogWeightModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await logWeightAction(formData);

    setLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || "Gagal merekod berat.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm flex flex-col gap-4 p-5 bg-card border-border shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Scale className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Log Berat Hari Ini</h2>
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
          <Input
            label="Berat Badan (kg)"
            name="weight"
            type="number"
            step="0.1"
            placeholder="cth: 78.4"
            required
            autoFocus
          />

          <Input
            label="Catatan (Pilihan)"
            name="notes"
            type="text"
            placeholder="cth: Selepas bangun tidur & buang air"
          />

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
