'use client'

import React, { useState } from 'react'
import {
  Database,
  Sparkles,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  Copy,
  ArrowRight,
  Code2,
  Wand2
} from 'lucide-react'
import { MOCK_BUILDER_RULES, MockFieldRule } from '@/lib/extra-mock'

interface SmartMockViewProps {
  onNextStep: () => void
  onOpenWhaleAssistant: () => void
}

export function SmartMockView({ onNextStep, onOpenWhaleAssistant }: SmartMockViewProps) {
  const [rules, setRules] = useState<MockFieldRule[]>(MOCK_BUILDER_RULES)
  const [activeRuleId, setActiveRuleId] = useState<string>(rules[0]?.id || '')
  const [regeneratedCount, setRegeneratedCount] = useState(0)

  const handleRegeneratePreviews = () => {
    setRegeneratedCount((c) => c + 1)
  }

  const activeRule = rules.find((r) => r.id === activeRuleId) || rules[0]

  return (
    <div className="h-full flex flex-col bg-[#1E1F22] p-4 space-y-4 select-none overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-lg bg-[#25272B] border border-[#393B40] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#3574F0]/20 border border-[#3574F0]/40 flex items-center justify-center text-[#3574F0]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#DFE1E5]">
              阶段 ②：智能造数与参数规则引擎 (Mock Builder)
            </div>
            <div className="text-xs text-[#8D9299]">
              支持 Faker 伪造函数、正则规则、枚举池以及鲸鱼娘专属业务沙箱动态注入
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWhaleAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3574F0]/20 hover:bg-[#3574F0]/30 border border-[#3574F0]/40 text-[#3574F0] text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>鲸鱼娘智能推断</span>
          </button>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#59A869] hover:bg-[#68B978] text-white text-xs font-semibold transition-all"
          >
            <span>下一步: 生成 Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split: Rules Table + Rule Live Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Rules List (7 cols) */}
        <div className="lg:col-span-7 rounded-lg bg-[#25272B] border border-[#393B40] flex flex-col overflow-hidden">
          <div className="p-3 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between">
            <span className="text-xs font-bold text-[#DFE1E5]">
              活动造数字段规则库 ({rules.length})
            </span>
            <button
              onClick={handleRegeneratePreviews}
              className="flex items-center gap-1 text-xs text-[#3574F0] hover:text-[#4682F4] font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重新生成预览值</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#393B40]">
            {rules.map((rule) => {
              const isSelected = rule.id === activeRuleId
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#3574F0]/15' : 'hover:bg-[#2B2D30]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#DFE1E5]">
                        {rule.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1E1F22] text-[#8D9299] border border-[#393B40] font-mono">
                        {rule.type}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3574F0]/20 text-[#3574F0] border border-[#3574F0]/30 font-bold">
                      {rule.ruleType}
                    </span>
                  </div>

                  <div className="text-xs text-[#8D9299] mb-1.5">
                    {rule.description}
                  </div>

                  <div className="p-1.5 rounded bg-[#141416] border border-[#393B40] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#8D9299] truncate pr-2">
                      {rule.expression}
                    </span>
                    <span className="text-[#59A869] font-bold shrink-0">
                      → {rule.previewValue}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Live Sandbox Expression Tester (5 cols) */}
        <div className="lg:col-span-5 rounded-lg bg-[#25272B] border border-[#393B40] flex flex-col p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#393B40]">
            <span className="text-xs font-bold text-[#DFE1E5] flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#3574F0]" />
              <span>动态生成器沙箱</span>
            </span>
            <span className="text-[10px] text-[#59A869] font-mono">
              ● 实时计算生效
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">字段名 / 作用域</label>
            <input
              type="text"
              value={activeRule?.name || ''}
              readOnly
              className="w-full bg-[#1E1F22] border border-[#393B40] rounded px-2.5 py-1 text-xs text-[#DFE1E5] font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">表达式 (JavaScript / Faker / AI 宏)</label>
            <textarea
              value={activeRule?.expression || ''}
              readOnly
              rows={3}
              className="w-full bg-[#141416] border border-[#393B40] rounded p-2 text-xs text-[#59A869] font-mono resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">沙箱即时运算产物 (Output Preview)</label>
            <div className="p-3 rounded bg-[#141416] border border-[#59A869]/40 text-[#59A869] font-mono text-sm font-bold shadow-inner">
              {activeRule?.previewValue}
            </div>
          </div>

          <div className="p-3 rounded bg-[#1E1F22] border border-[#393B40] text-xs text-[#8D9299] space-y-1">
            <div className="text-[11px] font-bold text-[#DFE1E5]">💡 PM 交互提示</div>
            <div>
              该字段在后续执行时，会自动注入到请求 Header、Query 以及 JSON Body 中，无需手动输入重复测试凭据。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
