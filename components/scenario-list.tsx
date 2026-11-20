'use client'

import React, { useState } from 'react'
import {
  Search,
  Filter,
  Play,
  Zap,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Layers,
  Sparkles,
  RotateCcw,
  CheckCheck
} from 'lucide-react'
import { Scenario, WHALE_MAID_AVATAR } from '@/lib/mock-data'

interface ScenarioListProps {
  scenarios: Scenario[]
  selectedScenarioId: string
  onSelectScenario: (scenario: Scenario) => void
  onRunSelectedScenario: () => void
  onDebugStep: () => void
  onAddNewScenario: () => void
  isRunning: boolean
  onResetFilters: () => void
  onGoToFetch: () => void
}

type FilterType = 'ALL' | 'SUCCESS' | 'FAILED'

export function ScenarioList({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onRunSelectedScenario,
  onDebugStep,
  onAddNewScenario,
  isRunning,
  onResetFilters,
  onGoToFetch
}: ScenarioListProps) {
  const [filterType, setFilterType] = useState<FilterType>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const allCount = scenarios.length
  const successCount = scenarios.filter((s) => s.status === 'SUCCESS').length
  const failedCount = scenarios.filter((s) => s.status === 'FAILED').length

  const filteredScenarios = scenarios.filter((s) => {
    // Filter by status
    if (filterType === 'SUCCESS' && s.status !== 'SUCCESS') return false
    if (filterType === 'FAILED' && s.status !== 'FAILED') return false

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        s.code.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q)
      )
    }
    return true
  })

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0]

  return (
    <div className="h-full flex flex-col bg-[#25272B] border-r border-[#393B40] select-none">
      {/* Top Search & Filter Bar */}
      <div className="p-3 border-b border-[#393B40] bg-[#2B2D30] space-y-2.5">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8D9299] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用例编号、链路名称、标签..."
              className="w-full bg-[#1E1F22] border border-[#393B40] focus:border-[#3574F0] focus:ring-1 focus:ring-[#3574F0] rounded pl-8 pr-3 py-1.5 text-xs text-[#DFE1E5] placeholder-[#8D9299] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8D9299] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onAddNewScenario}
            title="新建自定义测试场景"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1E1F22] hover:bg-[#3574F0] hover:text-white border border-[#393B40] hover:border-[#3574F0] text-xs font-medium text-[#DFE1E5] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">新建</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                filterType === 'ALL'
                  ? 'bg-[#3574F0] text-white shadow-sm'
                  : 'bg-[#1E1F22] text-[#8D9299] hover:text-[#DFE1E5] hover:bg-[#1E1F22]/80 border border-[#393B40]'
              }`}
            >
              全部 ({allCount})
            </button>

            <button
              onClick={() => setFilterType('SUCCESS')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                filterType === 'SUCCESS'
                  ? 'bg-[#59A869] text-white shadow-sm'
                  : 'bg-[#1E1F22] text-[#59A869] hover:bg-[#59A869]/10 border border-[#393B40]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>成功 ({successCount})</span>
            </button>

            <button
              onClick={() => setFilterType('FAILED')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                filterType === 'FAILED'
                  ? 'bg-[#E05555] text-white shadow-sm'
                  : 'bg-[#1E1F22] text-[#E05555] hover:bg-[#E05555]/10 border border-[#393B40]'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>失败 ({failedCount})</span>
            </button>
          </div>

          <span className="text-[10px] text-[#8D9299] font-mono">
            已匹配 {filteredScenarios.length} 条
          </span>
        </div>
      </div>

      {/* Scenario List Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredScenarios.length === 0 ? (
          /* Empty State Requirement: Center Whale Maid 120px with friendly text */
          <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-[120px] h-[120px] rounded-2xl bg-[#1E1F22] border border-[#3574F0]/30 shadow-[0_0_20px_rgba(53,116,240,0.2)] flex items-center justify-center overflow-hidden p-2 mb-3">
              <img
                src={WHALE_MAID_AVATAR}
                alt="鲸鱼娘空状态"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-sm font-medium text-[#DFE1E5] mb-1">
              当前暂无匹配场景
            </div>
            <div className="text-xs text-[#8D9299] max-w-[220px] mb-4">
              当前暂无场景，快去拉取接口生成吧~
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFilterType('ALL')
                  setSearchQuery('')
                  onResetFilters()
                }}
                className="px-3 py-1.5 rounded bg-[#1E1F22] hover:bg-[#2B2D30] border border-[#393B40] text-xs text-[#DFE1E5] transition-colors"
              >
                重置筛选
              </button>
              <button
                onClick={onGoToFetch}
                className="px-3 py-1.5 rounded bg-[#3574F0] hover:bg-[#4682F4] text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>一键拉取契约</span>
              </button>
            </div>
          </div>
        ) : (
          filteredScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId
            const isSuccess = scenario.status === 'SUCCESS'

            return (
              <div
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className={`p-2.5 rounded border transition-all duration-150 cursor-pointer relative group ${
                  isSelected
                    ? 'bg-[#3574F0]/15 border-[#3574F0] shadow-sm'
                    : 'bg-[#2B2D30] border-[#393B40] hover:border-[#3574F0] hover:bg-[#2B2D30]/90'
                }`}
              >
                {/* Header: Code & Status Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#DFE1E5] group-hover:text-white">
                      {scenario.code}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1E1F22] text-[#8D9299] border border-[#393B40] font-sans">
                      {scenario.category}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{scenario.statusCode} OK</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E05555]/20 text-[#E05555] border border-[#E05555]/30">
                        <XCircle className="w-3 h-3" />
                        <span>{scenario.statusCode} ERR</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="text-xs font-medium text-[#DFE1E5] mb-2 line-clamp-1 group-hover:text-white">
                  {scenario.title}
                </div>

                {/* Progress Bar & Latency */}
                <div className="flex items-center justify-between text-[11px] text-[#8D9299] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-[#1E1F22] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isSuccess ? 'bg-[#59A869]' : 'bg-[#E05555]'
                        }`}
                        style={{
                          width: `${(scenario.passedStepsCount / scenario.stepsCount) * 100}%`
                        }}
                      />
                    </div>
                    <span>
                      {scenario.passedStepsCount}/{scenario.stepsCount} 步骤
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{scenario.duration}ms</span>
                  </div>
                </div>

                {/* Selection indicator mark */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#3574F0] rounded-r" />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 border-t border-[#393B40] bg-[#2B2D30] space-y-2">
        <div className="flex items-center gap-2">
          {/* Main Primary Button: Run Selected Scenario */}
          <button
            onClick={onRunSelectedScenario}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#3574F0] hover:bg-[#4682F4] active:bg-[#2B5EC2] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 group"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>正在执行用例流...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>运行选中场景 (Ctrl+R)</span>
              </>
            )}
          </button>

          {/* Quick Step Debug Button */}
          <button
            onClick={onDebugStep}
            title="单步断点与参数重放"
            className="flex items-center justify-center p-2 rounded bg-[#1E1F22] hover:bg-[#25272B] border border-[#393B40] hover:border-[#3574F0] text-[#DFE1E5] transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#E5A84B]" />
          </button>
        </div>

        {/* Current Target Info */}
        <div className="flex items-center justify-between text-[10px] text-[#8D9299]">
          <span className="truncate">当前选中: {selectedScenario?.code}</span>
          <span className="font-mono">{selectedScenario?.updatedAt}</span>
        </div>
      </div>
    </div>
  )
}
