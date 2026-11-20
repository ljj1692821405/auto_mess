'use client'

import React, { useState } from 'react'
import {
  Layers,
  Database,
  GitFork,
  PlayCircle,
  Play,
  RotateCcw,
  FileSpreadsheet,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'

interface TopStepperProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  onRunAll: () => void
  onExportReport: () => void
  isRunningAll: boolean
  totalScenarios: number
  successCount: number
  failedCount: number
  avgDuration: number
}

const STEPS = [
  { id: 'fetch', stepIndex: '1', name: '拉取契约', desc: 'Swagger/OpenAPI', icon: Layers },
  { id: 'mock', stepIndex: '2', name: '数据构造', desc: 'Mock Faker规则', icon: Database },
  { id: 'flow', stepIndex: '3', name: '生成 Flow', desc: '可视化编排', icon: GitFork },
  { id: 'exec', stepIndex: '4', name: '执行与报告', desc: '用例矩阵与控制台', icon: PlayCircle }
]

const ENVIRONMENTS = [
  { id: 'env-1', name: 'TEST-01', label: '测试沙箱', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'env-2', name: 'PRE-PUB', label: '预发隔离', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'env-3', name: 'PROD-READ', label: '生产只读', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
]

export function TopStepper({
  currentTab,
  onSelectTab,
  onRunAll,
  onExportReport,
  isRunningAll,
  totalScenarios,
  successCount,
  failedCount,
  avgDuration
}: TopStepperProps) {
  const [selectedEnv, setSelectedEnv] = useState(ENVIRONMENTS[0])
  const [isEnvMenuOpen, setIsEnvMenuOpen] = useState(false)

  const passRate = totalScenarios > 0 ? Math.round((successCount / totalScenarios) * 100) : 100

  return (
    <header className="h-14 bg-[#2B2D30] border-b border-[#393B40] px-4 flex items-center justify-between select-none relative z-10 shrink-0">
      {/* Left: Horizontal Stepper Workflow */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, idx) => {
          const isActive = currentTab === step.id
          const isDone = idx < STEPS.findIndex(s => s.id === currentTab)
          const StepIcon = step.icon

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onSelectTab(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#1E1F22] text-[#DFE1E5] border border-[#3574F0] shadow-sm'
                    : 'text-[#8D9299] hover:text-[#DFE1E5] hover:bg-[#1E1F22]/70 border border-transparent'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-[#3574F0] text-white'
                      : isDone
                      ? 'bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/40'
                      : 'bg-[#1E1F22] text-[#8D9299] border border-[#393B40]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.stepIndex}
                </div>

                <div className="flex flex-col text-left">
                  <span className={`text-xs font-medium leading-none ${isActive ? 'text-white' : ''}`}>
                    {step.name}
                  </span>
                  <span className="text-[10px] text-[#8D9299] font-mono leading-tight mt-0.5">
                    {step.desc}
                  </span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3574F0] absolute -top-0.5 -right-0.5 ring-2 ring-[#2B2D30]" />
                )}
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#393B40] mx-0.5 shrink-0" />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Right Controls & Quick Execution Stats */}
      <div className="flex items-center gap-3">
        {/* Environment Badge Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsEnvMenuOpen(!isEnvMenuOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${selectedEnv.color}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{selectedEnv.name}</span>
            <span className="text-[10px] opacity-80">({selectedEnv.label})</span>
          </button>

          {isEnvMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsEnvMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#1E1F22] border border-[#393B40] rounded shadow-xl py-1 z-50">
                <div className="px-2.5 py-1 text-[10px] text-[#8D9299] font-medium uppercase">
                  选择执行运行环境
                </div>
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => {
                      setSelectedEnv(env)
                      setIsEnvMenuOpen(false)
                    }}
                    className={`w-full px-2.5 py-1.5 flex items-center justify-between text-xs hover:bg-[#2B2D30] transition-colors ${
                      selectedEnv.id === env.id ? 'text-[#3574F0] font-medium' : 'text-[#DFE1E5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${env.id === 'env-1' ? 'bg-emerald-400' : env.id === 'env-2' ? 'bg-blue-400' : 'bg-amber-400'}`} />
                      <span>{env.name}</span>
                      <span className="text-[10px] text-[#8D9299]">({env.label})</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#1E1F22] border border-[#393B40] text-xs font-mono">
          <div className="flex items-center gap-1 text-[#59A869]" title="成功通过用例">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{successCount}</span>
          </div>
          <span className="text-[#393B40]">/</span>
          <div className="flex items-center gap-1 text-[#E05555]" title="失败异常用例">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{failedCount}</span>
          </div>
          <span className="text-[#393B40]">|</span>
          <div className="flex items-center gap-1 text-[#DFE1E5]" title="平均响应耗时">
            <Clock className="w-3.5 h-3.5 text-[#8D9299]" />
            <span>{avgDuration}ms</span>
          </div>
          <span className="text-[#393B40]">|</span>
          <span className="text-[#3574F0] font-bold">{passRate}%</span>
        </div>

        {/* Action: Run All Scenarios */}
        <button
          onClick={onRunAll}
          disabled={isRunningAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3574F0] hover:bg-[#4682F4] active:bg-[#2B5EC2] text-white text-xs font-medium transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none group"
        >
          {isRunningAll ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>全量回归中...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>一键全量运行</span>
            </>
          )}
        </button>

        {/* Action: Export PM Report */}
        <button
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E1F22] hover:bg-[#25272B] border border-[#393B40] hover:border-[#3574F0] text-[#DFE1E5] text-xs font-medium transition-all"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#59A869]" />
          <span>报告视图</span>
        </button>
      </div>
    </header>
  )
}
