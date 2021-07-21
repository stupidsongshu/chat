// 联系人
export interface ContactUser {
  appType: number
  dscUserId: number
  dscUserName: string
  lang?: string
  lastMsg: string
  lastTime: number
  msgCou: number
  remark?: string
  salesmanId: number
  tag: string
  userId: number
  newMsgCount: number // 新消息数
}

// 聊天消息
export interface Msg {
  id: number
  userId?: number
  dscUserId: number
  direction: number // 0-我方发送 1-粉丝发送
  type?: MsgType
  msg?: string
  msgCn?: string
  url?: string
  linkMsg?: string // type为link时有值
  sendTime?: number
  itemId?: number
  salesmanId: number
  status: number
}

// text-文本 link-链接 media-图片
export type MsgType = 'text' | 'link' | 'media'
