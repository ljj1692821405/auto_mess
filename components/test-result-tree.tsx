'use client'

import React, { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Code2,
  FileJson,
  Layers,
  ArrowRight
} from 'lucide-react'
import { Scenario, RequestStep } from '@/lib/mock-data'

interface TestResultTreeProps {
  scenario: Scenario
  onReplayStep?: (step: RequestStep) => void
}

export function TestResultTree({ scenario, onReplayStep }: TestResultTreeProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(scenario.steps[0]?.id || null)
  const [activeInspectorTab, setActiveInspectorTab] = useState<'RESPONSE' | 'REQUEST' | 'ASSERTIONS' | 'HEADERS'>('RESPONSE')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopyJson = (data: any, key: string) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const selectedStep = scenario.steps.find((s) => s.id === expandedStepId) || scenario.steps[0]

  const totalSteps = scenario.steps.length
  const passedSteps = scenario.steps.filter((s) => s.isSuccess).length
  const failedSteps = totalSteps - passedSteps

  return (
    <div className="h-full flex flex-col bg-[#1E1F22] select-none overflow-hidden">
      {/* Step Summary Header */}
      <div className="h-10 px-3 bg-[#25272B] border-b border-[#393B40] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#3574F0]" />
          <span className="text-xs font-semibold text-[#DFE1E5]">
            测试链路调用树 (Call Tree)
          </span>
          <span className="text-[10px] text-[#8D9299] font-mono">
            {scenario.code}
          </span>
        </div>

        {/* Status Metrics */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#8D9299]">总计 {totalSteps} 步:</span>
          <span className="inline-flex items-center gap-1 text-[#59A869]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{passedSteps} 通过</span>
          </span>
          {failedSteps > 0 && (
            <span className="inline-flex items-center gap-1 text-[#E05555]">
              <XCircle className="w-3.5 h-3.5" />
              <span>{failedSteps} 失败</span>
            </span>
          )}
          <span className="text-[#393B40]">|</span>
          <span className="text-[#8D9299] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{scenario.duration}ms</span>
          </span>
        </div>
      </div>

      {/* Main Split Body: Steps List (Left 42%) + Step Inspector (Right 58%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Interactive Step Tree Nodes */}
        <div className="w-[42%] border-r border-[#393B40] overflow-y-auto p-2 space-y-1.5 bg-[#1E1F22]">
          {scenario.steps.map((step, index) => {
            const isSelected = step.id === expandedStepId
            const isSuccess = step.isSuccess
            const isSkipped = step.status === 0

            let methodColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            if (step.method === 'POST') methodColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            if (step.method === 'PUT') methodColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            if (step.method === 'DELETE') methodColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30'

            return (
              <div
                key={step.id}
                onClick={() => setExpandedStepId(step.id)}
                className={`p-2 rounded border transition-all cursor-pointer group relative ${
                  isSelected
                    ? 'bg-[#2B2D30] border-[#3574F0] shadow-sm ring-1 ring-[#3574F0]/30'
                    : 'bg-[#25272B] border-[#393B40] hover:border-[#3574F0] hover:bg-[#2B2D30]'
                }`}
              >
                {/* Top Row: Index + Method + Endpoint + Status */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] font-mono text-[#8D9299]">
                      #{index + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded border ${methodColor}`}>
                      {step.method}
                    </span>
                    <span className="font-mono text-xs text-[#DFE1E5] truncate group-hover:text-white" title={step.endpoint}>
                      {step.endpoint}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isSkipped ? (
                      <span className="text-[10px] font-mono px-1 rounded bg-[#393B40] text-[#8D9299]">
                        SKIPPED
                      </span>
                    ) : isSuccess ? (
                      <span className="text-[10px] font-mono px-1 rounded bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/30">
                        {step.status}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1 rounded bg-[#E05555]/20 text-[#E05555] border border-[#E05555]/30">
                        {step.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step Description Name */}
                <div className="text-[11px] text-[#8D9299] truncate mb-1">
                  {step.name}
                </div>

                {/* Bottom Row: Duration + Assertions Count */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8D9299]">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className={`w-3 h-3 ${isSuccess ? 'text-[#59A869]' : 'text-[#E05555]'}`} />
                    <span>
                      {step.assertions.filter((a) => a.passed).length}/{step.assertions.length} 断言
                    </span>
                  </div>
                  <span>{step.duration}ms</span>
                </div>

                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#3574F0] rounded-r" />
                )}
              </div>
            )
          })}
        </div>

        {/* Right: Detailed Step Inspector Panel (58%) */}
        {selectedStep ? (
          <div className="flex-1 flex flex-col bg-[#1A1B1E] overflow-hidden">
            {/* Inspector Navigation Tabs */}
            <div className="h-9 px-2 bg-[#25272B] border-b border-[#393B40] flex items-center justify-between shrink-0 overflow-x-auto">
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveInspectorTab('RESPONSE')}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded whitespace-nowrap transition-colors ${
                    activeInspectorTab === 'RESPONSE'
                      ? 'bg-[#1E1F22] text-[#3574F0] border border-[#3574F0]/40'
                      : 'text-[#8D9299] hover:text-[#DFE1E5]'
                  }`}
                >
                  响应体 (Response)
                </button>

                <button
                  onClick={() => setActiveInspectorTab('REQUEST')}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded whitespace-nowrap transition-colors ${
                    activeInspectorTab === 'REQUEST'
                      ? 'bg-[#1E1F22] text-[#3574F0] border border-[#3574F0]/40'
                      : 'text-[#8D9299] hover:text-[#DFE1E5]'
                  }`}
                >
                  请求体 (Request)
                </button>

                <button
                  onClick={() => setActiveInspectorTab('ASSERTIONS')}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeInspectorTab === 'ASSERTIONS'
                      ? 'bg-[#1E1F22] text-[#3574F0] border border-[#3574F0]/40'
                      : 'text-[#8D9299] hover:text-[#DFE1E5]'
                  }`}
                >
                  <span>断言</span>
                  <span className={`text-[10px] px-1 rounded ${selectedStep.isSuccess ? 'bg-[#59A869]/20 text-[#59A869]' : 'bg-[#E05555]/20 text-[#E05555]'}`}>
                    {selectedStep.assertions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('HEADERS')}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded whitespace-nowrap transition-colors ${
                    activeInspectorTab === 'HEADERS'
                      ? 'bg-[#1E1F22] text-[#3574F0] border border-[#3574F0]/40'
                      : 'text-[#8D9299] hover:text-[#DFE1E5]'
                  }`}
                >
                  Headers
                </button>
              </div>

              {/* Quick Replay Step Button */}
              {onReplayStep && (
                <button
                  onClick={() => onReplayStep(selectedStep)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E1F22] hover:bg-[#3574F0] hover:text-white border border-[#393B40] hover:border-[#3574F0] text-[11px] font-mono text-[#DFE1E5] transition-colors shrink-0 ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>单步重放</span>
                </button>
              )}
            </div>

            {/* Inspector Content View */}
            <div className="flex-1 p-3 overflow-y-auto select-text font-mono text-xs">
              {/* Response Tab */}
              {activeInspectorTab === 'RESPONSE' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#8D9299]">
                    <div className="flex items-center gap-2">
                      <span>HTTP 状态: </span>
                      <span className={`font-bold ${selectedStep.isSuccess ? 'text-[#59A869]' : 'text-[#E05555]'}`}>
                        {selectedStep.status} {selectedStep.statusText}
                      </span>
                      <span>• 耗时: {selectedStep.duration}ms</span>
                    </div>

                    <button
                      onClick={() => handleCopyJson(selectedStep.responseBody, 'resp')}
                      className="flex items-center gap-1 text-[11px] text-[#8D9299] hover:text-[#DFE1E5]"
                    >
                      {copiedKey === 'resp' ? <Check className="w-3 h-3 text-[#59A869]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'resp' ? '已复制' : '复制 JSON'}</span>
                    </button>
                  </div>

                  <pre className="p-2.5 rounded bg-[#141416] border border-[#393B40] text-[#DFE1E5] overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(selectedStep.responseBody, null, 2)}
                  </pre>
                </div>
              )}

              {/* Request Tab */}
              {activeInspectorTab === 'REQUEST' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#8D9299]">
                    <span>
                      {selectedStep.method} {selectedStep.endpoint}
                    </span>
                    {selectedStep.requestBody && (
                      <button
                        onClick={() => handleCopyJson(selectedStep.requestBody, 'req')}
                        className="flex items-center gap-1 text-[11px] text-[#8D9299] hover:text-[#DFE1E5]"
                      >
                        {copiedKey === 'req' ? <Check className="w-3 h-3 text-[#59A869]" /> : <Copy className="w-3 h-3" />}
                        <span>复制 Body</span>
                      </button>
                    )}
                  </div>

                  {selectedStep.requestBody ? (
                    <pre className="p-2.5 rounded bg-[#141416] border border-[#393B40] text-[#59A869] overflow-x-auto text-[11px]">
                      {JSON.stringify(selectedStep.requestBody, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 rounded bg-[#141416] border border-[#393B40] text-center text-[#8D9299]">
                      该请求为 GET/无 Body 请求，参数已包含在 URL Query 中
                    </div>
                  )}
                </div>
              )}

              {/* Assertions Tab */}
              {activeInspectorTab === 'ASSERTIONS' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-[#8D9299] mb-1">
                    断言校验结果列表 ({selectedStep.assertions.length} 条)
                  </div>

                  <div className="space-y-1.5">
                    {selectedStep.assertions.map((assertion, aIdx) => (
                      <div
                        key={aIdx}
                        className={`p-2.5 rounded border ${
                          assertion.passed
                            ? 'bg-[#59A869]/10 border-[#59A869]/30 text-[#DFE1E5]'
                            : 'bg-[#E05555]/10 border-[#E05555]/30 text-[#DFE1E5]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs font-mono">
                            {assertion.rule}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            assertion.passed ? 'bg-[#59A869] text-white' : 'bg-[#E05555] text-white'
                          }`}>
                            {assertion.passed ? 'PASSED ✓' : 'FAILED ✕'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8D9299] pt-1 border-t border-[#393B40]/40">
                          <div>
                            <span className="text-[#8D9299]">预期值 (Expected): </span>
                            <span className="text-[#DFE1E5] font-bold">{assertion.expected}</span>
                          </div>
                          <div>
                            <span className="text-[#8D9299]">实际值 (Actual): </span>
                            <span className={assertion.passed ? 'text-[#59A869] font-bold' : 'text-[#E05555] font-bold'}>
                              {assertion.actual}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headers Tab */}
              {activeInspectorTab === 'HEADERS' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] text-[#8D9299] font-bold mb-1">Request Headers</div>
                    <div className="p-2 rounded bg-[#141416] border border-[#393B40] space-y-1 text-[11px]">
                      {Object.entries(selectedStep.requestHeaders).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="text-[#3574F0]">{k}:</span>
                          <span className="text-[#DFE1E5] break-all">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#8D9299] font-bold mb-1">Response Headers</div>
                    <div className="p-2 rounded bg-[#141416] border border-[#393B40] space-y-1 text-[11px]">
                      {Object.entries(selectedStep.responseHeaders).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="text-[#59A869]">{k}:</span>
                          <span className="text-[#DFE1E5] break-all">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8D9299]">
            请在左侧选择需要查看的接口调用步骤
          </div>
        )}
      </div>
    </div>
  )
}
