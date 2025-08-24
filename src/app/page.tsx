'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PenTool, Sparkles, BookOpen, Github } from 'lucide-react'

type ActiveTab = 'generate' | 'optimize'

// Simple Header Component
function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">AI Writer Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a 
              href="#api-settings" 
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              API Settings
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-md hover:bg-white/50"
            >
              <Github className="w-5 h-5" />
            </a>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Placeholder Components
function ContentGenerator() {
  return (
    <div className="max-w-4xl mx-auto glass-effect rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Content Generator</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <input 
            type="text" 
            placeholder="Enter your topic..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
          <input 
            type="text" 
            placeholder="keyword1, keyword2..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
          Generate Content
        </button>
      </div>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-center">Your generated content will appear here...</p>
        <p className="text-sm text-gray-500 text-center mt-2">Configure your API settings to get started!</p>
      </div>
    </div>
  )
}

function TextOptimizer() {
  return (
    <div className="max-w-4xl mx-auto glass-effect rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Text Optimizer</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Text</label>
          <textarea 
            rows={8}
            placeholder="Paste your text here to optimize..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Optimized Text</label>
          <div className="w-full h-40 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500 text-center">Optimized text will appear here...</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
          Optimize Text
        </button>
      </div>
    </div>
  )
}

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