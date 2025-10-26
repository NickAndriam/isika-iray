"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { mockUsers } from "@/data/mockData";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { setCurrentUser } = useAppStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (mock authentication)
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        setCurrentUser(user);
        router.push("/");
      } else {
        setError(t("invalidCredentials"));
      }
    } catch (err) {
      setError(t("loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (userIndex: number) => {
    setCurrentUser(mockUsers[userIndex]);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-green/10 to-primary-gold/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="absolute left-4 top-4 p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </motion.button>

          <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t("welcomeBack")}
          </h1>
          <p className="text-text-secondary">
            {t("loginToYourAccount")}
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6 shadow-lg"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail size={18} className="text-text-secondary" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock size={18} className="text-text-secondary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-surface transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-text-secondary" />
                  ) : (
                    <Eye size={18} className="text-text-secondary" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-error/10 border border-error/20 rounded-lg"
              >
                <p className="text-error text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 px-4 bg-primary-green text-white rounded-lg font-medium hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t("loggingIn") : t("login")}
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-text-secondary text-center mb-4">
              {t("tryDemoAccounts")}
            </p>
            <div className="space-y-2">
              {mockUsers.slice(0, 3).map((user, index) => (
                <motion.button
                  key={user.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDemoLogin(index)}
                  className="w-full p-3 bg-surface hover:bg-border rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-green/20 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {user.accountType === "company" ? user.businessName : user.name}
                      </p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              {t("dontHaveAccount")}{" "}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/onboarding")}
                className="text-primary-green hover:text-primary-green/80 font-medium transition-colors"
              >
                {t("signUp")}
              </motion.button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
