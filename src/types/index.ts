// 联系人
export interface ContactUser {
  id: number
  userId: number
  dscUserId: number
  salesmanId: number
  isBan: number // 0-正常 1-被封
  dscUserName?: string
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
}

// text-文本 link-链接 media-图片
export type MsgType = 'text' | 'link' | 'media'
