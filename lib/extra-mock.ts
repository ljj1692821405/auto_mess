export interface ContractApi {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  summary: string
  module: string
  version: string
  status: 'UPDATED' | 'NEW' | 'UNCHANGED' | 'DEPRECATED'
  lastSync: string
  parametersCount: number
  hasMock: boolean
}

export const MOCK_CONTRACT_APIS: ContractApi[] = [
  {
    id: 'api-1',
    method: 'POST',
    path: '/api/v1/billing/recharge',
    summary: '剧场充值与开通VIP会员',
    module: '交易中心',
    version: 'v2.4.1',
    status: 'UPDATED',
    lastSync: '10分钟前',
    parametersCount: 6,
    hasMock: true
  },
  {
    id: 'api-2',
    method: 'GET',
    path: '/api/v1/user/vip-profile',
    summary: '查询用户当前VIP特权与折扣资格',
    module: '用户会员',
    version: 'v2.4.0',
    status: 'UNCHANGED',
    lastSync: '2小时前',
    parametersCount: 2,
    hasMock: true
  },
  {
    id: 'api-3',
    method: 'POST',
    path: '/api/v1/ip/whale-maid/dressup',
    summary: '鲸鱼娘角色形象与装扮挂件保存',
    module: 'IP周边与互动',
    version: 'v2.4.2',
    status: 'NEW',
    lastSync: '刚刚',
    parametersCount: 5,
    hasMock: true
  },
  {
    id: 'api-4',
    method: 'POST',
    path: '/api/v1/order/timeout-cancel',
    summary: '超时未支付自动关单与库存回滚补偿',
    module: '订单网关',
    version: 'v2.4.0',
    status: 'UPDATED',
    lastSync: '昨天',
    parametersCount: 4,
    hasMock: false
  },
  {
    id: 'api-5',
    method: 'POST',
    path: '/api/v1/auth/guest-upgrade',
    summary: '游客匿名设备一键转正与Token置换',
    module: '安全鉴权',
    version: 'v2.3.9',
    status: 'UNCHANGED',
    lastSync: '3天前',
    parametersCount: 4,
    hasMock: true
  },
  {
    id: 'api-6',
    method: 'POST',
    path: '/api/v1/drama/unlock-episode/concurrent',
    summary: '并发解锁短剧集数幂等扣费接口',
    module: '短剧内容',
    version: 'v2.4.1',
    status: 'NEW',
    lastSync: '1小时前',
    parametersCount: 3,
    hasMock: true
  }
]

export interface MockFieldRule {
  id: string
  name: string
  type: string
  ruleType: 'FAKER' | 'REGEX' | 'ENUM' | 'FUNCTION' | 'AI_WHALE'
  expression: string
  previewValue: string
  description: string
}

export const MOCK_BUILDER_RULES: MockFieldRule[] = [
  {
    id: 'rule-1',
    name: 'userId',
    type: 'String',
    ruleType: 'AI_WHALE',
    expression: '@whale_maid.user.randomUid()',
    previewValue: '"uid_whale_9082"',
    description: '鲸鱼娘剧梦会员专属测试沙箱UID'
  },
  {
    id: 'rule-2',
    name: 'orderNo',
    type: 'String',
    ruleType: 'FUNCTION',
    expression: '`ORD_${date.now("YYYYMMDD")}_${random.number(1000000,9999999)}`',
    previewValue: '"ORD_20261120_9901823"',
    description: '标准订单防重编号生成器'
  },
  {
    id: 'rule-3',
    name: 'payableAmount',
    type: 'Number (分)',
    ruleType: 'ENUM',
    expression: '[9900, 19800, 29800, 64800]',
    previewValue: '9900',
    description: '合规充值档位金额枚举'
  },
  {
    id: 'rule-4',
    name: 'mobile',
    type: 'String (脱敏)',
    ruleType: 'REGEX',
    expression: '/138\\d{4}8888/',
    previewValue: '"13876128888"',
    description: '测试网段专用手机号'
  },
  {
    id: 'rule-5',
    name: 'whaleOutfit',
    type: 'String',
    ruleType: 'AI_WHALE',
    expression: '@whale_maid.outfit.getRandomSuit()',
    previewValue: '"maid_classic_navy"',
    description: '鲸鱼娘女仆装扮/夏日水手服'
  }
]

export interface FlowNode {
  id: string
  name: string
  type: 'TRIGGER' | 'REQUEST' | 'ASSERT' | 'BRANCH' | 'MOCK_DATA'
  method?: string
  endpoint?: string
  status?: 'NORMAL' | 'WARN' | 'ERROR'
  meta: string
}

export const MOCK_FLOW_NODES: FlowNode[] = [
  {
    id: 'node-1',
    name: '触发事件：用户点击购买年卡',
    type: 'TRIGGER',
    meta: 'Client Web/App 事件'
  },
  {
    id: 'node-2',
    name: '前置造数：注入鲸鱼娘沙箱身份 Token',
    type: 'MOCK_DATA',
    meta: '动态注入 @whale_maid.token'
  },
  {
    id: 'node-3',
    name: '请求：GET /api/v1/user/vip-profile',
    type: 'REQUEST',
    method: 'GET',
    endpoint: '/api/v1/user/vip-profile',
    meta: '校验用户是否有首充半价资格'
  },
  {
    id: 'node-4',
    name: '条件分支：若满足首充资格',
    type: 'BRANCH',
    meta: 'body.data.canUseFirstRechargeDiscount == true'
  },
  {
    id: 'node-5',
    name: '请求：POST /api/v1/coupons/lock',
    type: 'REQUEST',
    method: 'POST',
    endpoint: '/api/v1/coupons/lock',
    meta: '锁定优惠券，返回实付金额 9900'
  },
  {
    id: 'node-6',
    name: '断言：锁定金额与流水号校验',
    type: 'ASSERT',
    meta: 'status == 200 && payableAmount == 9900'
  }
]
