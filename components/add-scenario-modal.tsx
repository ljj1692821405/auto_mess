'use client'

import React, { useState } from 'react'
import {
  Plus,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2
} from 'lucide-react'
import { Scenario } from '@/lib/mock-data'

interface AddScenarioModalProps {
  isOpen: boolean
  onClose: () => void
  onAddScenario: (scenario: Scenario) => void
}

export function AddScenarioModal({ isOpen, onClose, onAddScenario }: AddScenarioModalProps) {
  const [code, setCode] = useState('CL-CUSTOM-01')
  const [title, setTitle] = useState('新剧集上线与限时抢先看链路')
  const [category, setCategory] = useState('短剧业务')
  const [tag, setTag] = useState('P1 核心')

  if (!isOpen) return null

  const handleCreate = () => {
    const newSc: Scenario = {
      id: `sc-custom-${Date.now()}`,
      code: code.trim() || 'CL-CUSTOM-99',
      title: title.trim() || '自定义测试场景',
      category: category.trim() || '常规业务',
      tag: tag.trim() || 'P1',
      status: 'SUCCESS',
      statusCode: 200,
      duration: 75,
      stepsCount: 2,
      passedStepsCount: 2,
      updatedAt: '刚刚',
      description: '由用户自定义新建的 API 自动化编排测试场景。',
      author: 'PM_User',
      environment: 'TEST-01 (预发沙箱)',
      curl: `curl -X GET "https://api-test.jumeng.internal/v1/drama/custom-check"`,
      steps: [
        {
          id: `step-c1-${Date.now()}`,
          name: '拉取新剧集上架元数据',
          method: 'GET',
          endpoint: '/api/v1/drama/latest-release',
          status: 200,
          statusText: 'OK',
          duration: 32,
          timestamp: '刚刚',
          isSuccess: true,
          requestHeaders: { 'Authorization': 'Bearer token_custom' },
          responseHeaders: { 'content-type': 'application/json' },
          responseBody: { code: 0, msg: 'ok', data: { releaseId: 'rel_9981', available: true } },
          assertions: [{ rule: 'http.status == 200', expected: '200', actual: '200', passed: true }]
        },
        {
          id: `step-c2-${Date.now()}`,
          name: '验证前置抢先看权限拦截',
          method: 'POST',
          endpoint: '/api/v1/drama/early-access/verify',
          status: 200,
          statusText: 'OK',
          duration: 43,
          timestamp: '刚刚',
          isSuccess: true,
          requestHeaders: { 'Content-Type': 'application/json' },
          requestBody: { userId: 'uid_whale_9082', releaseId: 'rel_9981' },
          responseHeaders: { 'content-type': 'application/json' },
          responseBody: { code: 0, data: { permitted: true, trialMinutes: 5 } },
          assertions: [{ rule: 'body.data.permitted == true', expected: 'true', actual: 'true', passed: true }]
        }
      ],
      logs: [
        { time: '刚刚', level: 'INFO', message: `[INIT] 新建场景 ${code} 载入成功` },
        { time: '刚刚', level: 'SUCCESS', message: `[READY] 链路步骤已挂载 2 个 API 节点` }
      ]
    }

    onAddScenario(newSc)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#25272B] border border-[#393B40] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="h-12 px-4 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#3574F0]" />
            <span className="text-sm font-bold text-[#DFE1E5]">
              新建测试场景 (Create Scenario)
            </span>
          </div>

          <button onClick={onClose} className="p-1 rounded hover:bg-[#1E1F22] text-[#8D9299]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">场景编号 (Code)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#1E1F22] border border-[#393B40] focus:border-[#3574F0] rounded px-3 py-1.5 text-xs text-[#DFE1E5] font-mono outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#8D9299]">场景链路名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1E1F22] border border-[#393B40] focus:border-[#3574F0] rounded px-3 py-1.5 text-xs text-[#DFE1E5] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[#8D9299]">业务模块</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#393B40] rounded px-3 py-1.5 text-xs text-[#DFE1E5] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#8D9299]">优先级标签</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#393B40] rounded px-3 py-1.5 text-xs text-[#DFE1E5] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 px-4 bg-[#2B2D30] border-t border-[#393B40] flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#1E1F22] text-xs text-[#8D9299]"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            className="px-3.5 py-1.5 rounded bg-[#3574F0] hover:bg-[#4682F4] text-white text-xs font-semibold"
          >
            立即生成场景
          </button>
        </div>
      </div>
    </div>
  )
}
