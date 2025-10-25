'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { mockPosts, mockCommunityPosts } from '@/data/mockData';
import PostCard from '@/components/PostCard';
import CommunityBoard from '@/components/CommunityBoard';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import { Search, Filter } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const { currentUser } = useAppStore();

  // If no user, redirect to onboarding
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-green/10 to-primary-gold/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t('welcome')}
          </h1>
          <p className="text-text-secondary mb-6">
            {t('welcomeSubtitle')}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/onboarding'}
            className="bg-primary-green text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-green/90 transition-colors"
          >
            {t('getStarted')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(mockPosts.map(post => post.category)))];

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
                {t('home')}
              </h1>
              <p className="text-sm text-text-secondary">
                {t('welcomeBack')}, {currentUser.name}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-surface hover:bg-border transition-colors"
            >
              <Filter size={20} className="text-text-secondary" />
            </motion.button>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('searchPosts')}
          />
        </div>
      </motion.header>

      {/* Community Board */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4"
      >
        <CommunityBoard posts={mockCommunityPosts} />
      </motion.section>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          <FilterChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      )}

      {/* Posts Feed */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t('recentPosts')}
          </h2>
          <span className="text-sm text-text-secondary">
            {filteredPosts.length} {t('posts')}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {t('noPostsFound')}
            </h3>
            <p className="text-text-secondary mb-4">
              {t('noPostsFoundDescription')}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/post'}
              className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
            >
              {t('createFirstPost')}
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}