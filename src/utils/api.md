
http://localhost:8081/ttqk/channel/getExpression?token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
取表情
{
  "code": 0,
  "msg": "成功",
  "data": "😃🤠🥵🦻👉👤👳‍♂️🙎‍♀️💗"
}



http://localhost:8081/ttqk/channel/saveExpression?expression=%F0%9F%98%83%F0%9F%A4%A0%F0%9F%A5%B5%F0%9F%A6%BB%F0%9F%91%89%F0%9F%91%A4%F0%9F%91%B3%E2%80%8D%E2%99%82%EF%B8%8F%F0%9F%99%8E%E2%80%8D%E2%99%80%EF%B8%8F%F0%9F%92%97&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
保存表情

{
  "code": 0,
  "msg": "成功",
  "data": "保存成功"
}


http://localhost:8081/ttqk/channel/getContactList?pageNo=1&pageSize=11&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
取联系人列表




http://localhost:8081/ttqk/channel/getMsgCommonlyList?token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
取常用回复
	
Response body
 
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "msg": "你好",
      "tag": "打招呼",
      "salesmanId": 1,
      "isDelete": 0
    },
    {
      "id": 2,
      "msg": "吃饭了吗",
      "tag": "打招呼",
      "salesmanId": 1,
      "isDelete": 0
    }
  ]
}






http://localhost:8081/ttqk/channel/saveMsgCommonly?msg=%E4%BD%A0%E5%A5%BD&tag=%E6%89%93%E6%8B%9B%E5%91%BC&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
保存常用回复




http://localhost:8081/ttqk/channel/saveRemark?dscUserId=16&remark=%E7%AC%AC%E4%B8%80%E6%AC%A1%E5%A4%87%E6%B3%A8&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
保存备注



http://localhost:8081/ttqk/channel/getMsgList?dscUserId=16&pageNo=1&pageSize=11&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
获取聊天记录	
Response body

{
  "code": 0,
  "msg": "成功",
  "data": {
    "totalNum": 2,
    "list": [
      {
        "id": 1,
        "dscUserId": 16,
        "salesmanId": 1,
        "direction": 0,
        "msg": "你好",
        "msgCn": "你好",
        "img": null,
        "sound": null,
        "sendTime": 1626147572000,
        "status": 2
      },
      {
        "id": 2,
        "dscUserId": 16,
        "salesmanId": 1,
        "direction": 1,
        "msg": null,
        "msgCn": "你好呀",
        "img": null,
        "sound": null,
        "sendTime": 1626147572000,
        "status": 2
      }
    ]
  }




http://localhost:8081/ttqk/channel/login?name=user1&pwd=123456
登录



http://localhost:8081/ttqk/channel/sendMsg?dscUserId=16&msgCn=%E4%BD%A0%E5%A5%BD&token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
发送消息


http://localhost:8081/ttqk/channel/getNewMsgList?token=644463c0-8d98-44ec-a699-c3f5fc5ce06a
取所有新消息

	
Response body
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 4,
      "dscUserId": 16,
      "salesmanId": 1,
      "direction": 1,
      "msg": null,
      "msgCn": "还没到",
      "img": null,
      "sound": null,
      "sendTime": 1626148914000,
      "status": 0
    }
  ]
}
