'use client'

import React, { useState } from 'react'
import {
  Zap,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  FileJson,
  Layers,
  Sparkles
} from 'lucide-react'
import { Scenario, RequestStep } from '@/lib/mock-data'

interface DebugStepModalProps {
  isOpen: boolean
  onClose: () => void
  scenario: Scenario
}

export function DebugStepModal({ isOpen, onClose, scenario }: DebugStepModalProps) {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0)
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugResult, setDebugResult] = useState<string | null>(null)

  if (!isOpen) return null

  const currentStep = scenario.steps[selectedStepIndex] || scenario.steps[0]

  const handleRunSingleStep = () => {
    setIsDebugging(true)
    setDebugResult(null)

    setTimeout(() => {
      setIsDebugging(false)
      setDebugResult(`[200 OK] 耗时 24ms - 响应体: ${JSON.stringify(currentStep.responseBody || { success: true }, null, 2)}`)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#25272B] border border-[#393B40] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="h-12 px-4 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#E5A84B]" />
            <span className="text-sm font-bold text-[#DFE1E5]">
              单步断点与参数重放调试 (Step Debugger)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#1E1F22] text-[#8D9299] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Step Selector Tabs */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">选择需要重放的步骤 (Step)</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {scenario.steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setSelectedStepIndex(idx)
                    setDebugResult(null)
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 shrink-0 transition-colors ${
                    selectedStepIndex === idx
                      ? 'bg-[#3574F0] text-white font-bold'
                      : 'bg-[#1E1F22] border border-[#393B40] text-[#8D9299] hover:text-[#DFE1E5]'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  <span>{step.method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Info */}
          <div className="p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#3574F0]">
                {currentStep.method} {currentStep.endpoint}
              </span>
              <span className="text-[10px] text-[#8D9299] font-mono">
                {currentStep.name}
              </span>
            </div>

            {currentStep.requestBody && (
              <div className="space-y-1">
                <span className="text-[10px] text-[#8D9299]">注入请求 Payload:</span>
                <pre className="p-2 rounded bg-[#141416] text-[#59A869] font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(currentStep.requestBody, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Execution Result Area */}
          {debugResult && (
            <div className="space-y-1 animate-fade-in">
              <span className="text-[10px] text-[#59A869] font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>重放执行成功:</span>
              </span>
              <pre className="p-2.5 rounded bg-[#141416] border border-[#59A869]/30 text-[#DFE1E5] font-mono text-[11px] max-h-40 overflow-y-auto">
                {debugResult}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-4 bg-[#2B2D30] border-t border-[#393B40] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-[#8D9299] font-mono">
            沙箱隔离模式运行 • 不污染生产数据
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#1E1F22] hover:bg-[#2B2D30] border border-[#393B40] text-xs text-[#8D9299]"
            >
              取消
            </button>

            <button
              onClick={handleRunSingleStep}
              disabled={isDebugging}
              className="px-3.5 py-1.5 rounded bg-[#3574F0] hover:bg-[#4682F4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isDebugging ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>正在发送请求...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>发起单步重放 (Send)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
