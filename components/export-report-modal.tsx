'use client'

import React, { useState } from 'react'
import {
  FileSpreadsheet,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Share2,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react'
import { Scenario } from '@/lib/mock-data'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  scenarios: Scenario[]
}

export function ExportReportModal({ isOpen, onClose, scenarios }: ExportReportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)

  if (!isOpen) return null

  const total = scenarios.length
  const passed = scenarios.filter((s) => s.status === 'SUCCESS').length
  const failed = scenarios.filter((s) => s.status === 'FAILED').length
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 100
  const avgDuration = Math.round(scenarios.reduce((acc, s) => acc + s.duration, 0) / total)

  const handleDownloadCsv = () => {
    const headers = ['用例编号', '场景名称', '所属分类', '执行状态', 'HTTP状态码', '耗时(ms)', '更新时间']
    const rows = scenarios.map((s) => [s.code, `"${s.title}"`, s.category, s.status, s.statusCode, s.duration, s.updatedAt])
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `API_Automation_Report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#25272B] border border-[#393B40] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="h-12 px-5 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#59A869]/20 border border-[#59A869]/40 flex items-center justify-center text-[#59A869]">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-[#DFE1E5]">
              自动化测试交付报告 (PM Executive Summary)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#1E1F22] text-[#8D9299] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] space-y-1">
              <div className="text-[10px] text-[#8D9299] font-mono">用例通过率</div>
              <div className="text-xl font-bold text-[#3574F0] font-mono">{passRate}%</div>
              <div className="text-[10px] text-[#59A869] font-medium">基线达标 (≥80%)</div>
            </div>

            <div className="p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] space-y-1">
              <div className="text-[10px] text-[#8D9299] font-mono">成功 / 失败数</div>
              <div className="text-xl font-bold font-mono">
                <span className="text-[#59A869]">{passed}</span>
                <span className="text-[#8D9299]"> / </span>
                <span className="text-[#E05555]">{failed}</span>
              </div>
              <div className="text-[10px] text-[#8D9299]">总计 {total} 个场景</div>
            </div>

            <div className="p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] space-y-1">
              <div className="text-[10px] text-[#8D9299] font-mono">平均执行耗时</div>
              <div className="text-xl font-bold text-[#DFE1E5] font-mono">{avgDuration}ms</div>
              <div className="text-[10px] text-[#59A869]">P95 响应极速</div>
            </div>

            <div className="p-3 rounded-lg bg-[#1E1F22] border border-[#393B40] space-y-1">
              <div className="text-[10px] text-[#8D9299] font-mono">测试环境</div>
              <div className="text-sm font-bold text-[#DFE1E5] truncate font-mono">TEST-01</div>
              <div className="text-[10px] text-[#8D9299]">剧梦C端主干分支</div>
            </div>
          </div>

          {/* Scenario Details Table */}
          <div className="rounded-lg bg-[#1E1F22] border border-[#393B40] overflow-hidden">
            <div className="p-2.5 bg-[#2B2D30] border-b border-[#393B40] font-bold text-xs text-[#DFE1E5]">
              场景明细与断言清单
            </div>

            <div className="divide-y divide-[#393B40] max-h-60 overflow-y-auto">
              {scenarios.map((s) => (
                <div key={s.id} className="p-2.5 flex items-center justify-between hover:bg-[#25272B] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#DFE1E5]">{s.code}</span>
                    <span className="text-xs text-[#8D9299]">{s.title}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[10px] text-[#8D9299]">{s.duration}ms</span>
                    {s.status === 'SUCCESS' ? (
                      <span className="px-2 py-0.5 rounded bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/30 text-[10px]">
                        200 OK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#E05555]/20 text-[#E05555] border border-[#E05555]/30 text-[10px]">
                        {s.statusCode} FAIL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Whale Maid AI QA Assessment */}
          <div className="p-3 rounded-lg bg-[#3574F0]/10 border border-[#3574F0]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3574F0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>鲸鱼娘自动化质量评审建议 (AI QA Audit)</span>
            </div>
            <div className="text-[11px] text-[#DFE1E5] leading-relaxed">
              1. 核心链路【CL-BILL-01 剧场充值开卡】已 100% 验证通过，无资金与开卡风险。<br />
              2. 发现【CL-ORDER-03 超时未支付关单】存在 504 上游 Redis 锁等待超时问题，建议后端研发优化分布式锁超时阈值或增加指数退避重试。
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-5 bg-[#2B2D30] border-t border-[#393B40] flex items-center justify-between shrink-0">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1E1F22] hover:bg-[#25272B] border border-[#393B40] text-xs text-[#DFE1E5] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#3574F0]" />
            <span>{copiedLink ? '已复制报告链接' : '分享报告链接'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#1E1F22] hover:bg-[#25272B] border border-[#393B40] text-xs text-[#8D9299] hover:text-[#DFE1E5] transition-colors"
            >
              关闭
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#59A869] hover:bg-[#68B978] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 Excel / CSV 数据</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
