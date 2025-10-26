"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { mockChats, mockMessages, mockUsers } from "@/data/mockData";
import {
  Search,
  Plus,
  MessageCircle,
  Check,
  CheckCheck,
  Shield,
  Star,
} from "lucide-react";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { t } = useTranslation();
  const { currentUser } = useAuthStore();

  const filteredChats = mockChats.filter((chat) => {
    const otherUserId = chat.participants.find((id) => id !== currentUser?.id);
    const otherUser = mockUsers.find((user) => user.id === otherUserId);
    return (
      !searchQuery ||
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedChatData = selectedChat
    ? mockChats.find((chat) => chat.id === selectedChat)
    : null;
  const selectedChatMessages = selectedChat
    ? mockMessages.filter(
        (msg) =>
          (msg.senderId === currentUser?.id &&
            msg.receiverId ===
              selectedChatData?.participants.find(
                (id) => id !== currentUser?.id
              )) ||
          (msg.receiverId === currentUser?.id &&
            msg.senderId ===
              selectedChatData?.participants.find(
                (id) => id !== currentUser?.id
              ))
      )
    : [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return t("justNow");
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // Send message logic here
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <MessageCircle
            size={48}
            className="text-text-secondary mx-auto mb-4"
          />
          <h2 className="text-lg font-medium text-text-primary mb-2">
            {t("loginRequired")}
          </h2>
          <p className="text-text-secondary mb-4">
            {t("loginRequiredDescription")}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/login")}
            className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
          >
            {t("login")}
          </motion.button>
        </motion.div>
      </div>
    );
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {t("messages")}
              </h1>
              <p className="text-sm text-text-secondary">
                {filteredChats.length} {t("conversations")}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-surface hover:bg-border transition-colors"
            >
              <Plus size={20} className="text-text-secondary" />
            </motion.button>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchMessages")}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white text-text-primary placeholder-text-secondary"
            />
          </div>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Chat List */}
        <div className="w-full md:w-1/3 bg-white border-r border-border">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle
                size={48}
                className="text-text-secondary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {t("noMessages")}
              </h3>
              <p className="text-text-secondary mb-4">
                {t("noMessagesDescription")}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
                className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
              >
                {t("browsePosts")}
              </motion.button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredChats.map((chat, index) => {
                const otherUserId = chat.participants.find(
                  (id) => id !== currentUser.id
                );
                const otherUser = mockUsers.find(
                  (user) => user.id === otherUserId
                );

                return (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-surface transition-colors ${
                      selectedChat === chat.id
                        ? "bg-primary-green/10 border-r-2 border-primary-green"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center">
                        {otherUser?.accountType === "company" ? (
                          <Shield size={20} className="text-primary-green" />
                        ) : (
                          <MessageCircle
                            size={20}
                            className="text-primary-green"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary truncate">
                            {otherUser?.accountType === "company"
                              ? otherUser.businessName
                              : otherUser?.name}
                          </h3>
                          {otherUser?.isVerified && (
                            <Shield size={14} className="text-primary-green" />
                          )}
                        </div>

                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                          {chat.lastMessage?.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-muted">
                            {formatTime(chat.updatedAt)}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="bg-primary-green text-white text-xs font-medium px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        {selectedChatData ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-border p-4">
              {(() => {
                const otherUserId = selectedChatData.participants.find(
                  (id) => id !== currentUser.id
                );
                const otherUser = mockUsers.find(
                  (user) => user.id === otherUserId
                );

                return (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                      {otherUser?.accountType === "company" ? (
                        <Shield size={20} className="text-primary-green" />
                      ) : (
                        <MessageCircle
                          size={20}
                          className="text-primary-green"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {otherUser?.accountType === "company"
                          ? otherUser.businessName
                          : otherUser?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-primary-gold" />
                          <span className="text-xs text-text-secondary">
                            {otherUser?.rating.toFixed(1)} (
                            {otherUser?.reviewCount})
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {otherUser?.region}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle
                    size={32}
                    className="text-text-secondary mx-auto mb-2"
                  />
                  <p className="text-text-secondary text-sm">
                    {t("noMessagesInChat")}
                  </p>
                </div>
              ) : (
                selectedChatMessages.map((message, index) => {
                  const isOwn = message.senderId === currentUser.id;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? "bg-primary-green text-white"
                            : "bg-white border border-border text-text-primary"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {isOwn &&
                            (message.isRead ? (
                              <CheckCheck size={12} className="text-white" />
                            ) : (
                              <Check size={12} className="text-white" />
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={t("typeMessage")}
                  className="flex-1 p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageCircle size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-surface">
            <div className="text-center">
              <MessageCircle
                size={48}
                className="text-text-secondary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {t("selectChat")}
              </h3>
              <p className="text-text-secondary">
                {t("selectChatDescription")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
