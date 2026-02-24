"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Truck,
  MapPin,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
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
import { brand, equipmentTypes, chicagoCommunityAreas } from "@/config/brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RegistrationData {
  // Step 0: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  // Step 1: Equipment
  equipmentType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  // Step 2: Service Areas
  selectedAreas: number[];
  // Step 3: Verification (file names for display)
  driversLicense: string;
  towingLicense: string;
  insuranceCert: string;
}

const STEPS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "equipment", label: "Equipment", icon: Truck },
  { id: "areas", label: "Service Areas", icon: MapPin },
  { id: "verification", label: "Verification", icon: FileCheck },
] as const;

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    equipmentType: "flatbed",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    selectedAreas: [],
    driversLicense: "",
    towingLicense: "",
    insuranceCert: "",
  });

  function update<K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArea(areaNumber: number) {
    setFormData((prev) => ({
      ...prev,
      selectedAreas: prev.selectedAreas.includes(areaNumber)
        ? prev.selectedAreas.filter((a) => a !== areaNumber)
        : [...prev.selectedAreas, areaNumber],
    }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return (
          formData.firstName.trim().length > 0 &&
          formData.lastName.trim().length > 0 &&
          formData.email.trim().length > 0 &&
          formData.phone.trim().length > 0
        );
      case 1:
        return (
          formData.vehicleMake.trim().length > 0 &&
          formData.vehicleModel.trim().length > 0 &&
          formData.vehicleYear.trim().length > 0
        );
      case 2:
        return formData.selectedAreas.length > 0;
      case 3:
        return true; // Documents are optional for now (placeholder)
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/providers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Registration failed");

      toast.success("Application submitted! We will review your registration within 24-48 hours.");
      router.push("/provider");
    } catch {
      toast.error("Could not submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionWrapper>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Become a Provider
          </h1>
          <p className="mt-2 text-gray-600">
            Join {brand.name} and start earning with your tow equipment.
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

        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Step 0: Personal Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="mb-1.5">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-1.5">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-1.5">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(312) 555-0000"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="mb-1.5">Business Address (optional)</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Chicago, IL"
                    value={formData.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Equipment */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Tow Equipment</h2>
                <div>
                  <Label className="mb-1.5">Equipment Type</Label>
                  <Select
                    value={formData.equipmentType}
                    onValueChange={(val) => update("equipmentType", val)}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="towYear" className="mb-1.5">Vehicle Year</Label>
                    <Input
                      id="towYear"
                      placeholder="2020"
                      value={formData.vehicleYear}
                      onChange={(e) => update("vehicleYear", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="towMake" className="mb-1.5">Vehicle Make</Label>
                    <Input
                      id="towMake"
                      placeholder="Ford"
                      value={formData.vehicleMake}
                      onChange={(e) => update("vehicleMake", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="towModel" className="mb-1.5">Vehicle Model</Label>
                  <Input
                    id="towModel"
                    placeholder="F-550"
                    value={formData.vehicleModel}
                    onChange={(e) => update("vehicleModel", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="plate" className="mb-1.5">License Plate (optional)</Label>
                  <Input
                    id="plate"
                    placeholder="ABC 1234"
                    value={formData.licensePlate}
                    onChange={(e) => update("licensePlate", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Service Areas */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Service Areas</h2>
                <p className="text-sm text-gray-600">
                  Select the community areas you want to serve. You will only receive requests from these areas.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Info size={12} />
                  <span>{formData.selectedAreas.length} areas selected</span>
                  {formData.selectedAreas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => update("selectedAreas", [])}
                      className="text-[#FF6700] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "selectedAreas",
                        chicagoCommunityAreas.map((a) => a.number)
                      )
                    }
                    className="text-[#FF6700] hover:underline"
                  >
                    Select all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 p-4">
                  {chicagoCommunityAreas.map((area) => {
                    const isSelected = formData.selectedAreas.includes(area.number);
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
              </div>
            )}

            {/* Step 3: Verification Documents */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Verification Documents</h2>
                <p className="text-sm text-gray-600">
                  Upload your documents for review. We verify all providers within 24-48 hours.
                </p>

                {[
                  { label: "Driver's License", field: "driversLicense" as const, required: true },
                  { label: "Towing License / Permit", field: "towingLicense" as const, required: true },
                  { label: "Insurance Certificate", field: "insuranceCert" as const, required: true },
                ].map((doc) => (
                  <div key={doc.field}>
                    <Label className="mb-1.5 flex items-center gap-1">
                      {doc.label}
                      {doc.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#FF6700]/30 transition-colors cursor-pointer">
                      <Upload size={20} className="text-gray-300 mx-auto mb-1.5" />
                      <p className="text-sm text-gray-500">
                        {formData[doc.field]
                          ? formData[doc.field]
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        PDF, JPG, or PNG up to 10MB
                      </p>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
                  <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What happens next?</p>
                    <p className="mt-1 text-blue-700">
                      After you submit, our team will review your documents within 24-48 hours.
                      You will receive an email notification when your account is approved.
                    </p>
                  </div>
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
                  {submitting ? "Submitting..." : "Submit Application"}
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
