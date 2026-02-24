"use client";

import { useState } from "react";
import { Settings, Save, RotateCcw } from "lucide-react";
import {
  PLATFORM_FEE_PERCENTAGE,
  PLATFORM_FEE_CAP_CENTS,
  MIN_PRICE_CENTS,
  MAX_PRICE_CENTS,
  formatCents,
} from "@/lib/fees";

interface PlatformSettings {
  feePercentage: number;
  feeCapCents: number;
  minPriceCents: number;
  maxPriceCents: number;
  defaultServiceRadiusMiles: number;
  requestExpirationHours: number;
  offerExpirationMinutes: number;
  maxOffersPerRequest: number;
  requireStripeOnboarding: boolean;
  autoExpireRequests: boolean;
}

const defaultSettings: PlatformSettings = {
  feePercentage: PLATFORM_FEE_PERCENTAGE * 100,
  feeCapCents: PLATFORM_FEE_CAP_CENTS,
  minPriceCents: MIN_PRICE_CENTS,
  maxPriceCents: MAX_PRICE_CENTS,
  defaultServiceRadiusMiles: 15,
  requestExpirationHours: 2,
  offerExpirationMinutes: 30,
  maxOffersPerRequest: 10,
  requireStripeOnboarding: true,
  autoExpireRequests: true,
};

function SettingsField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-8 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <label className="text-sm font-medium text-[#003366]">{label}</label>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      <div className="w-48 shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateSetting<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // This would POST to an admin settings API endpoint
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
    } catch {
      // Ignore for now
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setSettings(defaultSettings);
    setSaved(false);
  }

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#003366] focus:border-[#FF6700] focus:outline-none focus:ring-1 focus:ring-[#FF6700]";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003366]">Settings</h1>
          <p className="mt-1 text-gray-500">Configure platform parameters and defaults</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF6700] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF6700]/90 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Fee Settings */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#FF6700]" />
          <h2 className="text-lg font-semibold text-[#003366]">Fee Structure</h2>
        </div>

        <SettingsField
          label="Platform Fee Percentage"
          description={`Current: ${settings.feePercentage}% of each job's agreed price`}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={settings.feePercentage}
              onChange={(e) => updateSetting("feePercentage", parseFloat(e.target.value) || 0)}
              className={inputClasses}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Fee Cap"
          description={`Maximum fee charged per job. Current: ${formatCents(settings.feeCapCents)}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={settings.feeCapCents}
              onChange={(e) => updateSetting("feeCapCents", parseInt(e.target.value) || 0)}
              className={inputClasses}
            />
            <span className="text-xs text-gray-400">cents</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Minimum Price"
          description={`Lowest price a customer can offer. Current: ${formatCents(settings.minPriceCents)}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              min={0}
              step={500}
              value={settings.minPriceCents}
              onChange={(e) => updateSetting("minPriceCents", parseInt(e.target.value) || 0)}
              className={inputClasses}
            />
            <span className="text-xs text-gray-400">cents</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Maximum Price"
          description={`Highest price a customer can offer. Current: ${formatCents(settings.maxPriceCents)}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              min={0}
              step={5000}
              value={settings.maxPriceCents}
              onChange={(e) => updateSetting("maxPriceCents", parseInt(e.target.value) || 0)}
              className={inputClasses}
            />
            <span className="text-xs text-gray-400">cents</span>
          </div>
        </SettingsField>
      </div>

      {/* Service Defaults */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#FF6700]" />
          <h2 className="text-lg font-semibold text-[#003366]">Service Defaults</h2>
        </div>

        <SettingsField
          label="Default Service Radius"
          description="Default max distance for providers in miles"
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={50}
              value={settings.defaultServiceRadiusMiles}
              onChange={(e) => updateSetting("defaultServiceRadiusMiles", parseInt(e.target.value) || 15)}
              className={inputClasses}
            />
            <span className="text-sm text-gray-500">mi</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Request Expiration"
          description="How long ASAP requests stay open before auto-expiring"
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={24}
              value={settings.requestExpirationHours}
              onChange={(e) => updateSetting("requestExpirationHours", parseInt(e.target.value) || 2)}
              className={inputClasses}
            />
            <span className="text-sm text-gray-500">hrs</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Offer Expiration"
          description="How long provider offers remain valid"
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={120}
              value={settings.offerExpirationMinutes}
              onChange={(e) => updateSetting("offerExpirationMinutes", parseInt(e.target.value) || 30)}
              className={inputClasses}
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Max Offers Per Request"
          description="Maximum number of offers a request can receive"
        >
          <input
            type="number"
            min={1}
            max={50}
            value={settings.maxOffersPerRequest}
            onChange={(e) => updateSetting("maxOffersPerRequest", parseInt(e.target.value) || 10)}
            className={inputClasses}
          />
        </SettingsField>
      </div>

      {/* Toggles */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#FF6700]" />
          <h2 className="text-lg font-semibold text-[#003366]">Feature Flags</h2>
        </div>

        <SettingsField
          label="Require Stripe Onboarding"
          description="Providers must complete Stripe Connect onboarding before accepting jobs"
        >
          <button
            onClick={() => updateSetting("requireStripeOnboarding", !settings.requireStripeOnboarding)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.requireStripeOnboarding ? "bg-[#FF6700]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                settings.requireStripeOnboarding ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsField>

        <SettingsField
          label="Auto-Expire Requests"
          description="Automatically expire requests that pass their expiration time"
        >
          <button
            onClick={() => updateSetting("autoExpireRequests", !settings.autoExpireRequests)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.autoExpireRequests ? "bg-[#FF6700]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                settings.autoExpireRequests ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsField>
      </div>
    </div>
  );
}
