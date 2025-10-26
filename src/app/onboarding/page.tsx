"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { User } from "@/types";
import { categories } from "@/data/mockData";
import LocationSelector from "@/components/LocationSelector";
import {
  Heart,
  Users,
  Building,
  User as UserIcon,
  X,
  Facebook,
  Mail,
  Instagram,
  MapPin,
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [userIdCounter] = useState(() => Math.floor(Math.random() * 1000000));
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const { setLanguage } = useAppStore();
  const router = useRouter();

  // Calculate total steps - all accounts now get an additional optional info step
  const totalSteps = 5;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Create mock user and complete onboarding
      const userId = `user_${userIdCounter}_${step}`;
      const newUser: User = {
        id: userId,
        name: formData.name || "",
        businessName: formData.businessName,
        accountType: formData.accountType || "personal",
        role: formData.role || "both",
        region: formData.region || "",
        commune: formData.commune,
        phoneNumber: formData.phoneNumber || "",
        phoneVisible: formData.phoneVisible || false,
        facebookLink: formData.facebookLink,
        instagramLink: formData.instagramLink,
        email: formData.email,
        skills: formData.skills || [],
        services: formData.services || [],
        coordinates: formData.coordinates,
        rating: 0,
        reviewCount: 0,
        badges: [],
        createdAt: new Date().toISOString(),
        isVerified: false,
      };

      login(newUser);
      router.push("/");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-green/10 to-primary-gold/10">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              {t("step")} {step} / {totalSteps}
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <motion.div
              className="bg-primary-green h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Language Selector */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <Heart className="w-16 h-16 text-primary-red mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {t("welcome")}
              </h1>
              <p className="text-text-secondary">{t("welcomeSubtitle")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {t("selectLanguage")}
              </h3>
              {[
                { code: "mg", name: "Malagasy", flag: "🇲🇬" },
                { code: "fr", name: "Français", flag: "🇫🇷" },
                { code: "en", name: "English", flag: "🇺🇸" },
              ].map((lang) => (
                <motion.button
                  key={lang.code}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setLanguage(lang.code as "mg" | "fr" | "en");
                    handleNext();
                  }}
                  className="w-full p-4 bg-white rounded-xl border border-border hover:border-primary-green transition-colors text-left text-black"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Role Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t("selectRole")}
            </h2>
            <p className="text-text-secondary mb-8">
              {t("selectRoleDescription")}
            </p>

            <div className="space-y-4">
              {[
                {
                  role: "seeker",
                  title: t("needHelp"),
                  description: t("needHelpDescription"),
                  icon: Heart,
                  color: "text-primary-red",
                },
                {
                  role: "helper",
                  title: t("canHelp"),
                  description: t("canHelpDescription"),
                  icon: Users,
                  color: "text-primary-green",
                },
                {
                  role: "both",
                  title: t("both"),
                  description: t("bothDescription"),
                  icon: UserIcon,
                  color: "text-primary-gold",
                },
              ].map((option) => (
                <motion.button
                  key={option.role}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateFormData("role", option.role);
                    handleNext();
                  }}
                  className="w-full p-6 bg-white rounded-xl border border-border hover:border-primary-green transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    <option.icon className={`w-8 h-8 ${option.color} mt-1`} />
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Account Type */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t("accountType")}
            </h2>
            <p className="text-text-secondary mb-8">
              {t("accountTypeDescription")}
            </p>

            <div className="space-y-4">
              {[
                {
                  type: "personal",
                  title: t("personal"),
                  description: t("personalDescription"),
                  icon: UserIcon,
                },
                {
                  type: "company",
                  title: t("company"),
                  description: t("companyDescription"),
                  icon: Building,
                },
              ].map((option) => (
                <motion.button
                  key={option.type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateFormData("accountType", option.type);
                    handleNext();
                  }}
                  className="w-full p-6 bg-white rounded-xl border border-border hover:border-primary-green transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    <option.icon className="w-8 h-8 text-primary-green mt-1" />
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Basic Information */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">
              {t("basicInformation")}
            </h2>
            <p className="text-text-secondary mb-8 text-center">
              {t("basicInformationDescription")}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {formData.accountType === "company"
                    ? t("businessName")
                    : t("name")}{" "}
                  *
                </label>
                <input
                  type="text"
                  value={
                    formData.accountType === "company"
                      ? formData.businessName || ""
                      : formData.name || ""
                  }
                  onChange={(e) =>
                    updateFormData(
                      formData.accountType === "company"
                        ? "businessName"
                        : "name",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  placeholder={
                    formData.accountType === "company"
                      ? t("businessNamePlaceholder")
                      : t("namePlaceholder")
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("region")} *
                </label>
                <select
                  value={formData.region || ""}
                  onChange={(e) => updateFormData("region", e.target.value)}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                >
                  <option value="">{t("selectRegion")}</option>
                  {[
                    "Antananarivo",
                    "Toamasina",
                    "Fianarantsoa",
                    "Mahajanga",
                    "Toliara",
                    "Antsiranana",
                  ].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("phoneNumber")} *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  placeholder="+261 34 12 345 67"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="phoneVisible"
                  checked={formData.phoneVisible || false}
                  onChange={(e) =>
                    updateFormData("phoneVisible", e.target.checked)
                  }
                  className="w-4 h-4 text-primary-green border-border rounded focus:ring-primary-green"
                />
                <label
                  htmlFor="phoneVisible"
                  className="text-sm text-text-primary"
                >
                  {t("phoneVisible")}
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Optional Additional Information */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">
              {t("additionalInfo")}
            </h2>
            <p className="text-text-secondary mb-8 text-center">
              {t("additionalInfoDescription")}
            </p>

            <div className="space-y-6">
              {/* Social Media and Contact */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Facebook className="inline w-4 h-4 mr-2" />
                    {t("facebookLink")} ({t("optional")})
                  </label>
                  <input
                    type="url"
                    value={formData.facebookLink || ""}
                    onChange={(e) =>
                      updateFormData("facebookLink", e.target.value)
                    }
                    placeholder="https://facebook.com/yourprofile"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Instagram className="inline w-4 h-4 mr-2" />
                    {t("instagramLink")} ({t("optional")})
                  </label>
                  <input
                    type="url"
                    value={formData.instagramLink || ""}
                    onChange={(e) =>
                      updateFormData("instagramLink", e.target.value)
                    }
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    {t("email")} ({t("optional")})
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories Selection - for helper accounts */}
              {(formData.role === "helper" || formData.role === "both") && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    {t("categoriesOrServices")} ({t("optional")})
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          const currentCategories =
                            (formData.services as string[]) || [];
                          if (currentCategories.includes(category)) {
                            updateFormData(
                              "services",
                              currentCategories.filter((c) => c !== category)
                            );
                          } else {
                            updateFormData("services", [
                              ...currentCategories,
                              category,
                            ]);
                          }
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors text-center ${
                          (formData.services as string[])?.includes(category)
                            ? "border-primary-green bg-primary-green/10 text-primary-green"
                            : "border-border hover:border-primary-green/50"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {t(getCategoryTranslationKey(category))}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location on Map - for everyone */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("addLocation")} ({t("optional")})
                </label>
                <p className="text-xs text-text-secondary mb-3">
                  {t("addLocationDescription")}
                </p>
                <LocationSelector
                  currentLocation={
                    formData.coordinates
                      ? {
                          lat: formData.coordinates.lat,
                          lng: formData.coordinates.lng,
                        }
                      : undefined
                  }
                  onLocationSelect={(location) =>
                    updateFormData("coordinates", location)
                  }
                />
              </div>

              {/* Skills Input - for everyone */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("specificSkills")} ({t("optional")})
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(formData.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-green/10 text-primary-green text-sm rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          updateFormData(
                            "skills",
                            formData.skills?.filter((_, i) => i !== index) || []
                          );
                        }}
                        className="ml-1 hover:text-primary-red transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={t("addSkillPlaceholder")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const skill = e.currentTarget.value.trim();
                      if (
                        !formData.skills?.includes(skill) &&
                        skill.length < 50
                      ) {
                        updateFormData("skills", [
                          ...(formData.skills || []),
                          skill,
                        ]);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                />
                <p className="text-xs text-text-secondary mt-1">
                  {t("pressEnterToAdd")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="flex-1 py-3 px-6 border border-border rounded-lg text-text-primary hover:bg-surface transition-colors"
            >
              {t("back")}
            </motion.button>
          )}

          {step === 5 ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 py-3 px-6 border border-border rounded-lg text-text-primary hover:bg-surface transition-colors"
              >
                {t("skip")}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 py-3 px-6 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
              >
                {t("getStarted")}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={
                (step === 4 && !formData.name && !formData.businessName) ||
                !formData.region ||
                !formData.phoneNumber
              }
              className="flex-1 py-3 px-6 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("continue")}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
