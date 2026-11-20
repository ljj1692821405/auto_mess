'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Terminal as TerminalIcon,
  Copy,
  Trash2,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  Code,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Scenario } from '@/lib/mock-data'

interface TerminalConsoleProps {
  scenario: Scenario
  isRunning: boolean
  onReRun: () => void
  onOpenWhaleFix?: () => void
}

type TabType = 'LOGS' | 'CURL' | 'ENV'

export function TerminalConsole({
  scenario,
  isRunning,
  onReRun,
  onOpenWhaleFix
}: TerminalConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>('LOGS')
  const [copied, setCopied] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [displayedLogs, setDisplayedLogs] = useState(scenario.logs)
  const [simulatedProgress, setSimulatedProgress] = useState(100)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulation effect when isRunning changes or scenario changes
  useEffect(() => {
    if (isRunning) {
      setDisplayedLogs([])
      setSimulatedProgress(0)
      const allLogs = scenario.logs
      let currentIndex = 0

      const timer = setInterval(() => {
        if (currentIndex < allLogs.length) {
          const nextLog = allLogs[currentIndex]
          setDisplayedLogs((prev) => [...prev, nextLog])
          currentIndex++
          setSimulatedProgress(Math.round((currentIndex / allLogs.length) * 100))
        } else {
          clearInterval(timer)
        }
      }, 160)

      return () => clearInterval(timer)
    } else {
      setDisplayedLogs(scenario.logs)
      setSimulatedProgress(100)
    }
  }, [isRunning, scenario])

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayedLogs, autoScroll])

  const handleCopy = () => {
    let textToCopy = ''
    if (activeTab === 'LOGS') {
      textToCopy = displayedLogs.map((l) => `[${l.time}] [${l.level}] ${l.message}`).join('\n')
    } else if (activeTab === 'CURL') {
      textToCopy = scenario.curl
    } else {
      textToCopy = JSON.stringify(
        {
          SCENARIO_CODE: scenario.code,
          ENV: scenario.environment,
          RUNNER: 'Worker #3 - Node Sandbox',
          TARGET_GATEWAY: 'https://api-test.jumeng.internal'
        },
        null,
        2
      )
    }

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClearLogs = () => {
    setDisplayedLogs([])
  }

  const hasError = scenario.status === 'FAILED'

  return (
    <div className="h-full flex flex-col bg-[#141416] select-none border-b border-[#393B40]">
      {/* Terminal Title Bar / Tabs */}
      <div className="h-10 px-3 bg-[#1E1F22] border-b border-[#393B40] flex items-center justify-between shrink-0">
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono font-medium transition-colors border-b-2 ${
              activeTab === 'LOGS'
                ? 'bg-[#141416] text-[#DFE1E5] border-[#3574F0]'
                : 'text-[#8D9299] hover:text-[#DFE1E5] border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#E5A84B] animate-ping' : hasError ? 'bg-[#E05555]' : 'bg-[#59A869]'}`} />
            <span>实时执行日志</span>
            {displayedLogs.length > 0 && (
              <span className="text-[10px] text-[#8D9299]">({displayedLogs.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('CURL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono font-medium transition-colors border-b-2 ${
              activeTab === 'CURL'
                ? 'bg-[#141416] text-[#DFE1E5] border-[#3574F0]'
                : 'text-[#8D9299] hover:text-[#DFE1E5] border-transparent'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#3574F0]" />
            <span>网络抓包 (cURL)</span>
          </button>

          <button
            onClick={() => setActiveTab('ENV')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono font-medium transition-colors border-b-2 ${
              activeTab === 'ENV'
                ? 'bg-[#141416] text-[#DFE1E5] border-[#3574F0]'
                : 'text-[#8D9299] hover:text-[#DFE1E5] border-transparent'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#AF7AC5]" />
            <span>环境 Context</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 text-xs">
          {isRunning && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#E5A84B] mr-2">
              <RotateCcw className="w-3 h-3 animate-spin" />
              <span>{simulatedProgress}%</span>
            </div>
          )}

          {hasError && onOpenWhaleFix && (
            <button
              onClick={onOpenWhaleFix}
              className="flex items-center gap-1 px-2 py-0.8 rounded bg-[#3574F0]/20 hover:bg-[#3574F0]/30 border border-[#3574F0]/40 text-[#3574F0] text-[11px] font-medium transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI 诊断原因</span>
            </button>
          )}

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
              autoScroll
                ? 'bg-[#3574F0]/20 border-[#3574F0]/40 text-[#3574F0]'
                : 'bg-[#1E1F22] border-[#393B40] text-[#8D9299]'
            }`}
            title="切换自动滚动到底部"
          >
            滚屏: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-[#2B2D30] text-[#8D9299] hover:text-[#DFE1E5] transition-colors"
            title="复制当前控制台内容"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#59A869]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClearLogs}
            className="p-1 rounded hover:bg-[#2B2D30] text-[#8D9299] hover:text-[#E05555] transition-colors"
            title="清空日志"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-[12px] leading-relaxed select-text"
      >
        {activeTab === 'LOGS' && (
          <div className="space-y-1">
            {displayedLogs.length === 0 ? (
              <div className="text-[#8D9299] py-4 text-center font-mono text-xs">
                {isRunning ? '正在连接测试沙箱网关，拉取实时日志流...' : '控制台无日志输出，点击上方 "运行" 启动用例'}
              </div>
            ) : (
              displayedLogs.map((log, index) => {
                let badgeClass = 'text-[#3574F0]'
                let messageClass = 'text-[#DFE1E5]'

                if (log.level === 'SUCCESS') {
                  badgeClass = 'text-[#59A869]'
                  messageClass = 'text-[#59A869]'
                } else if (log.level === 'ERROR') {
                  badgeClass = 'text-[#E05555] font-bold'
                  messageClass = 'text-[#E05555]'
                } else if (log.level === 'WARN') {
                  badgeClass = 'text-[#E5A84B]'
                  messageClass = 'text-[#E5A84B]'
                } else if (log.level === 'DEBUG') {
                  badgeClass = 'text-[#AF7AC5]'
                  messageClass = 'text-[#8D9299]'
                }

                return (
                  <div key={index} className="flex items-start gap-2 hover:bg-[#1E1F22]/40 px-1 py-0.5 rounded">
                    <span className="text-[#8D9299] shrink-0 font-mono text-[11px] select-none">
                      {log.time}
                    </span>
                    <span className={`shrink-0 text-[11px] font-bold px-1 rounded bg-[#1E1F22] border border-[#393B40] ${badgeClass}`}>
                      {log.level}
                    </span>
                    <span className={`break-all ${messageClass}`}>
                      {log.message}
                    </span>
                  </div>
                )
              })
            )}

            {isRunning && (
              <div className="flex items-center gap-2 text-[#3574F0] animate-pulse pl-1 pt-1">
                <span className="inline-block w-2 h-4 bg-[#3574F0]" />
                <span>EXEC_STREAM: processing next pipeline step...</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'CURL' && (
          <div className="p-2 bg-[#1E1F22] rounded border border-[#393B40] text-[#59A869]">
            <pre className="whitespace-pre-wrap break-all">{scenario.curl}</pre>
          </div>
        )}

        {activeTab === 'ENV' && (
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#1E1F22] rounded border border-[#393B40] space-y-1">
              <div className="text-[11px] text-[#8D9299] font-bold uppercase mb-1">沙箱执行环境上下文</div>
              <div className="grid grid-cols-2 gap-2 text-[#DFE1E5]">
                <div><span className="text-[#8D9299]">ENV_NAME:</span> {scenario.environment}</div>
                <div><span className="text-[#8D9299]">SCENARIO:</span> {scenario.code}</div>
                <div><span className="text-[#8D9299]">RUNNER_ENGINE:</span> Node Sandbox v20.10</div>
                <div><span className="text-[#8D9299]">AUTH_MOCK:</span> WhaleMaid-Bearer-Token</div>
                <div><span className="text-[#8D9299]">BASE_URL:</span> https://api-test.jumeng.internal</div>
                <div><span className="text-[#8D9299]">TIMEOUT:</span> 5000ms</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
