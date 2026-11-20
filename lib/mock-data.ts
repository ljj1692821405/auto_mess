export interface RequestStep {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  status: number
  statusText: string
  duration: number // ms
  timestamp: string
  isSuccess: boolean
  requestHeaders: Record<string, string>
  requestBody?: any
  responseHeaders: Record<string, string>
  responseBody: any
  assertions: {
    rule: string
    expected: string
    actual: string
    passed: boolean
  }[]
}

export interface Scenario {
  id: string
  code: string
  title: string
  category: string
  tag: string
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'PENDING'
  statusCode: number
  duration: number
  stepsCount: number
  passedStepsCount: number
  updatedAt: string
  description: string
  author: string
  environment: string
  steps: RequestStep[]
  logs: {
    time: string
    level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'DEBUG'
    message: string
  }[]
  curl: string
}

export const WHALE_MAID_AVATAR = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04f51ee5-d5a4-4c0b-aa27-adaf89ea1a82-iUBSl4ddzFMbcSge1urjFwcEL9gZbk.png'

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    code: 'CL-BILL-01',
    title: '剧场充值开卡链路闭环测试',
    category: '交易计费',
    tag: '核心链路 P0',
    status: 'SUCCESS',
    statusCode: 200,
    duration: 142,
    stepsCount: 4,
    passedStepsCount: 4,
    updatedAt: '14:28:10',
    description: '模拟用户从拉取开卡权益、绑定首充优惠券、唤起微信支付预下单到最终权益到账的完整链路验证。',
    author: 'QA_Alice',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/billing/recharge" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -H "X-Trace-Id: trace_bill_89a7f201" \\
  -d '{"userId":"uid_whale_9082","cardType":"YEARLY_VIP","couponId":"cpn_first_50off","payChannel":"WXPAY_APP"}'`,
    steps: [
      {
        id: 'step-1-1',
        name: '获取当前用户开卡权益档案',
        method: 'GET',
        endpoint: '/api/v1/user/vip-profile',
        status: 200,
        statusText: 'OK',
        duration: 22,
        timestamp: '14:28:10.120',
        isSuccess: true,
        requestHeaders: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...',
          'X-Client-Version': 'v2.4.0',
          'X-Device-Id': 'dev_whale_ios_01'
        },
        responseHeaders: {
          'content-type': 'application/json; charset=utf-8',
          'x-response-time': '21.4ms',
          'x-trace-id': 'trace_bill_89a7f201_01'
        },
        responseBody: {
          code: 0,
          msg: 'success',
          data: {
            userId: 'uid_whale_9082',
            currentLevel: 'NORMAL',
            vipExpireAt: null,
            canUseFirstRechargeDiscount: true,
            availableCoupons: ['cpn_first_50off', 'cpn_summer_10']
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.code == 0', expected: '0', actual: '0', passed: true },
          { rule: 'body.data.canUseFirstRechargeDiscount == true', expected: 'true', actual: 'true', passed: true }
        ]
      },
      {
        id: 'step-1-2',
        name: '锁定首充5折优惠券并验签',
        method: 'POST',
        endpoint: '/api/v1/coupons/lock',
        status: 200,
        statusText: 'OK',
        duration: 35,
        timestamp: '14:28:10.155',
        isSuccess: true,
        requestHeaders: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...',
          'Content-Type': 'application/json'
        },
        requestBody: {
          couponId: 'cpn_first_50off',
          orderAmount: 19800,
          userId: 'uid_whale_9082'
        },
        responseHeaders: {
          'content-type': 'application/json',
          'x-trace-id': 'trace_bill_89a7f201_02'
        },
        responseBody: {
          code: 0,
          msg: 'coupon locked',
          data: {
            lockToken: 'lkt_7f8a9e0b1c2d',
            discountAmount: 9900,
            payableAmount: 9900,
            lockExpireSeconds: 300
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.payableAmount == 9900', expected: '9900', actual: '9900', passed: true },
          { rule: 'body.data.lockToken != null', expected: 'not empty', actual: 'lkt_7f8a9e0b1c2d', passed: true }
        ]
      },
      {
        id: 'step-1-3',
        name: '发起三方预支付订单',
        method: 'POST',
        endpoint: '/api/v1/billing/recharge/prepay',
        status: 200,
        statusText: 'OK',
        duration: 48,
        timestamp: '14:28:10.203',
        isSuccess: true,
        requestHeaders: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...',
          'Content-Type': 'application/json'
        },
        requestBody: {
          userId: 'uid_whale_9082',
          cardType: 'YEARLY_VIP',
          payableAmount: 9900,
          couponLockToken: 'lkt_7f8a9e0b1c2d',
          payChannel: 'WXPAY_APP'
        },
        responseHeaders: {
          'content-type': 'application/json',
          'x-trace-id': 'trace_bill_89a7f201_03'
        },
        responseBody: {
          code: 0,
          msg: 'order created',
          data: {
            orderNo: 'ORD_20261120_9901823',
            prepayId: 'wx20261120142810892019',
            nonceStr: '8a9f0e1d2c3b',
            sign: 'F9A8C7E6D5B4A3...',
            status: 'PAYING'
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.orderNo startsWith "ORD_"', expected: 'true', actual: 'true', passed: true },
          { rule: 'body.data.prepayId != null', expected: 'not empty', actual: 'wx20261120142810892019', passed: true }
        ]
      },
      {
        id: 'step-1-4',
        name: '模拟支付回调并校验开卡入账',
        method: 'POST',
        endpoint: '/api/v1/mock/pay-callback-sync',
        status: 200,
        statusText: 'OK',
        duration: 37,
        timestamp: '14:28:10.252',
        isSuccess: true,
        requestHeaders: {
          'Content-Type': 'application/json',
          'X-Mock-Secret': 'whale_maid_sandbox_sec'
        },
        requestBody: {
          orderNo: 'ORD_20261120_9901823',
          paySuccess: true,
          tradeNo: 'TRADE_WX_982103819'
        },
        responseHeaders: {
          'content-type': 'application/json',
          'x-trace-id': 'trace_bill_89a7f201_04'
        },
        responseBody: {
          code: 0,
          msg: 'vip activated',
          data: {
            userId: 'uid_whale_9082',
            level: 'YEARLY_VIP',
            effectiveDays: 365,
            rights: ['AD_FREE', '4K_DOLBY', 'EXCLUSIVE_SHORT_DRAMA', 'WHALE_MAID_CUSTOM_SKIN']
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.level == "YEARLY_VIP"', expected: 'YEARLY_VIP', actual: 'YEARLY_VIP', passed: true },
          { rule: 'body.data.rights contains "WHALE_MAID_CUSTOM_SKIN"', expected: 'true', actual: 'true', passed: true }
        ]
      }
    ],
    logs: [
      { time: '14:28:10.080', level: 'INFO', message: '[INIT] 启动自动化测试 Runner (Worker #3, Node-IDEA-SandBox)' },
      { time: '14:28:10.095', level: 'DEBUG', message: '[CONTEXT] 注入环境变量: ENV=TEST-01, MOCK_UID=uid_whale_9082, MOCK_GATEWAY=ACTIVE' },
      { time: '14:28:10.120', level: 'INFO', message: '[STEP 1/4] 发送请求: GET /api/v1/user/vip-profile -> 200 OK (22ms)' },
      { time: '14:28:10.122', level: 'SUCCESS', message: '[ASSERT] Step 1 全部 3 条断言通过: [status==200, code==0, canDiscount==true]' },
      { time: '14:28:10.155', level: 'INFO', message: '[STEP 2/4] 发送请求: POST /api/v1/coupons/lock -> 200 OK (35ms)' },
      { time: '14:28:10.158', level: 'SUCCESS', message: '[ASSERT] Step 2 优惠券锁定校验通过，锁定 Token: lkt_7f8a9e0b1c2d' },
      { time: '14:28:10.203', level: 'INFO', message: '[STEP 3/4] 发送请求: POST /api/v1/billing/recharge/prepay -> 200 OK (48ms)' },
      { time: '14:28:10.205', level: 'SUCCESS', message: '[ASSERT] Step 3 预下单成功，订单号: ORD_20261120_9901823' },
      { time: '14:28:10.252', level: 'INFO', message: '[STEP 4/4] 发送请求: POST /api/v1/mock/pay-callback-sync -> 200 OK (37ms)' },
      { time: '14:28:10.255', level: 'SUCCESS', message: '[ASSERT] Step 4 开卡权益入账校验成功，赋予年卡特权 [WHALE_MAID_CUSTOM_SKIN]' },
      { time: '14:28:10.260', level: 'SUCCESS', message: '[SUMMARY] 场景 CL-BILL-01 执行成功! 总耗时: 142ms, 通过率: 100% (4/4)' }
    ]
  },
  {
    id: 'sc-2',
    code: 'CL-IP-01',
    title: '鲸鱼娘IP形象挂件与换装校验',
    category: 'IP周边与互动',
    tag: '前端联动',
    status: 'SUCCESS',
    statusCode: 200,
    duration: 88,
    stepsCount: 3,
    passedStepsCount: 3,
    updatedAt: '14:27:50',
    description: '验证用户在装扮商城切换鲸鱼娘女仆装、水滴耳饰与尾巴摆件时的互斥排他逻辑与图层渲染元数据校验。',
    author: 'Design_Miku',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/ip/whale-maid/dressup" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..." \\
  -H "Content-Type: application/json" \\
  -d '{"avatarId":"whale_maid_chibi_01","outfit":"maid_classic_navy","accessory":"ear_ribbon_cyan","pose":"floating_magic"}'`,
    steps: [
      {
        id: 'step-2-1',
        name: '获取鲸鱼娘角色装扮背包资产',
        method: 'GET',
        endpoint: '/api/v1/ip/whale-maid/inventory',
        status: 200,
        statusText: 'OK',
        duration: 25,
        timestamp: '14:27:50.040',
        isSuccess: true,
        requestHeaders: { 'Authorization': 'Bearer token_ip_01' },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: {
          code: 0,
          msg: 'ok',
          data: {
            character: 'WHALE_MAID',
            unlockedOutfits: ['maid_classic_navy', 'summer_sailor', 'sakura_kimono'],
            currentEquipped: {
              dress: 'maid_classic_navy',
              ribbon: 'ear_ribbon_cyan',
              tailAccessory: 'water_bubble_glow'
            }
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.character == "WHALE_MAID"', expected: 'WHALE_MAID', actual: 'WHALE_MAID', passed: true }
        ]
      },
      {
        id: 'step-2-2',
        name: '提交全新装扮组合与互斥校验',
        method: 'POST',
        endpoint: '/api/v1/ip/whale-maid/dressup',
        status: 200,
        statusText: 'OK',
        duration: 38,
        timestamp: '14:27:50.080',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: {
          outfit: 'maid_classic_navy',
          accessory: 'ear_ribbon_cyan',
          pose: 'floating_magic'
        },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: {
          code: 0,
          msg: 'dressup updated',
          data: {
            renderUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04f51ee5-d5a4-4c0b-aa27-adaf89ea1a82-iUBSl4ddzFMbcSge1urjFwcEL9gZbk.png',
            layerHash: 'hash_whale_maid_66a8',
            interactiveSounds: ['nya_welcome.mp3', 'bubble_pop.mp3']
          }
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.layerHash != null', expected: 'not empty', actual: 'hash_whale_maid_66a8', passed: true }
        ]
      },
      {
        id: 'step-2-3',
        name: '校验客户端形象缓存同步广播',
        method: 'GET',
        endpoint: '/api/v1/ip/whale-maid/sync-status',
        status: 200,
        statusText: 'OK',
        duration: 25,
        timestamp: '14:27:50.118',
        isSuccess: true,
        requestHeaders: { 'Authorization': 'Bearer token_ip_01' },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: {
          code: 0,
          data: { syncClients: 1, cdnCached: true }
        },
        assertions: [
          { rule: 'body.data.cdnCached == true', expected: 'true', actual: 'true', passed: true }
        ]
      }
    ],
    logs: [
      { time: '14:27:50.010', level: 'INFO', message: '[INIT] 场景 CL-IP-01 形象挂件自动化用例启动' },
      { time: '14:27:50.040', level: 'INFO', message: '[STEP 1/3] GET /api/v1/ip/whale-maid/inventory -> 200 OK (25ms)' },
      { time: '14:27:50.080', level: 'INFO', message: '[STEP 2/3] POST /api/v1/ip/whale-maid/dressup -> 200 OK (38ms)' },
      { time: '14:27:50.082', level: 'SUCCESS', message: '[RENDER] 鲸鱼娘 3D/2D 形象贴图加载成功: [maid_classic_navy]' },
      { time: '14:27:50.118', level: 'INFO', message: '[STEP 3/3] GET /api/v1/ip/whale-maid/sync-status -> 200 OK (25ms)' },
      { time: '14:27:50.125', level: 'SUCCESS', message: '[SUMMARY] 场景 CL-IP-01 形象校验全绿通过! 耗时 88ms' }
    ]
  },
  {
    id: 'sc-3',
    code: 'CL-ORDER-03',
    title: '超时未支付自动关单与库存回滚',
    category: '订单生命周期',
    tag: '异常补偿',
    status: 'FAILED',
    statusCode: 504,
    duration: 1052,
    stepsCount: 4,
    passedStepsCount: 2,
    updatedAt: '14:25:30',
    description: '测试创建限时短剧抢购订单后未在有效窗口内付款，死信延迟队列关单超时异常及库存锁回滚失败。',
    author: 'QA_Bob',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/order/timeout-cancel" \\
  -H "X-Mock-Timeout: 1000ms" \\
  -d '{"orderNo":"ORD_FAIL_99018","reason":"PAY_TIMEOUT_AUTO"}'`,
    steps: [
      {
        id: 'step-3-1',
        name: '生成抢购待支付占位单',
        method: 'POST',
        endpoint: '/api/v1/order/flash-create',
        status: 200,
        statusText: 'OK',
        duration: 45,
        timestamp: '14:25:29.010',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { skuId: 'sku_drama_limited_99', qty: 1 },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, data: { orderNo: 'ORD_FAIL_99018', stockLocked: true } },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true }
        ]
      },
      {
        id: 'step-3-2',
        name: '模拟延迟未支付并向死信队列投递',
        method: 'POST',
        endpoint: '/api/v1/mock/delay-queue/publish',
        status: 200,
        statusText: 'OK',
        duration: 15,
        timestamp: '14:25:29.060',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { topic: 'TOPIC_ORDER_DEAD_LETTER', delayMs: 1000 },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, msg: 'enqueued' },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true }
        ]
      },
      {
        id: 'step-3-3',
        name: '触发订单中心超时关单逻辑',
        method: 'POST',
        endpoint: '/api/v1/order/timeout-cancel',
        status: 504,
        statusText: 'Gateway Timeout',
        duration: 980,
        timestamp: '14:25:30.050',
        isSuccess: false,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { orderNo: 'ORD_FAIL_99018', reason: 'PAY_TIMEOUT_AUTO' },
        responseHeaders: { 'content-type': 'application/json', 'x-upstream-err': 'redis_lock_timeout' },
        responseBody: {
          code: 50401,
          error: 'Gateway Timeout: Upstream Redis lock acquire timeout [lock:order:ORD_FAIL_99018]'
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '504', passed: false },
          { rule: 'body.code == 0', expected: '0', actual: '50401', passed: false }
        ]
      },
      {
        id: 'step-3-4',
        name: '校验商品库存释放回滚',
        method: 'GET',
        endpoint: '/api/v1/sku/stock-verify?skuId=sku_drama_limited_99',
        status: 0,
        statusText: 'SKIPPED',
        duration: 0,
        timestamp: '14:25:30.060',
        isSuccess: false,
        requestHeaders: {},
        responseHeaders: {},
        responseBody: { msg: '前置步骤异常，步骤熔断未执行' },
        assertions: [
          { rule: 'body.data.availableStock == 100', expected: '100', actual: 'SKIPPED', passed: false }
        ]
      }
    ],
    logs: [
      { time: '14:25:29.001', level: 'INFO', message: '[INIT] 场景 CL-ORDER-03 启动执行' },
      { time: '14:25:29.010', level: 'INFO', message: '[STEP 1/4] POST /api/v1/order/flash-create -> 200 OK (45ms)' },
      { time: '14:25:29.060', level: 'INFO', message: '[STEP 2/4] POST /api/v1/mock/delay-queue/publish -> 200 OK (15ms)' },
      { time: '14:25:29.075', level: 'WARN', message: '[MQ] 等待死信队列消费通知响应 (模拟高并发抢占 Redis 分布式锁)' },
      { time: '14:25:30.050', level: 'ERROR', message: '[STEP 3/4] POST /api/v1/order/timeout-cancel -> 504 Gateway Timeout (980ms)' },
      { time: '14:25:30.052', level: 'ERROR', message: '[ASSERT FAILED] 期望 http.status==200, 实际收到 504 Gateway Timeout!' },
      { time: '14:25:30.055', level: 'ERROR', message: '[CAUSE] Redis 集群在获取锁 [lock:order:ORD_FAIL_99018] 时发生锁争抢超时 (>800ms)' },
      { time: '14:25:30.060', level: 'WARN', message: '[CIRCUIT_BREAKER] 步骤 4/4 [校验商品库存释放] 已被自动熔断跳过' },
      { time: '14:25:30.062', level: 'ERROR', message: '[SUMMARY] 场景 CL-ORDER-03 执行失败! 通过率 50% (2/4), 耗时 1052ms' }
    ]
  },
  {
    id: 'sc-4',
    code: 'CL-AUTH-02',
    title: '游客匿名转正与双Token轮换',
    category: '用户鉴权',
    tag: '安全风控',
    status: 'SUCCESS',
    statusCode: 200,
    duration: 64,
    stepsCount: 2,
    passedStepsCount: 2,
    updatedAt: '14:20:15',
    description: '验证无感游客使用匿名设备指纹快速试看短剧后，通过一键手机号登录合并资产并换发长效 RefreshToken。',
    author: 'Sec_David',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/auth/guest-upgrade" \\
  -H "X-Device-Fingerprint: fp_a8f902c" \\
  -d '{"guestToken":"gst_901823","mobileEncrypted":"enc_887162819","smsCode":"8888"}'`,
    steps: [
      {
        id: 'step-4-1',
        name: '生成游客设备匿名 Token',
        method: 'POST',
        endpoint: '/api/v1/auth/anonymous-session',
        status: 200,
        statusText: 'OK',
        duration: 28,
        timestamp: '14:20:15.010',
        isSuccess: true,
        requestHeaders: { 'X-Device-Fingerprint': 'fp_a8f902c' },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, data: { guestToken: 'gst_901823', temporaryUid: 'tmp_88921' } },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '200', passed: true },
          { rule: 'body.data.guestToken != null', expected: 'not empty', actual: 'gst_901823', passed: true }
        ]
      },
      {
        id: 'step-4-2',
        name: '手机号绑定并换发正式 AccessToken',
        method: 'POST',
        endpoint: '/api/v1/auth/guest-upgrade',
        status: 200,
        statusText: 'OK',
        duration: 36,
        timestamp: '14:20:15.048',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { guestToken: 'gst_901823', mobile: '138****8888', code: '8888' },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: {
          code: 0,
          data: {
            accessToken: 'at_live_whale_20261120',
            refreshToken: 'rt_live_whale_long',
            userMerged: true
          }
        },
        assertions: [
          { rule: 'body.data.accessToken != null', expected: 'not null', actual: 'at_live_whale_20261120', passed: true },
          { rule: 'body.data.userMerged == true', expected: 'true', actual: 'true', passed: true }
        ]
      }
    ],
    logs: [
      { time: '14:20:15.001', level: 'INFO', message: '[INIT] 场景 CL-AUTH-02 鉴权与转正用例启动' },
      { time: '14:20:15.010', level: 'INFO', message: '[STEP 1/2] POST /api/v1/auth/anonymous-session -> 200 OK (28ms)' },
      { time: '14:20:15.048', level: 'INFO', message: '[STEP 2/2] POST /api/v1/auth/guest-upgrade -> 200 OK (36ms)' },
      { time: '14:20:15.050', level: 'SUCCESS', message: '[AUTH] 匿名资产合并至正式账号成功，Token TTL: 7200s' },
      { time: '14:20:15.052', level: 'SUCCESS', message: '[SUMMARY] 场景 CL-AUTH-02 成功通过 (64ms)' }
    ]
  },
  {
    id: 'sc-5',
    code: 'CL-VIP-05',
    title: '会员权益并发扣减防重幂等测试',
    category: '高并发风控',
    tag: '并发压测',
    status: 'FAILED',
    statusCode: 409,
    duration: 320,
    stepsCount: 5,
    passedStepsCount: 3,
    updatedAt: '14:15:00',
    description: '通过模拟同一用户在毫秒级内发起 10 笔短剧集数解锁请求，检验分布式锁版本号防超扣机制及最终余额对账。',
    author: 'QA_Charlie',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/drama/unlock-episode/batch" \\
  -H "X-Concurrent-Count: 10" \\
  -d '{"userId":"uid_whale_9082","episodeIds":[101,102,103,104,105],"costPerEpisode":20}'`,
    steps: [
      {
        id: 'step-5-1',
        name: '初始化测试账户金币余额 (100金币)',
        method: 'POST',
        endpoint: '/api/v1/mock/wallet/set-balance',
        status: 200,
        statusText: 'OK',
        duration: 18,
        timestamp: '14:14:59.800',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { userId: 'uid_whale_9082', coins: 100 },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, balance: 100 },
        assertions: [{ rule: 'balance == 100', expected: '100', actual: '100', passed: true }]
      },
      {
        id: 'step-5-2',
        name: '并发发起 10 线程重复扣减请求',
        method: 'POST',
        endpoint: '/api/v1/drama/unlock-episode/concurrent',
        status: 200,
        statusText: 'OK',
        duration: 120,
        timestamp: '14:14:59.920',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { threadCount: 10, episodeId: 101 },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { totalRequests: 10, accepted: 1, rejectedByLock: 9 },
        assertions: [{ rule: 'accepted == 1', expected: '1', actual: '1', passed: true }]
      },
      {
        id: 'step-5-3',
        name: '校验最终账户金币余额应为 80',
        method: 'GET',
        endpoint: '/api/v1/wallet/balance?userId=uid_whale_9082',
        status: 200,
        statusText: 'OK',
        duration: 22,
        timestamp: '14:14:59.945',
        isSuccess: true,
        requestHeaders: {},
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, balance: 80 },
        assertions: [{ rule: 'balance == 80', expected: '80', actual: '80', passed: true }]
      },
      {
        id: 'step-5-4',
        name: '验证流水记录幂等对账单完整性',
        method: 'GET',
        endpoint: '/api/v1/wallet/ledger/audit?userId=uid_whale_9082',
        status: 409,
        statusText: 'Conflict',
        duration: 160,
        timestamp: '14:15:00.105',
        isSuccess: false,
        requestHeaders: {},
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: {
          code: 40902,
          error: 'Ledger Audit Conflict: Found duplicate trace sequence in MySQL shard-02'
        },
        assertions: [
          { rule: 'http.status == 200', expected: '200', actual: '409', passed: false },
          { rule: 'body.data.duplicateCount == 0', expected: '0', actual: '1 (Trace duplicate)', passed: false }
        ]
      },
      {
        id: 'step-5-5',
        name: '生成并发压测合规报告',
        method: 'POST',
        endpoint: '/api/v1/report/concurrent-summary',
        status: 0,
        statusText: 'SKIPPED',
        duration: 0,
        timestamp: '14:15:00.110',
        isSuccess: false,
        requestHeaders: {},
        responseHeaders: {},
        responseBody: { msg: '前置断言失败熔断' },
        assertions: [{ rule: 'passed == true', expected: 'true', actual: 'SKIPPED', passed: false }]
      }
    ],
    logs: [
      { time: '14:14:59.780', level: 'INFO', message: '[INIT] 场景 CL-VIP-05 并发压测引擎启动' },
      { time: '14:14:59.800', level: 'INFO', message: '[STEP 1/5] 初始化测试账户余额 -> 100 金币' },
      { time: '14:14:59.920', level: 'INFO', message: '[STEP 2/5] 触发 10 线程并发扣费: 成功 1 次, 分布式锁拦截 9 次' },
      { time: '14:14:59.945', level: 'INFO', message: '[STEP 3/5] 账户余额查询为 80 金币 (符合预期扣除 20 金币)' },
      { time: '14:15:00.105', level: 'ERROR', message: '[STEP 4/5] GET /api/v1/wallet/ledger/audit -> 409 Conflict (160ms)' },
      { time: '14:15:00.106', level: 'ERROR', message: '[ASSERT FAILED] 期望流水无重，但分库 shard-02 写入了重复 trace 记录' },
      { time: '14:15:00.110', level: 'WARN', message: '[SUMMARY] 场景 CL-VIP-05 未通过 (3/5 步骤完成)' }
    ]
  },
  {
    id: 'sc-6',
    code: 'CL-NOTIF-01',
    title: '短剧更新多渠道模板消息触达',
    category: '消息中心',
    tag: '异步消息',
    status: 'SUCCESS',
    statusCode: 200,
    duration: 95,
    stepsCount: 2,
    passedStepsCount: 2,
    updatedAt: '14:02:10',
    description: '验证当关注短剧更新第 12 集时，服务端自动渲染模板并批量下发 APNs 与客户端站内信红点广播。',
    author: 'QA_Alice',
    environment: 'TEST-01 (预发沙箱)',
    curl: `curl -X POST "https://api-test.jumeng.internal/v1/notification/drama-update" \\
  -d '{"dramaId":"dr_whale_love_99","newEpisode":12,"pushChannels":["APNS","IN_APP_BANNER"]}'`,
    steps: [
      {
        id: 'step-6-1',
        name: '渲染多语言通知模板内容',
        method: 'POST',
        endpoint: '/api/v1/template/render',
        status: 200,
        statusText: 'OK',
        duration: 35,
        timestamp: '14:02:10.020',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { templateId: 'tpl_drama_ep_update', params: { title: '鲸鱼娘的奇幻咖啡馆', ep: 12 } },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, text: '《鲸鱼娘的奇幻咖啡馆》第 12 集已上线，快来观看吧！' },
        assertions: [{ rule: 'http.status == 200', expected: '200', actual: '200', passed: true }]
      },
      {
        id: 'step-6-2',
        name: '下发 Push 网关并获取投递回执',
        method: 'POST',
        endpoint: '/api/v1/push/dispatch',
        status: 200,
        statusText: 'OK',
        duration: 60,
        timestamp: '14:02:10.080',
        isSuccess: true,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: { targetUid: 'uid_whale_9082', channel: 'APNS' },
        responseHeaders: { 'content-type': 'application/json' },
        responseBody: { code: 0, data: { msgId: 'msg_982103', delivered: true } },
        assertions: [{ rule: 'body.data.delivered == true', expected: 'true', actual: 'true', passed: true }]
      }
    ],
    logs: [
      { time: '14:02:10.001', level: 'INFO', message: '[INIT] 场景 CL-NOTIF-01 消息触达自动化测试启动' },
      { time: '14:02:10.020', level: 'INFO', message: '[STEP 1/2] POST /api/v1/template/render -> 200 OK (35ms)' },
      { time: '14:02:10.080', level: 'INFO', message: '[STEP 2/2] POST /api/v1/push/dispatch -> 200 OK (60ms)' },
      { time: '14:02:10.095', level: 'SUCCESS', message: '[SUMMARY] 场景 CL-NOTIF-01 验证完成! (95ms)' }
    ]
  }
]
