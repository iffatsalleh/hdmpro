"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Flame, Sparkles, CheckCircle } from "lucide-react";
import { saveOnboardingAction } from "@/app/actions/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    gender: "Lelaki",
    age: "28",
    height: "172",
    startingWeight: "85.0",
    targetWeight: "72.0",
    dietGoal: "FAT_LOSS",
    activityLevel: "MODERATE",
  });

  function updateField(key: string, val: string) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleFinish() {
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    const res = await saveOnboardingAction(data);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Gagal menyimpan maklumat.");
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center max-w-sm mx-auto">
      <Card className="flex flex-col gap-5 p-6 border-border">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Onboarding HDM</span>
          </div>
          <span>Langkah {step} / 3</span>
        </div>

        {/* Progress line */}
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-danger/10 p-2.5 text-xs text-danger border border-danger/20">
            {error}
          </div>
        )}

        {/* Step 1: Maklumat Asas Fizikal */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold">Maklumat Fizikal Asas</h2>
              <p className="text-xs text-muted-foreground">
                Untuk kiraan BMR dan perancangan makro HDM anda.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Jantina</label>
              <div className="grid grid-cols-2 gap-2">
                {["Lelaki", "Wanita"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField("gender", g)}
                    className={`rounded-xl py-2.5 text-sm font-medium border transition-colors ${
                      formData.gender === g
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Umur (Tahun)"
                type="number"
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
              />
              <Input
                label="Tinggi (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => updateField("height", e.target.value)}
              />
            </div>

            <Button onClick={() => setStep(2)} className="mt-2 gap-1.5">
              <span>Seterusnya</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Berat Semasa & Sasaran */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold">Sasaran Berat Badan</h2>
              <p className="text-xs text-muted-foreground">
                Berapa berat permulaan anda dan sasaran yang ingin dicapai?
              </p>
            </div>

            <Input
              label="Berat Semasa (kg)"
              type="number"
              step="0.1"
              value={formData.startingWeight}
              onChange={(e) => updateField("startingWeight", e.target.value)}
            />

            <Input
              label="Sasaran Berat (kg)"
              type="number"
              step="0.1"
              value={formData.targetWeight}
              onChange={(e) => updateField("targetWeight", e.target.value)}
            />

            <div className="flex gap-2 mt-2">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => setStep(3)} className="flex-[2] gap-1.5">
                <span>Seterusnya</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Matlamat & Aktiviti */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold">Fokus Utama</h2>
              <p className="text-xs text-muted-foreground">
                Pilih objektif utama anda bersama Hardcore Diet Mastery.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { id: "FAT_LOSS", label: "Fat Loss (Penurunan Lemak Agresif)" },
                { id: "RECOMP", label: "Body Recomposition (Bina Otot & Kurang Lemak)" },
                { id: "MAINTAIN", label: "Maintenance & Ketahanan Disiplin" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateField("dietGoal", goal.id)}
                  className={`rounded-xl p-3 text-left text-xs font-medium border transition-colors ${
                    formData.dietGoal === goal.id
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary/60 border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={handleFinish} isLoading={loading} className="flex-[2] gap-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>Mula HDMPro</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
