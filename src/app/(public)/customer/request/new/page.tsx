"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Car,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Clock,
  Calendar,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PriceTag } from "@/components/marketplace/PriceTag";
import { brand, vehicleConditions, urgencyTiers, priceGuidance } from "@/config/brand";
import {
  formatCents,
  dollarsToCents,
  validatePrice,
  calculateFees,
  getFeeExplanation,
} from "@/lib/fees";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type UrgencyKey = keyof typeof urgencyTiers;

interface FormData {
  pickupAddress: string;
  dropoffAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleCondition: string;
  urgency: UrgencyKey;
  priceDollars: string;
  notes: string;
}

const STEPS = [
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "vehicle", label: "Vehicle", icon: Car },
  { id: "price", label: "Price", icon: DollarSign },
  { id: "confirm", label: "Confirm", icon: CheckCircle },
] as const;

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    pickupAddress: "",
    dropoffAddress: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleCondition: "runs",
    urgency: "today",
    priceDollars: "",
    notes: "",
  });

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return formData.pickupAddress.trim().length > 0 && formData.dropoffAddress.trim().length > 0;
      case 1:
        return (
          formData.vehicleMake.trim().length > 0 &&
          formData.vehicleModel.trim().length > 0 &&
          formData.vehicleYear.trim().length > 0
        );
      case 2: {
        const cents = dollarsToCents(formData.priceDollars);
        return cents > 0 && !validatePrice(cents);
      }
      case 3:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceInCents: dollarsToCents(formData.priceDollars),
        }),
      });

      if (!response.ok) throw new Error("Failed to create request");

      const data = await response.json();
      toast.success("Request created! Waiting for operator responses.");
      router.push(`/customer/request/${data.id || "new"}`);
    } catch {
      toast.error("Could not create request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const priceInCents = dollarsToCents(formData.priceDollars || "0");
  const priceError = formData.priceDollars ? validatePrice(priceInCents) : null;

  return (
    <SectionWrapper>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Request a Tow
          </h1>
          <p className="mt-2 text-gray-600">
            Tell us where you are, where you need to go, and set your price.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  i === step && "bg-[#FF6700] text-white",
                  i < step && "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200",
                  i > step && "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {i < step ? <CheckCircle size={12} /> : <s.icon size={12} />}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn("w-6 h-0.5 mx-1", i < step ? "bg-green-300" : "bg-gray-200")} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Step 0: Locations */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Where is your vehicle?
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pickup" className="flex items-center gap-1.5 mb-1.5">
                      <MapPin size={14} className="text-green-600" />
                      Pickup Location
                    </Label>
                    <Input
                      id="pickup"
                      placeholder="Enter pickup address..."
                      value={formData.pickupAddress}
                      onChange={(e) => update("pickupAddress", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoff" className="flex items-center gap-1.5 mb-1.5">
                      <MapPin size={14} className="text-red-600" />
                      Dropoff Location
                    </Label>
                    <Input
                      id="dropoff"
                      placeholder="Enter dropoff address..."
                      value={formData.dropoffAddress}
                      onChange={(e) => update("dropoffAddress", e.target.value)}
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">When do you need the tow?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(urgencyTiers) as [UrgencyKey, (typeof urgencyTiers)[UrgencyKey]][]).map(
                      ([key, tier]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => update("urgency", key)}
                          className={cn(
                            "rounded-xl border-2 p-3 text-center transition-all",
                            formData.urgency === key
                              ? "border-[#FF6700] bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex justify-center mb-1">
                            {key === "asap" && <Zap size={18} className="text-red-500" />}
                            {key === "today" && <Clock size={18} className="text-amber-500" />}
                            {key === "scheduled" && <Calendar size={18} className="text-blue-500" />}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{tier.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Vehicle */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tell us about your vehicle
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year" className="mb-1.5">Year</Label>
                    <Input
                      id="year"
                      placeholder="2020"
                      value={formData.vehicleYear}
                      onChange={(e) => update("vehicleYear", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="make" className="mb-1.5">Make</Label>
                    <Input
                      id="make"
                      placeholder="Honda"
                      value={formData.vehicleMake}
                      onChange={(e) => update("vehicleMake", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="model" className="mb-1.5">Model</Label>
                  <Input
                    id="model"
                    placeholder="Civic"
                    value={formData.vehicleModel}
                    onChange={(e) => update("vehicleModel", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Vehicle Condition</Label>
                  <Select
                    value={formData.vehicleCondition}
                    onValueChange={(val) => update("vehicleCondition", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleConditions.map((vc) => (
                        <SelectItem key={vc.value} value={vc.value}>
                          {vc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes" className="mb-1.5">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Anything the operator should know..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Price */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Set Your Price
                </h2>
                <p className="text-sm text-gray-600">
                  Name the price you want to pay. Operators can accept your price or send a counter-offer.
                </p>

                {/* Price guidance cards */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(priceGuidance).map((tier) => (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() =>
                        update("priceDollars", (tier.suggested / 100).toString())
                      }
                      className="rounded-xl border border-gray-200 p-3 text-left hover:border-[#FF6700]/30 hover:bg-orange-50/30 transition-all"
                    >
                      <p className="text-xs font-medium text-gray-500">{tier.label}</p>
                      <p className="text-lg font-bold text-gray-900 mt-0.5">
                        {formatCents(tier.suggested)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Range: {formatCents(tier.min)} &ndash; {formatCents(tier.max)}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Price input */}
                <div>
                  <Label htmlFor="price" className="mb-1.5">Your Offer</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      min="20"
                      max="500"
                      step="5"
                      placeholder="50"
                      className="pl-7 text-lg font-semibold"
                      value={formData.priceDollars}
                      onChange={(e) => update("priceDollars", e.target.value)}
                    />
                  </div>
                  {priceError && (
                    <p className="mt-1.5 text-sm text-red-600">{priceError}</p>
                  )}
                  {!priceError && priceInCents > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Info size={12} />
                      <span>{getFeeExplanation(priceInCents)}</span>
                    </div>
                  )}
                </div>

                {/* Fee breakdown preview */}
                {!priceError && priceInCents > 0 && (
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your offer</span>
                      <span className="font-medium">{formatCents(priceInCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform fee</span>
                      <span className="font-medium">
                        {formatCents(calculateFees(priceInCents).platformFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-900 font-medium">Provider receives</span>
                      <span className="font-bold text-green-700">
                        {formatCents(calculateFees(priceInCents).providerPayout)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirm Your Request
                </h2>

                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Route</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 text-green-600 shrink-0" />
                        <p className="text-sm text-gray-900">{formData.pickupAddress}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 text-red-600 shrink-0" />
                        <p className="text-sm text-gray-900">{formData.dropoffAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Vehicle</p>
                    <p className="text-sm text-gray-900">
                      {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Condition: {vehicleConditions.find((v) => v.value === formData.vehicleCondition)?.label}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Pricing</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <PriceTag priceInCents={priceInCents} size="lg" />
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        formData.urgency === "asap" && "bg-red-100 text-red-800",
                        formData.urgency === "today" && "bg-amber-100 text-amber-800",
                        formData.urgency === "scheduled" && "bg-blue-100 text-blue-800"
                      )}>
                        {urgencyTiers[formData.urgency].label}
                      </Badge>
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</p>
                      <p className="text-sm text-gray-700">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className="text-gray-600"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Back
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-[#FF6700] hover:bg-[#e55d00] text-white"
                >
                  Continue
                  <ArrowRight size={16} className="ml-1.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#FF6700] hover:bg-[#e55d00] text-white"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                  <CheckCircle size={16} className="ml-1.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
