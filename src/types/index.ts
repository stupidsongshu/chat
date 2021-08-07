// 联系人
export interface ContactUser {
  id: number
  userId: number
  dscUserId: number
  salesmanId: number
  isBan: number // 0-正常 1-被封
  dscUserName?: string
  img?: string // 头像地址
  appType: number
  lang?: string
  lastMsg: string
  lastTime: number
  msgCou: number // 新消息数
  remark?: string
  tag: string
}

// 聊天消息
export interface Msg {
  id?: number
  userId: number
  dscUserId: number
  action: string // 类型：sendMsg-发送消息
  direction: number // 0-我方发送 1-粉丝发送
  type: MsgType
  msg?: string
  msgCn?: string
  url?: string
  linkMsg?: string // type为link时有值
  sendTime?: number
  itemId?: number
  salesmanId?: number
  status: number
  expand?: boolean // msgCn msg 同时存在时，默认显示 msgCn，可展开显示 msg
}

// 账号
export interface Account {
  account: string
  action: number
  actionTime: string
  biography: string
  bringUpTime: number
  bringUpTimeFinish: number
  bringUpTimeJg: number
  bringUpTimeNeed: number
  bringUpTimeSleep: number
  buok: number
  createBy: number
  createTime: string
  edgeFollow: number
  edgeFollowedBy: number
  firstName: string
  groupId: number
  headImg: string
  id: number
  ipId: number
  isBu: number
  isBuing: number
  isCrawl: number
  isOpen: number
  openTime:string
  password: string
  postTime: string
  queryTime: string
  runTaskTime: number
  runTime: string
  sendTime: string
  status: number
  uId: number
  userId: number
  webUrl: string
}

// text-文本 link-链接 media-图片
export type MsgType = 'text' | 'link' | 'media'
