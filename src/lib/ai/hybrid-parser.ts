export interface FoodMatch {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Database makanan asas Malaysia & diet HDM (per serving piawai)
const FOOD_DATABASE: Record<string, FoodMatch> = {
  // Protein staples
  telur: { name: "Telur Rebus / Separuh Masak", calories: 75, protein: 6.5, carbs: 0.6, fat: 5 },
  "telur rebus": { name: "Telur Rebus", calories: 75, protein: 6.5, carbs: 0.6, fat: 5 },
  "telur goreng": { name: "Telur Goreng / Mata", calories: 95, protein: 6.5, carbs: 0.8, fat: 7.5 },
  "dada ayam": { name: "Dada Ayam (Grill / Rebus)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  ayam: { name: "Ayam", calories: 200, protein: 25, carbs: 0, fat: 10 },
  "ayam goreng": { name: "Ayam Goreng", calories: 260, protein: 22, carbs: 8, fat: 15 },
  ikan: { name: "Ikan (Bakar / Singgang)", calories: 140, protein: 24, carbs: 0, fat: 4 },
  "ikan goreng": { name: "Ikan Goreng", calories: 200, protein: 20, carbs: 4, fat: 12 },
  daging: { name: "Daging Lemak Rendah", calories: 220, protein: 26, carbs: 0, fat: 12 },
  salmon: { name: "Ikan Salmon", calories: 208, protein: 22, carbs: 0, fat: 13 },
  whey: { name: "Whey Protein Shake", calories: 120, protein: 24, carbs: 2, fat: 1.5 },
  protein: { name: "Protein Shake", calories: 120, protein: 24, carbs: 2, fat: 1.5 },
  tempe: { name: "Tempe", calories: 160, protein: 15, carbs: 8, fat: 9 },
  tauhu: { name: "Tauhu", calories: 80, protein: 8, carbs: 2, fat: 4.5 },

  // Karbohidrat & ruji
  nasi: { name: "Nasi Putih (1 Senduk)", calories: 150, protein: 3, carbs: 33, fat: 0.4 },
  "nasi putih": { name: "Nasi Putih (1 Senduk)", calories: 150, protein: 3, carbs: 33, fat: 0.4 },
  "nasi lemak": { name: "Nasi Lemak Biasa", calories: 450, protein: 10, carbs: 55, fat: 20 },
  roti: { name: "Roti Gandum / Putih (1 Keping)", calories: 75, protein: 3, carbs: 14, fat: 1 },
  "roti canai": { name: "Roti Canai (1 Keping)", calories: 300, protein: 6, carbs: 42, fat: 12 },
  oat: { name: "Oatmeal / Rolled Oats", calories: 150, protein: 5, carbs: 27, fat: 2.5 },
  bihun: { name: "Bihun Sup / Sup Sayur", calories: 250, protein: 12, carbs: 38, fat: 5 },
  mee: { name: "Mee / Kuey Teow", calories: 320, protein: 8, carbs: 45, fat: 12 },
  kentang: { name: "Kentang Rebus / Bakar", calories: 110, protein: 2.5, carbs: 25, fat: 0.2 },

  // Minuman
  "kopi o": { name: "Kopi O Kosong (Tanpa Gula)", calories: 5, protein: 0.3, carbs: 0.5, fat: 0 },
  "teh o": { name: "Teh O Kosong", calories: 2, protein: 0.1, carbs: 0.4, fat: 0 },
  kopi: { name: "Kopi Susu", calories: 140, protein: 3, carbs: 18, fat: 6 },
  "teh tarik": { name: "Teh Tarik", calories: 160, protein: 3, carbs: 22, fat: 7 },
  susu: { name: "Susu Segar (1 Cawan)", calories: 120, protein: 7, carbs: 10, fat: 6 },
  air: { name: "Air Kosong", calories: 0, protein: 0, carbs: 0, fat: 0 },

  // Buah & sayur
  pisang: { name: "Pisang (1 Biji)", calories: 90, protein: 1.1, carbs: 23, fat: 0.3 },
  epal: { name: "Epal (1 Biji)", calories: 75, protein: 0.4, carbs: 19, fat: 0.2 },
  sayur: { name: "Sayur Hijau / Salad", calories: 35, protein: 2, carbs: 5, fat: 0.5 },
  brokoli: { name: "Brokoli Rebus", calories: 45, protein: 3.5, carbs: 7, fat: 0.5 },
};

export interface ParsedDietResult {
  isFood: boolean;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DRINK" | "OTHER";
  description: string;
  totalCalories: number;
  totalProtein: number;
  itemsDetected: string[];
}

export function parseFoodInput(input: string): ParsedDietResult | null {
  const lower = input.toLowerCase();

  // Kata kunci makan/minum
  const hasFoodKeywords =
    /(makan|sarapan|lunch|dinner|minum|snack|snek|telur|ayam|nasi|roti|ikan|daging|oat|pisang|kopi|shake|protein)/i.test(
      lower
    );

  if (!hasFoodKeywords) return null;

  // Tentukan waktu hidangan
  let mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DRINK" | "OTHER" = "OTHER";
  if (/sarapan|pagi|breakfast/i.test(lower)) mealType = "BREAKFAST";
  else if (/lunch|tengah hari|siang/i.test(lower)) mealType = "LUNCH";
  else if (/dinner|malam/i.test(lower)) mealType = "DINNER";
  else if (/minum|kopi|teh|shake/i.test(lower) && !/makan/i.test(lower)) mealType = "DRINK";
  else if (/snek|snack|petang/i.test(lower)) mealType = "SNACK";

  let totalCalories = 0;
  let totalProtein = 0;
  const itemsDetected: string[] = [];

  // Semak setiap makanan dalam pangkalan data
  for (const [key, food] of Object.entries(FOOD_DATABASE)) {
    if (lower.includes(key)) {
      // Cari kuantiti sebelum atau selepas nama makanan (cth: "3 biji telur", "2 keping roti", "200g ayam")
      const qtyRegex = new RegExp(
        `(?:(\\d+)\\s*(?:biji|keping|ketul|senduk|mangkuk|pinggan|cawan|scoop|g|gram)?\\s*${key}|${key}\\s*(\\d+))`,
        "i"
      );
      const match = lower.match(qtyRegex);
      let quantity = 1;

      if (match) {
        const parsed = parseInt(match[1] || match[2], 10);
        if (parsed > 0 && parsed <= 20) {
          quantity = parsed;
        } else if (parsed > 20 && parsed <= 500) {
          // Jika dalam gram (cth: 200g)
          quantity = parsed / 100;
        }
      }

      const itemCalories = Math.round(food.calories * quantity);
      const itemProtein = Math.round(food.protein * quantity * 10) / 10;

      totalCalories += itemCalories;
      totalProtein += itemProtein;
      itemsDetected.push(`${quantity > 1 ? `${quantity}x ` : ""}${food.name}`);
    }
  }

  // Jika tiada makanan spesifik dijumpai dalam pangkalan data tapi user sebut makan
  if (itemsDetected.length === 0) {
    totalCalories = 400;
    totalProtein = 20;
    itemsDetected.push(input);
  }

  return {
    isFood: true,
    mealType,
    description: input,
    totalCalories,
    totalProtein: Math.round(totalProtein),
    itemsDetected,
  };
}

export interface ParsedWeightResult {
  weight: number;
}

export function parseWeightInput(input: string): ParsedWeightResult | null {
  const lower = input.toLowerCase();

  // Tangkap corak: "berat 78.4", "berat aku 78.4kg", "timbang 75", "78.4 kg"
  const match =
    lower.match(/(?:berat|timbang|weight)\s*(?:aku|pagi\s*ni|badan)?\s*[:=]?\s*(\d{2,3}(?:\.\d{1,2})?)/i) ||
    lower.match(/^(\d{2,3}(?:\.\d{1,2})?)\s*(?:kg|kilo)$/i) ||
    lower.match(/(\d{2,3}(?:\.\d{1,2})?)\s*(?:kg|kilo)/i);

  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (val >= 30 && val <= 300) {
      return { weight: val };
    }
  }

  return null;
}

export interface ParsedActivityResult {
  activityName: string;
  durationOrReps?: string;
  xpEarned: number;
}

export function parseActivityInput(input: string): ParsedActivityResult | null {
  const lower = input.toLowerCase();
  const isWorkout = /(workout|gym|senaman|jogging|lari|cardio|angkat berat|push up|sit up|tabata|hiit|treadmill)/i.test(
    lower
  );

  if (!isWorkout) return null;

  return {
    activityName: input,
    xpEarned: 15, // +15 XP untuk aktiviti fizikal / senaman
  };
}
