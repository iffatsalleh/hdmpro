"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserProfileAction, updateProfileAction } from "@/app/actions/profile";
import { signOut } from "next-auth/react";
import {
  User,
  Camera,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  LogOut,
  Mail,
} from "lucide-react";

const MALAYSIA_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya",
  "Luar Malaysia / Lain-lain",
];

const COUNTRIES = [
  "Malaysia",
  "Singapura",
  "Brunei",
  "Indonesia",
  "Thailand",
  "Australia",
  "United Kingdom",
  "Lain-lain",
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("new") === "1";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Malaysia");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await getUserProfileAction();
        if (profile) {
          setName(profile.name || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setState(profile.state || "");
          setCountry(profile.country || "Malaysia");
          if (profile.image) {
            setImagePreview(profile.image);
          }
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Saiz fail imej terlalu besar (maksimum 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImagePreview(compressedDataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          state,
          country,
          image: imagePreview || undefined,
        }),
      });

      const res = await response.json();
      setSubmitting(false);

      if (res.success) {
        setSuccessMsg("Profil berjaya dikemas kini!");
        if (isNewUser) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
        }
      } else {
        setErrorMsg(res.error || "Gagal mengemas kini profil.");
      }
    } catch {
      setSubmitting(false);
      setErrorMsg("Ralat rangkaian semasa mengemas kini profil.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Memuatkan profil...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Profil Ahli</h1>
        <p className="text-xs text-muted-foreground">
          Maklumat peribadi dan tetapan akaun Hardcore Diet Mastery anda.
        </p>
      </div>

      {isNewUser && (
        <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20 flex flex-col gap-1 text-xs text-foreground">
          <span className="font-bold text-primary flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Selamat Datang ke HDMPro!
          </span>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Sila semak nama anda, masukkan nombor telefon serta negeri untuk mula menggunakan sistem.
          </p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-success/15 p-3 text-xs text-success border border-success/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          {isNewUser && (
            <span className="text-[11px] font-semibold underline cursor-pointer" onClick={() => router.push("/dashboard")}>
              Ke Dashboard &rarr;
            </span>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-danger/10 p-3 text-xs text-danger border border-danger/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card className="p-5 border-border flex flex-col gap-5 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-2 pt-1 pb-2">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary border-2 border-border overflow-hidden shadow-inner">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Foto Profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <label
                htmlFor="avatar-input"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
                title="Tukar gambar profil"
              >
                <Camera className="h-4 w-4" />
              </label>

              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              Tekan ikon kamera untuk muat naik foto
            </span>
          </div>

          {/* Nama */}
          <Input
            label="Nama Penuh"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth: Ahmad Razak"
            required
          />

          {/* Emel (Auto Fetch) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Emel Berdaftar
              </span>
              <span className="text-[10px] text-muted-foreground">(Automatik)</span>
            </label>
            <input
              type="email"
              value={email}
              readOnly
              disabled
              className="w-full rounded-xl bg-muted/50 px-3.5 py-2.5 text-xs text-muted-foreground border border-border cursor-not-allowed select-none"
            />
          </div>

          {/* No Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Nombor Telefon
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="cth: 012-3456789"
              className="w-full rounded-xl bg-input px-3.5 py-2.5 text-xs text-foreground border border-border placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Negeri & Negara */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Negeri
              </label>
              <select
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl bg-input px-3 py-2.5 text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              >
                <option value="">Pilih Negeri</option>
                {MALAYSIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Negara
              </label>
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl bg-input px-3 py-2.5 text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Update Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-2 gap-2 font-bold tracking-wide"
            isLoading={submitting}
          >
            <span>KEMASKINI PROFIL</span>
            {isNewUser && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        {/* Action: Go to Dashboard directly */}
        {isNewUser && (
          <div className="pt-2 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              Langkau buat masa sekarang &rarr; Terus ke Dashboard
            </button>
          </div>
        )}
      </Card>

      {/* Logout Option */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center gap-2 text-xs font-medium text-danger/80 hover:text-danger hover:underline transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log Keluar dari Akaun</span>
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-muted-foreground p-8">Memuatkan profil...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
