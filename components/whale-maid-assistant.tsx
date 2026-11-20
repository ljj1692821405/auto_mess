'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  X,
  Send,
  Wand2,
  CheckCircle2,
  Copy,
  Check,
  Bot,
  Zap,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  FileCode2,
  ShieldCheck
} from 'lucide-react'
import { WHALE_MAID_AVATAR } from '@/lib/mock-data'

interface WhaleMaidAssistantProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  onApplyFix?: (fixCode: string) => void
}

interface Message {
  id: string
  sender: 'WHALE_MAID' | 'USER'
  content: string
  codeSnippet?: string
  actionLabel?: string
  time: string
}

export function WhaleMaidAssistant({
  isOpen,
  onClose,
  onToggle,
  onApplyFix
}: WhaleMaidAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'WHALE_MAID',
      content: '主人好！我是接口自动化控制台的助理【鲸鱼娘】~ 需要我帮你生成造数脚本、诊断失败用例还是自动补齐断言？',
      time: '刚刚'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const quickPrompts = [
    {
      title: '诊断失败用例 CL-ORDER-03',
      icon: AlertTriangle,
      iconColor: 'text-[#E05555]',
      desc: '分析 504 Gateway Timeout 超时原因并提供重试修复方案',
      prompt: '请分析 CL-ORDER-03 超时未支付关单为何返回 504 错误？',
      reply: '根据链路调用树与日志分析：\n在 Step 3 POST /api/v1/order/timeout-cancel 中，上游 Redis 在高并发下获取分布式锁 [lock:order:ORD_FAIL_99018] 发生争抢超时 (>800ms)，触发网关熔断。\n\n已为你生成自动幂等重试与指数退避补丁：',
      code: `// 智能重试与锁降级补丁
const retryConfig = {
  maxAttempts: 3,
  backoffFactor: 1.5,
  retryCondition: (res) => res.status === 504 || res.status === 409,
  onRetry: (attempt) => console.log(\`[WHALE_MAID] 自动发起第 \${attempt} 次幂等重试...\`)
};`
    },
    {
      title: '生成鲸鱼娘 VIP 开卡造数脚本',
      icon: Zap,
      iconColor: 'text-[#E5A84B]',
      desc: '自动生成真实 UID、优惠券锁定 Token 与验签 Payload',
      prompt: '帮我生成一组剧场 VIP 年卡开通的真实测试数据。',
      reply: '好的！为你生成了匹配 v2.4.0 最新契约的造数脚本，可以直接注入环境变量：',
      code: `// 鲸鱼娘剧梦会员造数规则
const mockPayload = {
  userId: "uid_whale_" + Math.floor(1000 + Math.random() * 9000),
  cardType: "YEARLY_VIP",
  couponId: "cpn_first_50off",
  payableAmount: 9900,
  deviceFingerprint: "fp_ios_whale_maid_01",
  timestamp: Date.now()
};`
    },
    {
      title: '自动补齐 Step 4 响应断言',
      icon: ShieldCheck,
      iconColor: 'text-[#59A869]',
      desc: '根据返回 JSON 结构智能推断字段类型与区间断言',
      prompt: '请帮我为当前接口补全断言规则',
      reply: '已扫描响应体 JSON，推荐以下 3 条强校验断言规则：',
      code: `assertions: [
  { rule: "http.status == 200", expected: "200" },
  { rule: "body.code == 0", expected: "0" },
  { rule: "body.data.rights.includes('WHALE_MAID_CUSTOM_SKIN')", expected: "true" }
]`
    }
  ]

  const handleSendPrompt = (promptText: string, customReply?: string, customCode?: string) => {
    if (!promptText.trim()) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      content: promptText,
      time: '刚刚'
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const maidMsg: Message = {
        id: `m-${Date.now()}`,
        sender: 'WHALE_MAID',
        content: customReply || `主人，我已经根据你的指令【${promptText}】完成智能运算！已为你准备好对应的执行参数与脚本。`,
        codeSnippet: customCode || `// 鲸鱼娘执行器脚本
export default async function runWhaleTask(context) {
  context.log("[WHALE] 智能任务注入完毕，准备执行链路验证");
  return { success: true, timestamp: Date.now() };
}`,
        actionLabel: '一键应用到当前工作流',
        time: '刚刚'
      }
      setMessages((prev) => [...prev, maidMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <>
      {/* Floating Whale Maid Mascot */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col select-none">
        {/* Cute Speech Bubble Tooltip on Hover */}
        {showTooltip && !isOpen && (
          <div className="mb-2 mr-1 px-3 py-1.5 rounded-lg bg-[#2B2D30] border border-[#3574F0] text-xs text-[#DFE1E5] shadow-[0_4px_16px_rgba(0,0,0,0.4)] animate-bounce font-medium flex items-center gap-1.5 max-w-[220px]">
            <Sparkles className="w-3.5 h-3.5 text-[#3574F0] shrink-0" />
            <span>需要我帮你生成造数脚本吗？</span>
          </div>
        )}

        {/* 80px Floating Character Button with Glowing Blue Shadow */}
        <div
          onClick={onToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 group"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-[#3574F0]/30 blur-md group-hover:bg-[#3574F0]/50 transition-all animate-pulse-ring" />

          {/* 80px Whale Maid Character Frame */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#2B2D30] to-[#1E1F22] border-2 border-[#3574F0] shadow-[0_0_15px_rgba(53,116,240,0.5)] overflow-hidden flex items-center justify-center p-1 animate-whale-float">
            <img
              src={WHALE_MAID_AVATAR}
              alt="鲸鱼娘助手"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Online Indicator Badge */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#3574F0] text-white text-[9px] font-mono font-bold shadow-md border border-[#1E1F22]">
            AI
          </div>
        </div>
      </div>

      {/* Whale Maid AI Dialogue Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl h-[560px] bg-[#25272B] border border-[#393B40] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="h-12 px-4 bg-[#2B2D30] border-b border-[#393B40] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1E1F22] border border-[#3574F0] overflow-hidden flex items-center justify-center">
                  <img
                    src={WHALE_MAID_AVATAR}
                    alt="鲸鱼娘"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#DFE1E5] flex items-center gap-1.5">
                    <span>鲸鱼娘 AI 自动化工坊</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3574F0]/20 text-[#3574F0] border border-[#3574F0]/30 font-normal">
                      IntelliJ Agent
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[#1E1F22] text-[#8D9299] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="p-3 bg-[#1E1F22] border-b border-[#393B40] flex items-center gap-2 overflow-x-auto select-none">
              <span className="text-[11px] text-[#8D9299] shrink-0 flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-[#3574F0]" />
                <span>快捷指令:</span>
              </span>

              {quickPrompts.map((qp, idx) => {
                const Icon = qp.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(qp.prompt, qp.reply, qp.code)}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#2B2D30] hover:bg-[#3574F0]/20 border border-[#393B40] hover:border-[#3574F0] text-xs text-[#DFE1E5] hover:text-[#3574F0] transition-all flex items-center gap-1.5"
                  >
                    <Icon className={`w-3.5 h-3.5 ${qp.iconColor}`} />
                    <span>{qp.title}</span>
                  </button>
                )
              })}
            </div>

            {/* Messages Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {messages.map((msg) => {
                const isMaid = msg.sender === 'WHALE_MAID'
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isMaid ? 'items-start' : 'items-start flex-row-reverse'}`}
                  >
                    {isMaid ? (
                      <div className="w-8 h-8 rounded-full bg-[#1E1F22] border border-[#3574F0] overflow-hidden shrink-0 mt-0.5">
                        <img
                          src={WHALE_MAID_AVATAR}
                          alt="鲸鱼娘"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#3574F0] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        PM
                      </div>
                    )}

                    <div className={`max-w-[85%] space-y-2 ${isMaid ? 'text-left' : 'text-right'}`}>
                      <div
                        className={`inline-block p-3 rounded-lg leading-relaxed whitespace-pre-wrap ${
                          isMaid
                            ? 'bg-[#2B2D30] border border-[#393B40] text-[#DFE1E5]'
                            : 'bg-[#3574F0] text-white'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Code Snippet Box if available */}
                      {msg.codeSnippet && (
                        <div className="rounded bg-[#141416] border border-[#393B40] overflow-hidden text-left font-mono text-[11px]">
                          <div className="px-3 py-1 bg-[#1E1F22] border-b border-[#393B40] flex items-center justify-between text-[#8D9299]">
                            <span>自动化执行脚本</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                                className="flex items-center gap-1 text-[10px] hover:text-[#DFE1E5]"
                              >
                                {copiedId === msg.id ? <Check className="w-3 h-3 text-[#59A869]" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === msg.id ? '已复制' : '复制'}</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 text-[#59A869] overflow-x-auto">
                            {msg.codeSnippet}
                          </pre>
                          {msg.actionLabel && onApplyFix && (
                            <div className="p-2 bg-[#1E1F22] border-t border-[#393B40] flex justify-end">
                              <button
                                onClick={() => {
                                  onApplyFix(msg.codeSnippet!)
                                  onClose()
                                }}
                                className="px-3 py-1 rounded bg-[#3574F0] hover:bg-[#4682F4] text-white text-xs font-medium flex items-center gap-1"
                              >
                                <Zap className="w-3 h-3" />
                                <span>{msg.actionLabel}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-[#8D9299]">
                  <div className="w-8 h-8 rounded-full bg-[#1E1F22] border border-[#3574F0] overflow-hidden shrink-0">
                    <img
                      src={WHALE_MAID_AVATAR}
                      alt="鲸鱼娘"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="px-3 py-2 rounded bg-[#2B2D30] border border-[#393B40] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3574F0] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3574F0] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3574F0] animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-mono">鲸鱼娘正在为你推断造数规则...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Box */}
            <div className="p-3 bg-[#2B2D30] border-t border-[#393B40] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                    handleSendPrompt(inputValue)
                  }
                }}
                placeholder="向鲸鱼娘输入造数需求，例如：'生成 5 个游客转正订单并发测试用例'..."
                className="flex-1 bg-[#1E1F22] border border-[#393B40] focus:border-[#3574F0] rounded px-3 py-2 text-xs text-[#DFE1E5] placeholder-[#8D9299] outline-none"
              />
              <button
                onClick={() => handleSendPrompt(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="px-3.5 py-2 rounded bg-[#3574F0] hover:bg-[#4682F4] text-white text-xs font-medium disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
