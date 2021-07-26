import http from './http'

export const login = async (name: string, pwd: string): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/login',
    params: { name, pwd }
  })
  return [err, res]
}

// 取表情
export const getExpression = async (): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/getExpression',
    params: {}
  })
  return [err, res]
}

// 保存表情
export const saveExpression = async (expression: string): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/saveExpression',
    params: { expression }
  })
  return [err, res]
}

// 取联系人列表
export const getContactList = async (pageNo = 1, pageSize = 10): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/getContactList',
    params: { pageNo, pageSize }
  })
  return [err, res]
}

// 取常用回复
export const getMsgCommonlyList = async (): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/getMsgCommonlyList',
    params: {}
  })
  return [err, res]
}

// 保存常用回复
export const saveMsgCommonly = async (msg: string): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/saveMsgCommonly',
    params: { msg }
  })
  return [err, res]
}

// 保存备注
export const saveRemark = async (dscUserId: number, remark: string): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/saveRemark',
    params: { dscUserId, remark }
  })
  return [err, res]
}

// 获取聊天记录
export const getMsgList = async (userId: number, dscUserId: number, pageNo = 1, pageSize = 10): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/getMsgList',
    params: { userId, dscUserId, pageNo, pageSize }
  })
  return [err, res]
}

/**
 * @description 发送消息
 * @param {number} userId 
 * @param {number} dscUserId 
 * @param {string} type text-纯文字，link-带URL，media-图片
 * @param {string} msgCn type=text||link时有值
 * @param {string} url type=link||media时有值
 * @param {string} action 类型：sendMsg-发送消息
 * @param {number} direction 0-我方发送 1-粉丝发送
 * @param {number} status 0-未发生 1-正在发生 2-发送成功
 * @returns 
 */
// export const sendMsg = async (userId: number, dscUserId: number, type: string, msgCn?: string, url?: string): Promise<any[]> => {
//   const [err, res] = await http({
//     url: '/ttqk/channel/sendMsg',
//     params: { action: 'sendMsg', direction: 0, status: 0, userId, dscUserId, type, msgCn, url }
//   })
//   return [err, res]
// }

// 取所有新消息
export const getNewMsgList = async (): Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/channel/getNewMsgList',
    params: {}
  })
  return [err, res]
}

// 上传图片
export const uploadImg = async (formData: FormData):Promise<any[]> => {
  const [err, res] = await http({
    url: '/ttqk/tw/uploadImg',
    params: formData,
    options: {
      type: 'upload',
      header: {
        'Content-Type': 'multipart/form-data'
      }
    }
  })
  return [err, res]
}
