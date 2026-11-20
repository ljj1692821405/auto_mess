'use client'

import React, { useState } from 'react'
import {
  Layers,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  FileCode,
  Sparkles,
  Download,
  Check,
  Zap
} from 'lucide-react'
import { MOCK_CONTRACT_APIS, ContractApi } from '@/lib/extra-mock'

interface ContractFetchViewProps {
  onNextStep: () => void
  onImportToScenarios: (selectedApis: ContractApi[]) => void
}

export function ContractFetchView({ onNextStep, onImportToScenarios }: ContractFetchViewProps) {
  const [apis, setApis] = useState<ContractApi[]>(MOCK_CONTRACT_APIS)
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>(['api-1', 'api-2', 'api-3', 'api-4', 'api-5', 'api-6'])
  const [isSyncing, setIsSyncing] = useState(false)
  const [swaggerUrl, setSwaggerUrl] = useState('https://api-docs.jumeng.internal/v2/swagger.json')
  const [searchQuery, setSearchQuery] = useState('')
  const [syncToast, setSyncToast] = useState(false)

  const handleSyncContract = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setSyncToast(true)
      setTimeout(() => setSyncToast(false), 3000)
    }, 800)
  }

  const toggleSelectApi = (id: string) => {
    if (selectedApiIds.includes(id)) {
      setSelectedApiIds(selectedApiIds.filter((item) => item !== id))
    } else {
      setSelectedApiIds([...selectedApiIds, id])
    }
  }

  const selectAll = () => {
    if (selectedApiIds.length === apis.length) {
      setSelectedApiIds([])
    } else {
      setSelectedApiIds(apis.map((a) => a.id))
    }
  }

  const filteredApis = apis.filter((api) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return api.path.toLowerCase().includes(q) || api.summary.toLowerCase().includes(q) || api.module.toLowerCase().includes(q)
  })

  return (
    <div className="h-full flex flex-col bg-[#1E1F22] p-4 space-y-4 select-none overflow-y-auto">
      {/* Top Banner & Sync Controller */}
      <div className="p-4 rounded-lg bg-[#25272B] border border-[#393B40] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#3574F0]/20 border border-[#3574F0]/40 flex items-center justify-center text-[#3574F0]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#DFE1E5]">
                阶段 ①：拉取契约与 OpenAPI 同步
              </div>
              <div className="text-xs text-[#8D9299]">
                自动同步 Swagger 3.0 / Apifox / YApi 契约元数据，检测字段变更与入参 Schema
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSyncContract}
              disabled={isSyncing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#3574F0] hover:bg-[#4682F4] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '正在全量解析契约...' : '一键同步最新契约'}</span>
            </button>

            <button
              onClick={onNextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#59A869] hover:bg-[#68B978] text-white text-xs font-semibold transition-all"
            >
              <span>进入数据构造</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Swagger URL Input */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#393B40]">
          <span className="text-xs text-[#8D9299] shrink-0 font-mono">契约源 (URL):</span>
          <input
            type="text"
            value={swaggerUrl}
            onChange={(e) => setSwaggerUrl(e.target.value)}
            className="flex-1 bg-[#1E1F22] border border-[#393B40] rounded px-2.5 py-1 text-xs text-[#DFE1E5] font-mono outline-none focus:border-[#3574F0]"
          />
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#59A869]/20 text-[#59A869] border border-[#59A869]/30 font-mono shrink-0">
            HTTP 200 OK (已连通)
          </span>
        </div>
      </div>

      {syncToast && (
        <div className="p-2.5 rounded bg-[#59A869]/20 border border-[#59A869]/40 text-[#59A869] text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>契约同步成功！共检索到 6 个变更接口，已自动生成对应的 Mock Schema。</span>
          </div>
        </div>
      )}

      {/* Contract APIs List Table */}
      <div className="flex-1 rounded-lg bg-[#25272B] border border-[#393B40] flex flex-col overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-3 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="px-2 py-1 rounded bg-[#1E1F22] hover:bg-[#393B40] border border-[#393B40] text-xs text-[#DFE1E5] transition-colors"
            >
              {selectedApiIds.length === apis.length ? '取消全选' : '全选所有接口'}
            </button>
            <span className="text-xs text-[#8D9299]">
              已勾选 <span className="text-[#3574F0] font-bold">{selectedApiIds.length}</span> / {apis.length} 个接口
            </span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#8D9299] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索接口路径或名称..."
              className="w-full bg-[#1E1F22] border border-[#393B40] rounded pl-8 pr-3 py-1 text-xs text-[#DFE1E5] outline-none focus:border-[#3574F0]"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1E1F22] text-[#8D9299] font-mono border-b border-[#393B40] sticky top-0">
              <tr>
                <th className="p-2.5 w-10 text-center">选</th>
                <th className="p-2.5 w-20">方法</th>
                <th className="p-2.5">接口路径</th>
                <th className="p-2.5">接口中文概要</th>
                <th className="p-2.5 w-24">所属模块</th>
                <th className="p-2.5 w-20">状态</th>
                <th className="p-2.5 w-24">更新时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#393B40]">
              {filteredApis.map((api) => {
                const isChecked = selectedApiIds.includes(api.id)
                let methodColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                if (api.method === 'POST') methodColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                if (api.method === 'PUT') methodColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30'

                return (
                  <tr
                    key={api.id}
                    onClick={() => toggleSelectApi(api.id)}
                    className={`hover:bg-[#2B2D30] cursor-pointer transition-colors ${
                      isChecked ? 'bg-[#3574F0]/10' : ''
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-[#393B40] accent-[#3574F0]"
                      />
                    </td>
                    <td className="p-2.5">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${methodColor}`}>
                        {api.method}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-[#DFE1E5]">
                      {api.path}
                    </td>
                    <td className="p-2.5 text-[#DFE1E5] font-medium">
                      {api.summary}
                    </td>
                    <td className="p-2.5 text-[#8D9299]">
                      <span className="px-1.5 py-0.5 rounded bg-[#1E1F22] border border-[#393B40]">
                        {api.module}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {api.status === 'UPDATED' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          UPDATED
                        </span>
                      )}
                      {api.status === 'NEW' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          NEW
                        </span>
                      )}
                      {api.status === 'UNCHANGED' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#393B40] text-[#8D9299]">
                          SYNCED
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-[#8D9299] font-mono text-[11px]">
                      {api.lastSync}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
