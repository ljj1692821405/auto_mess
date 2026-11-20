'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopStepper } from '@/components/top-stepper'
import { ScenarioList } from '@/components/scenario-list'
import { TerminalConsole } from '@/components/terminal-console'
import { TestResultTree } from '@/components/test-result-tree'
import { WhaleMaidAssistant } from '@/components/whale-maid-assistant'
import { ContractFetchView } from '@/components/contract-fetch-view'
import { SmartMockView } from '@/components/smart-mock-view'
import { FlowGeneratorView } from '@/components/flow-generator-view'
import { ExportReportModal } from '@/components/export-report-modal'
import { DebugStepModal } from '@/components/debug-step-modal'
import { AddScenarioModal } from '@/components/add-scenario-modal'
import { INITIAL_SCENARIOS, Scenario, RequestStep } from '@/lib/mock-data'
import { CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react'

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('exec')
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INITIAL_SCENARIOS[0].id)
  const [isRunning, setIsRunning] = useState(false)
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals
  const [isWhaleAssistantOpen, setIsWhaleAssistantOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0]

  const successCount = scenarios.filter((s) => s.status === 'SUCCESS').length
  const failedCount = scenarios.filter((s) => s.status === 'FAILED').length
  const avgDuration = Math.round(scenarios.reduce((acc, s) => acc + s.duration, 0) / scenarios.length)

  // Keyboard shortcut Ctrl+R to run selected scenario
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleRunSelectedScenario()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedScenarioId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Run single selected scenario
  const handleRunSelectedScenario = () => {
    if (isRunning) return
    setIsRunning(true)
    showToast(`▶ 正在启动场景 [${selectedScenario.code}] 执行流...`)

    setTimeout(() => {
      setIsRunning(false)
      showToast(`✓ 场景 [${selectedScenario.code}] 执行完成！耗时 ${selectedScenario.duration}ms`)
    }, 2000)
  }

  // Run all scenarios
  const handleRunAll = () => {
    if (isRunningAll) return
    setIsRunningAll(true)
    showToast('🚀 正在并发全量回归所有测试用例...')

    setTimeout(() => {
      setIsRunningAll(false)
      showToast('🎉 全量回归测试执行完毕！通过率 83.3%')
    }, 2500)
  }

  // Replay a single step
  const handleReplayStep = (step: RequestStep) => {
    showToast(`⚡ 正在重放步骤: ${step.method} ${step.endpoint}`)
  }

  // Apply AI fix code from Whale Maid
  const handleApplyFix = (fixCode: string) => {
    showToast('✨ 鲸鱼娘 AI 修复脚本已成功注入当前执行上下文！')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1E1F22] text-[#DFE1E5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[#2B2D30] border border-[#3574F0] text-xs text-white shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#59A869]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar (240px) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenWhaleAssistant={() => setIsWhaleAssistantOpen(true)}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Stepper Bar */}
        <TopStepper
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onRunAll={handleRunAll}
          onExportReport={() => setIsExportModalOpen(true)}
          isRunningAll={isRunningAll}
          totalScenarios={scenarios.length}
          successCount={successCount}
          failedCount={failedCount}
          avgDuration={avgDuration}
        />

        {/* Dynamic Content Views based on Stepper Tab */}
        <main className="flex-1 min-h-0 overflow-hidden relative">
          {/* Step 1: Contract Pull View */}
          {currentTab === 'fetch' && (
            <ContractFetchView
              onNextStep={() => setCurrentTab('mock')}
              onImportToScenarios={() => {
                showToast('契约已导入至场景库')
                setCurrentTab('exec')
              }}
            />
          )}

          {/* Step 2: Smart Mock Data View */}
          {currentTab === 'mock' && (
            <SmartMockView
              onNextStep={() => setCurrentTab('flow')}
              onOpenWhaleAssistant={() => setIsWhaleAssistantOpen(true)}
            />
          )}

          {/* Step 3: Flow Generator View */}
          {currentTab === 'flow' && (
            <FlowGeneratorView
              onNextStep={() => setCurrentTab('exec')}
              onOpenWhaleAssistant={() => setIsWhaleAssistantOpen(true)}
            />
          )}

          {/* Step 4: Core Execution & Reporting Split View */}
          {currentTab === 'exec' && (
            <div className="h-full flex flex-col lg:flex-row overflow-hidden">
              {/* Left Column (40%): Scenario List */}
              <div className="w-full lg:w-[38%] h-1/2 lg:h-full shrink-0">
                <ScenarioList
                  scenarios={scenarios}
                  selectedScenarioId={selectedScenarioId}
                  onSelectScenario={(s) => setSelectedScenarioId(s.id)}
                  onRunSelectedScenario={handleRunSelectedScenario}
                  onDebugStep={() => setIsDebugModalOpen(true)}
                  onAddNewScenario={() => setIsAddModalOpen(true)}
                  isRunning={isRunning}
                  onResetFilters={() => setSelectedScenarioId(scenarios[0].id)}
                  onGoToFetch={() => setCurrentTab('fetch')}
                />
              </div>

              {/* Right Column (62%): Split Top & Bottom */}
              <div className="flex-1 h-1/2 lg:h-full flex flex-col min-w-0 overflow-hidden">
                {/* Top Half (50%): Terminal Console */}
                <div className="h-1/2 min-h-0">
                  <TerminalConsole
                    scenario={selectedScenario}
                    isRunning={isRunning}
                    onReRun={handleRunSelectedScenario}
                    onOpenWhaleFix={() => setIsWhaleAssistantOpen(true)}
                  />
                </div>

                {/* Bottom Half (50%): Test Result Tree */}
                <div className="h-1/2 min-h-0">
                  <TestResultTree
                    scenario={selectedScenario}
                    onReplayStep={handleReplayStep}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Whale Maid Mascot Assistant */}
      <WhaleMaidAssistant
        isOpen={isWhaleAssistantOpen}
        onClose={() => setIsWhaleAssistantOpen(false)}
        onToggle={() => setIsWhaleAssistantOpen(!isWhaleAssistantOpen)}
        onApplyFix={handleApplyFix}
      />

      {/* PM Executive Test Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scenarios={scenarios}
      />

      {/* Step Debug Replay Modal */}
      <DebugStepModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        scenario={selectedScenario}
      />

      {/* Add Custom Scenario Modal */}
      <AddScenarioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddScenario={(newSc) => {
          setScenarios([newSc, ...scenarios])
          setSelectedScenarioId(newSc.id)
          showToast(`已创建并选中新场景: ${newSc.code}`)
        }}
      />
    </div>
  )
}
