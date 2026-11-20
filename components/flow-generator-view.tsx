'use client'

import React, { useState } from 'react'
import {
  GitFork,
  Plus,
  Play,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  Code2,
  Trash2,
  GripVertical
} from 'lucide-react'
import { MOCK_FLOW_NODES, FlowNode } from '@/lib/extra-mock'

interface FlowGeneratorViewProps {
  onNextStep: () => void
  onOpenWhaleAssistant: () => void
}

export function FlowGeneratorView({ onNextStep, onOpenWhaleAssistant }: FlowGeneratorViewProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(MOCK_FLOW_NODES)
  const [flowTitle, setFlowTitle] = useState('剧场充值开卡链路完整 Flow (v2.4)')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSaveAndRun = () => {
    setSavedSuccess(true)
    setTimeout(() => {
      onNextStep()
    }, 600)
  }

  return (
    <div className="h-full flex flex-col bg-[#1E1F22] p-4 space-y-4 select-none overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-lg bg-[#25272B] border border-[#393B40] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#3574F0]/20 border border-[#3574F0]/40 flex items-center justify-center text-[#3574F0]">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#DFE1E5]">
              阶段 ③：可视化测试链路编排 (Flow Graph Generator)
            </div>
            <div className="text-xs text-[#8D9299]">
              组合接口请求节点、造数前置、条件分支与断言规则，一键编译为自动化执行场景
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWhaleAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3574F0]/20 hover:bg-[#3574F0]/30 border border-[#3574F0]/40 text-[#3574F0] text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 自动拓扑编排</span>
          </button>

          <button
            onClick={handleSaveAndRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#59A869] hover:bg-[#68B978] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>编译并进入执行阶段</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas View */}
      <div className="flex-1 rounded-lg bg-[#25272B] border border-[#393B40] p-6 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-xl space-y-3">
          {nodes.map((node, index) => {
            let badgeBg = 'bg-[#3574F0]/20 text-[#3574F0] border-[#3574F0]/30'
            let borderHover = 'hover:border-[#3574F0]'

            if (node.type === 'TRIGGER') {
              badgeBg = 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            } else if (node.type === 'MOCK_DATA') {
              badgeBg = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
            } else if (node.type === 'BRANCH') {
              badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            } else if (node.type === 'ASSERT') {
              badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div className={`p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] ${borderHover} transition-all duration-200 shadow-md group relative`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#25272B] border border-[#393B40] flex items-center justify-center font-mono text-[10px] text-[#8D9299]">
                        {index + 1}
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${badgeBg}`}>
                        {node.type}
                      </span>
                      {node.method && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/30">
                          {node.method}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#8D9299] font-mono">
                      Step #{index + 1}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#DFE1E5] mb-1 group-hover:text-white">
                    {node.name}
                  </div>

                  <div className="text-[11px] text-[#8D9299] font-mono p-1.5 rounded bg-[#141416] border border-[#393B40]/60">
                    {node.meta}
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < nodes.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#1E1F22] border border-[#393B40] flex items-center justify-center text-[#8D9299]">
                      <ArrowDown className="w-3 h-3 text-[#3574F0]" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
