'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ContentGenerator from '@/components/ContentGenerator'
import TextOptimizer from '@/components/TextOptimizer'
import Header from '@/components/Header'
import { PenTool, Sparkles } from 'lucide-react'

type ActiveTab = 'generate' | 'optimize'

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generate')

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            AI Writing Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional content generation with advanced style customization. 
            Support for multiple LLM APIs including OpenAI, Claude, and more.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-effect rounded-lg p-1 shadow-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'generate'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Content Generator
              </button>
              <button
                onClick={() => setActiveTab('optimize')}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'optimize'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Text Optimizer
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'generate' && <ContentGenerator />}
          {activeTab === 'optimize' && <TextOptimizer />}
        </motion.div>
      </main>
    </div>
  )
}