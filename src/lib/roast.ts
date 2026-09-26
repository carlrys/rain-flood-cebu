import type { HazardLevel, RainInfo } from './types'

export type RainLevel = 0 | 1 | 2 | 3 // none, light, moderate, heavy

export function rainLevelFrom(rain: RainInfo): RainLevel {
  const { precipitationProbability: prob, precipitationMm: mm } = rain
  if (prob >= 70 || mm >= 4) return 3
  if (prob >= 40 || mm >= 1) return 2
  if (prob >= 15 || mm > 0) return 1
  return 0
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

// [rainLevel][hazardLevel] -> pool of roast lines
const MATRIX: Record<RainLevel, Record<HazardLevel, string[]>> = {
  0: {
    0: [
      "Bone dry, zero flood history. Even the weather looked at your location and said 'nah, not worth the effort.' ☀️",
      "No rain, no flood risk, no excuse — you're just built different, and by different I mean lazy.",
      "Clear skies, empty forecast, empty personality. Truly the human equivalent of a blank canvas nobody asked for.",
    ],
    1: [
      "Dry today, but you're squatting on a low flood-hazard spot like it's a personality trait. Bold of you to relax.",
      "No rain, mild flood rap sheet. You're one lazy nap away from becoming a cautionary tale, champ.",
    ],
    2: [
      "Sunny and dry — for now. You're living on medium flood-hazard ground with the confidence of someone who's never read a warning label.",
      "No rain in sight, yet this spot floods knee-deep on the regular. Enjoy the denial, it suits you.",
    ],
    3: [
      "Not a drop today, but you built your whole life on a HIGH flood-hazard zone. Absolute legend move. Historically a terrible one.",
      "Dry now. This is the calm before the storm you were warned about, ignored, and will somehow be shocked by anyway.",
    ],
  },
  1: {
    0: [
      "A pathetic little drizzle's brewing. No flood history, so even the sky can't be bothered to try with you.",
      "Slight rain chance, zero flood record. Relax, nobody's coming for your ankles today, unlike your reputation.",
    ],
    1: [
      "Light rain incoming on a low-hazard spot. Grab an umbrella — can't fix your personality, but at least your hair's covered.",
      "Drizzle likely. Mild flood history here, mildly annoying, kind of like you at a group chat.",
    ],
    2: [
      "Light rain, but you're on medium-hazard ground. Get your junk off the floor before you're ugly-crying about your PS5 later.",
      "A little rain today on a spot that's flooded to the knees before. Stay alert, or stay wet and dramatic about it.",
    ],
    3: [
      "Only light rain expected, but this is HIGH flood-hazard ground. It barely needs to try to ruin your whole week, much like you barely try at anything.",
      "Small drizzle, massive flood reputation. This spot goes over 1.5m and you're still out here vibing like it's fine.",
    ],
  },
  2: {
    0: [
      "Decent rain chance, no flood hazard on record. Bring an umbrella, not your fake survival-guy energy.",
      "Moderate rain coming, no flood history. You're safe — congrats on winning something that had nothing to do with you.",
    ],
    1: [
      "Moderate rain, low-hazard flood spot. Should be okay. 'Should' is carrying this entire forecast on its back.",
      "Rain's coming for real now. Mild flood history — keep half an eye out, assuming you remember how eyes work.",
    ],
    2: [
      "Moderate-to-heavy rain on a medium flood-hazard zone. Move your stuff off the floor, genius, before it becomes soup. ☔",
      "Rain's picking up on ground that's flooded waist-deep before. Plan your route home like a functioning adult, if you can manage it.",
    ],
    3: [
      "Solid rain AND a HIGH flood-hazard zone. This exact combo makes the evening news, and you'll be the punchline.",
      "Moderate rain, historically brutal flooding ground. Don't park low, don't linger, don't be the guy the barangay talks about for years. 🌊",
    ],
  },
  3: {
    0: [
      "Heavy rain incoming, no flood hazard mapped here. Get inside anyway — you're not invincible, you just think you are.",
      "Downpour alert. No flood history, but that umbrella's non-negotiable today, unlike your decision-making skills.",
    ],
    1: [
      "Heavy rain, low-hazard spot. Probably fine. 'Probably' is exactly the word engraved on regrettable headlines.",
      "Big rain coming. Mild flood history — charge your phone in case your luck, like your umbrella, gives out.",
    ],
    2: [
      "Heavy rain on a medium-hazard flood zone. Move the car NOW, not after you finish your fifth replay of that video.",
      "Serious downpour on ground that's flooded to the waist before. Plan an alternate route right now, not after you've already regretted it.",
    ],
    3: [
      "MAXIMUM CHAOS: heavy rain AND a high flood-hazard zone with 1.5m+ history. Cancel your plans, you absolute walking disaster magnet. 🚨",
      "Heavy rain, high-hazard zone, over 1.5m of flooding on record. This is not a drill — move, now, before you become a group chat cautionary tale.",
    ],
  },
}

export function getRoast(rain: RainInfo, hazardLevel: HazardLevel): string {
  const rainLevel = rainLevelFrom(rain)
  return pick(MATRIX[rainLevel][hazardLevel])
}
