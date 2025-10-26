"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { useAppStore } from "@/store/useAppStore";
import { categories } from "@/data/mockData";
import {
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Phone,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

export default function PostPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "help_request" as "help_request" | "help_offer",
    category: "",
    title: "",
    description: "",
    images: [] as string[],
    contactMethod: "message" as "message" | "phone" | "both",
    urgency: "medium" as "low" | "medium" | "high",
    tags: [] as string[],
  });

  const { t } = useTranslation();
  const { currentUser } = useAppStore();
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create post logic here
      console.log("Creating post:", formData);
      router.push("/");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      updateFormData("tags", [...formData.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  if (!currentUser) {
    router.push("/onboarding");
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border sticky top-0 z-40"
      >
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <ArrowLeft size={20} className="text-text-primary" />
            </motion.button>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-text-primary">
                {t("createPost")}
              </h1>
              <p className="text-sm text-text-secondary">
                {t("step")} {step} / 3
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-border rounded-full h-2">
              <motion.div
                className="bg-primary-green h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6">
        {/* Step 1: Post Type and Category */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t("whatDoYouWantToDo")}
              </h2>

              <div className="space-y-3">
                {[
                  {
                    type: "help_request",
                    title: t("helpRequest"),
                    description: t("helpRequestDescription"),
                    icon: AlertCircle,
                    color: "text-primary-red",
                  },
                  {
                    type: "help_offer",
                    title: t("helpOffer"),
                    description: t("helpOfferDescription"),
                    icon: MessageCircle,
                    color: "text-primary-green",
                  },
                ].map((option) => (
                  <motion.button
                    key={option.type}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFormData("type", option.type)}
                    className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                      formData.type === option.type
                        ? "border-primary-green bg-primary-green/10"
                        : "border-border hover:border-primary-green/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <option.icon className={`w-6 h-6 ${option.color} mt-1`} />
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
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {t("selectCategory")}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFormData("category", category)}
                    className={`p-3 rounded-lg border-2 transition-colors text-center ${
                      formData.category === category
                        ? "border-primary-green bg-primary-green/10 text-primary-green"
                        : "border-border hover:border-primary-green/50 text-black"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {t(getCategoryTranslationKey(category))}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t("describeYourPost")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t("title")} *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder={t("titlePlaceholder")}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t("description")} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    placeholder={t("descriptionPlaceholder")}
                    rows={4}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t("addImages")} ({t("optional")})
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary-green/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={24} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">
                        {t("tapToAddImages")}
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact and Publish */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t("howCanPeopleContactYou")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    {t("contactMethod")}
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        value: "message",
                        label: t("message"),
                        description: t("messageDescription"),
                        icon: MessageCircle,
                      },
                      {
                        value: "phone",
                        label: t("phone"),
                        description: t("phoneDescription"),
                        icon: Phone,
                      },
                      {
                        value: "both",
                        label: t("both"),
                        description: t("bothDescription"),
                        icon: MessageCircle,
                      },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          updateFormData("contactMethod", option.value)
                        }
                        className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                          formData.contactMethod === option.value
                            ? "border-primary-green bg-primary-green/10"
                            : "border-border hover:border-primary-green/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <option.icon className="w-5 h-5 text-primary-green mt-1" />
                          <div>
                            <h3 className="font-semibold text-text-primary mb-1">
                              {option.label}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t("addTags")} ({t("optional")})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-green/10 text-primary-green text-sm rounded-full"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-primary-red transition-colors"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder={t("addTagPlaceholder")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        addTag(e.currentTarget.value.trim());
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex-1 py-3 px-6 border border-border rounded-lg text-text-primary hover:bg-surface transition-colors"
          >
            {step === 1 ? t("cancel") : t("back")}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={
              (step === 1 && (!formData.type || !formData.category)) ||
              (step === 2 && (!formData.title || !formData.description)) ||
              (step === 3 && !formData.contactMethod)
            }
            className="flex-1 py-3 px-6 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === 3 ? t("publish") : t("continue")}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
