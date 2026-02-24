"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Bell,
  MapPin,
  Truck,
  Save,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { chicagoCommunityAreas, equipmentTypes } from "@/config/brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Placeholder profile data
const initialProfile = {
  firstName: "Mike",
  lastName: "Rodriguez",
  email: "mike@mikestowing.com",
  phone: "(312) 555-0142",
  equipmentType: "flatbed",
  vehicleInfo: "2020 Ford F-550",
  selectedAreas: [22, 24, 7, 6, 21, 5], // Logan Square, West Town, Lincoln Park, Lake View, Avondale, North Center
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  soundAlerts: true,
  maxDistance: "5",
};

export default function ProviderSettingsPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArea(areaNumber: number) {
    setProfile((prev) => ({
      ...prev,
      selectedAreas: prev.selectedAreas.includes(areaNumber)
        ? prev.selectedAreas.filter((a) => a !== areaNumber)
        : [...prev.selectedAreas, areaNumber],
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/providers/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      toast.success("Settings saved!");
    } catch {
      toast.error("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/provider"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User size={18} className="text-gray-500" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="mb-1.5">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-1.5">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="settingsEmail" className="mb-1.5">Email</Label>
                <Input
                  id="settingsEmail"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settingsPhone" className="mb-1.5">Phone</Label>
                <Input
                  id="settingsPhone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck size={18} className="text-gray-500" />
                Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5">Equipment Type</Label>
                <Select
                  value={profile.equipmentType}
                  onValueChange={(val) => updateField("equipmentType", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((eq) => (
                      <SelectItem key={eq.value} value={eq.value}>
                        {eq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicleInfoSetting" className="mb-1.5">Tow Vehicle</Label>
                <Input
                  id="vehicleInfoSetting"
                  value={profile.vehicleInfo}
                  onChange={(e) => updateField("vehicleInfo", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell size={18} className="text-gray-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "pushNotifications" as const, label: "Push Notifications", desc: "Get notified when new requests appear" },
                { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive payout and account emails" },
                { key: "smsNotifications" as const, label: "SMS Notifications", desc: "Text messages for urgent requests" },
                { key: "soundAlerts" as const, label: "Sound Alerts", desc: "Play a sound for new requests" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField(item.key, !profile[item.key])}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      profile[item.key] ? "bg-[#FF6700]" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        profile[item.key] ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              ))}

              <Separator />

              <div>
                <Label htmlFor="maxDistance" className="mb-1.5">Max Request Distance (miles)</Label>
                <Select
                  value={profile.maxDistance}
                  onValueChange={(val) => updateField("maxDistance", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["2", "5", "10", "15", "25"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d} miles
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin size={18} className="text-gray-500" />
                Service Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Info size={12} />
                <span>{profile.selectedAreas.length} areas selected</span>
                <button
                  type="button"
                  onClick={() => updateField("selectedAreas", [])}
                  className="text-[#FF6700] hover:underline"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "selectedAreas",
                      chicagoCommunityAreas.map((a) => a.number)
                    )
                  }
                  className="text-[#FF6700] hover:underline"
                >
                  Select all
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 p-4">
                {chicagoCommunityAreas.map((area) => {
                  const isSelected = profile.selectedAreas.includes(area.number);
                  return (
                    <button
                      key={area.number}
                      type="button"
                      onClick={() => toggleArea(area.number)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium border transition-all",
                        isSelected
                          ? "bg-[#FF6700] text-white border-[#FF6700]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#FF6700]/50"
                      )}
                    >
                      {area.name}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#FF6700] hover:bg-[#e55d00] text-white px-8"
            >
              <Save size={16} className="mr-1.5" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
