'use client'

import React, { useState } from 'react'
import {
  Layers,
  Database,
  GitFork,
  PlayCircle,
  ChevronDown,
  Check,
  Search,
  Sparkles,
  Server,
  Activity,
  Terminal,
  Cpu
} from 'lucide-react'
import { WHALE_MAID_AVATAR } from '@/lib/mock-data'

interface SidebarProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  onOpenWhaleAssistant: () => void
}

const WORKSPACES = [
  { id: 'ws-1', name: '剧梦C端', desc: '短剧与商城主链路', branch: 'feat/v2.4-order' },
  { id: 'ws-2', name: '交易支付中台', desc: '收银台与清结算', branch: 'master' },
  { id: 'ws-3', name: '短剧内容分发', desc: '选集与播放器流媒体', branch: 'release/v2.3' },
  { id: 'ws-4', name: '鲸鱼娘IP互动', desc: '虚拟装扮与任务成就', branch: 'dev/ip-maid' }
]

export function Sidebar({ currentTab, onSelectTab, onOpenWhaleAssistant }: SidebarProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(WORKSPACES[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [sidebarSearch, setSidebarSearch] = useState('')

  const menuItems = [
    { id: 'fetch', name: '数据拉取', icon: Layers, badge: 'Swagger Sync', count: 6 },
    { id: 'mock', name: '智能造数', icon: Database, badge: 'AI Faker', count: 5 },
    { id: 'flow', name: '生成场景', icon: GitFork, badge: 'Flow Graph', count: 8 },
    { id: 'exec', name: '执行与报告', icon: PlayCircle, badge: 'Active', count: 6, isDefault: true }
  ]

  return (
    <aside className="w-[240px] shrink-0 h-screen bg-[#2B2D30] border-r border-[#393B40] flex flex-col select-none relative z-20">
      {/* Top Logo & App Title */}
      <div className="h-12 px-3 border-b border-[#393B40] flex items-center justify-between bg-[#25272B]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#3574F0] to-[#1E40AF] flex items-center justify-center shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-xs tracking-wide text-[#DFE1E5]">
            API Automation
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3574F0]/20 text-[#3574F0] font-mono border border-[#3574F0]/30 font-medium">
            IDEA v2.4
          </span>
        </div>
      </div>

      {/* Workspace Dropdown */}
      <div className="p-2 border-b border-[#393B40] bg-[#2B2D30]">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#1E1F22] hover:bg-[#25272B] border border-[#393B40] hover:border-[#3574F0] text-left transition-all duration-150 group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-[#59A869] shrink-0 animate-pulse" />
              <div className="truncate">
                <div className="text-xs font-medium text-[#DFE1E5] truncate group-hover:text-white">
                  {selectedWorkspace.name}
                </div>
                <div className="text-[10px] text-[#8D9299] truncate font-mono">
                  {selectedWorkspace.branch}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8D9299] transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180 text-[#3574F0]' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#1E1F22] border border-[#393B40] rounded shadow-2xl py-1 z-50">
                <div className="px-2 py-1 text-[10px] font-medium text-[#8D9299] uppercase tracking-wider">
                  切换所属微服务
                </div>
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-[#2B2D30] text-xs transition-colors ${
                      selectedWorkspace.id === ws.id ? 'bg-[#3574F0]/15 text-[#3574F0] font-medium' : 'text-[#DFE1E5]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate font-medium">{ws.name}</div>
                      <div className="text-[10px] text-[#8D9299] truncate">{ws.desc}</div>
                    </div>
                    {selectedWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 text-[#3574F0] shrink-0" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-2 px-1.5 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1 text-[10px] font-semibold text-[#8D9299] uppercase tracking-wider flex items-center justify-between">
          <span>工作台链路</span>
          <span className="text-[9px] font-mono text-[#8D9299]">4 阶段</span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#3574F0]/20 text-white border-l-[3px] border-[#3574F0] pl-[7px]'
                  : 'text-[#DFE1E5] hover:bg-[#1E1F22] hover:text-white border-l-[3px] border-transparent pl-[7px]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#3574F0]' : 'text-[#8D9299] group-hover:text-[#DFE1E5]'}`} />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-[#3574F0] text-white' : 'bg-[#1E1F22] text-[#8D9299] group-hover:text-[#DFE1E5]'
                }`}>
                  {item.count}
                </span>
              </div>
            </button>
          )
        })}

        {/* Whale Maid Special Companion Card in Sidebar */}
        <div className="mt-4 pt-3 border-t border-[#393B40] px-1">
          <div
            onClick={onOpenWhaleAssistant}
            className="p-2 rounded bg-gradient-to-r from-[#1E1F22] to-[#25272B] border border-[#393B40] hover:border-[#3574F0] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1E1F22] border border-[#3574F0]/40 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={WHALE_MAID_AVATAR}
                  alt="鲸鱼娘助手"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#DFE1E5] group-hover:text-[#3574F0] transition-colors">
                  <span>鲸鱼娘 AI 辅佐</span>
                  <Sparkles className="w-3 h-3 text-[#3574F0] animate-pulse" />
                </div>
                <div className="text-[10px] text-[#8D9299] truncate">
                  点击唤起造数与断言助手
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Service Status & System Health */}
      <div className="p-2.5 border-t border-[#393B40] bg-[#25272B] space-y-1.5">
        <div className="text-[10px] font-semibold text-[#8D9299] uppercase tracking-wider flex items-center justify-between">
          <span>服务状态</span>
          <span className="flex items-center gap-1 text-[#59A869]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#59A869] animate-ping" />
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="flex items-center gap-1.5 p-1 rounded bg-[#1E1F22] text-[#DFE1E5]">
            <Server className="w-3 h-3 text-[#59A869]" />
            <span className="truncate">契约网关: 200</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded bg-[#1E1F22] text-[#DFE1E5]">
            <Cpu className="w-3 h-3 text-[#3574F0]" />
            <span className="truncate">Mock: 极速</span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-[10px] text-[#8D9299]">
          <span className="font-mono">Runner #3</span>
          <span className="font-mono">沙箱延时 1.2ms</span>
        </div>
      </div>
    </aside>
  )
}
