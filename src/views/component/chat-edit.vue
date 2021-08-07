<template>
  <div class="chat-edit">
    <ul class="chat-tools">
      <li class="chat-tool">
        <el-popover
          ref="emoji-popover"
          width="300"
          placement="top"
          trigger="click">
          <!-- <ul class="emoji-list">
            <li class="emoji-item" v-for="(item, index) in expressionList" :key="index" @click="insertMsg(item)">
              <span class="emoji">{{item}}</span>
            </li>
            <li class="emoji-item">
              <span class="emoji">😔</span>
            </li>
          </ul> -->
          <div class="emoji-list">
            <div class="emoji-item" v-for="(item, index) in expressionList" :key="index" @click="insertMsg(item)">
              <span>{{item}}</span>
              <el-popconfirm title="确定删除？" icon-color="red" confirm-button-type="warning" @confirm="toolSave('emoji', 'delete', index)">
                <span slot="reference" class="icon-btn-delete el-icon-circle-close" @click="$event => $event.stopPropagation()"></span>
              </el-popconfirm>
            </div>
          </div>
          <div class="custom-item">
            <el-input v-model="expression" clearable placeholder="请输入表情" style="width: 150px;"></el-input>
            <el-link style="margin-left: 10px;" type="primary" :underline="false" @click="toolSave('emoji', 'insert')"><i class="el-icon-plus"></i>添加</el-link>
          </div>
          <el-link slot="reference" style="font-size: 20px; font-weight: bold" :underline="false" @click="doGetExpression">
            <i class="iconfont icon-Smile"></i>
          </el-link>
        </el-popover>
      </li>
      <li class="chat-tool">
        <el-popover
          ref="msg-commonly-popover"
          width="300"
          placement="top"
          trigger="click">
          <div class="msg-commonly-item" :underline="false" v-for="(item, index) in msgCommonlyList" :key="item.id" @click="insertMsg(item.msg)">
            <el-link :underline="false">{{item.msg}}</el-link>
            <el-popconfirm title="确定删除？" icon-color="red" confirm-button-type="warning" @confirm="toolSave('msgCommonly', 'delete', index)">
              <span slot="reference" class="icon-btn-delete el-icon-circle-close" @click="$event => $event.stopPropagation()"></span>
            </el-popconfirm>
          </div>
          <div class="custom-item">
            <el-input v-model="msgCommonly" clearable placeholder="请输入常用回复" style="width:150px;margin-right:10px;"></el-input>
            <el-link type="primary" :underline="false" @click="toolSave('msgCommonly', 'insert')">
              <i class="el-icon-plus"></i>添加
            </el-link>
          </div>
          <el-link slot="reference" style="font-size: 20px;" :underline="false" @click="doGetMsgCommonlyList">
            <i class="el-icon-chat-line-square"></i>
          </el-link>
        </el-popover>
      </li>
    </ul>

    <textarea
      class="chat-input"
      ref="textareaRef"
      v-model="msg"
      @dragover="dragover"
      @drop="drop"
      placeholder="请输入内容或拖拽图片">
    </textarea>

    <div class="chat-send">
      <el-button
        type="primary"
        size="mini"
        round
        :loading="loading"
        @click="send('text', msg)">
        发送
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { ContactUser, Msg, MsgType, MsgCommonly, ToolTypeEnum, ToolActionEnum } from '@/types'
import { uploadImg, getExpression, saveExpression, getMsgCommonlyList, saveMsgCommonly } from '@/utils/api'
import { urlRegExp, decodeUnicode } from '@/utils'

@Component
export default class ChatEdit extends Vue {
  loading = false
  msg = '' // 发送内容
  expression = '' // 自定义表情
  expressionList: string[] = [] // 表情列表
  // expressionList = ['😔', '😁', '😉', '😱', '😖', '😚', '😝', '😌', '😨', '😷', '😳', '😒', '😰', '😲', '😭', '😜', '😘', '😡', '💪', '👊', '👍', '☝', '👏', '✌', '👎', '🙏', '👌', '👈', '👉', '👆', '👇', '👀', '👃', '👄', '👂', '🍚', '🍝', '🍜', '🍙', '🍧', '🍣', '🎂', '🍞', '🍔', '🍳', '🍟', '🍺', '🍻', '🍸', '☕', '🍎', '🍊', '🍓', '🍉', '💊', '🚬', '🎄', '🌹', '🎉', '🌴', '💝', '🎀', '🎈', '🐚', '💍', '💣', '👑', '🔔', '⭐', '✨', '💨', '💦', '🔥', '🏆', '💰', '💤', '⚡', '👣', '💩', '💉', '♨', '📫', '🔑', '🔒', '✈', '🚄', '🚗', '🚤', '🚲', '🐎', '🚀', '🚌', '⛵', '👩', '👨', '👧', '👦', '🐵', '🐙', '🐷', '🐤', '🐨', '🐮', '🐔', '🐸', '👻', '💀', '🐛', '🐠', '🐶', '🐯', '👼', '🐧', '🐳', '🐭', '👒', '👗', '💄', '👠', '👢', '🌂', '👜', '👙', '👕', '👟', '☁', '☀', '☔', '🌙', '⛄', '⭕', '❌', '❔', '❕', '☎', '📷', '📱', '📠', '💻', '🎥', '🎤', '🔫', '💿', '💓', '♣', '🀄', '〽', '🎰', '🚥', '🚧', '🎸', '💈', '🛀', '🚽', '🏠', '⛪', '🏦', '🏥', '🏨', '🏧', '🏪', '🚹', '🚺']
  msgCommonlyList: MsgCommonly[] = [] // 常用回复列表
  msgCommonly = '' // 自定义常用回复

  @Prop() readonly user!: ContactUser

  @Ref() readonly textareaRef!: HTMLTextAreaElement

  get disabled (): boolean {
    return !(this.user.dscUserId && this.msg.trim())
  }
  get disableSendMsg (): boolean {
    return this.user.isBan === 1 || !this.user.dscUserName
  }

  decodeStr (str: string): string {
    return decodeUnicode(str)
  }

  // https://stackoverflow.com/questions/34982381/how-to-insert-at-caret-position-of-contenteditable-using-typescript
  insertMsg (data: string): void {
    const selectionStart = this.textareaRef.selectionStart
    const selectionEnd = this.textareaRef.selectionEnd
    // if (document.selection) {
    //   document.selection.createRange().text = data
    // } else if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
    //   this.msg = [this.msg.substring(0, selectionStart), data, this.msg.substring(selectionEnd)].join('')
    // } else {
    //   this.msg += data
    // }
    if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
      this.msg = [this.msg.substring(0, selectionStart), data, this.msg.substring(selectionEnd)].join('')
    } else {
      this.msg += data
    }
  }

  dragover (e: DragEvent): void {
    e.preventDefault()
  }
  drop (e: DragEvent): void {
    e.preventDefault()
    const files = e.dataTransfer?.files || []
    const file = files[0]
    if (!file) return
    // 校验文件格式
    const whiteList = [
      'image/jpeg',
      'image/jeg',
      'image/png',
      'image/gif',
    ]
    if (whiteList.indexOf(file.type) === -1) {
      this.$message({
        message: '请上传图片文件',
        type: 'warning'
      })
    }
    this.sendImage(file)
  }

  async send (type: MsgType, data: string): Promise<void> {
    if (this.disableSendMsg) {
      if (this.user.isBan === 1) {
        this.$message({
          message: '账号已封禁',
          type: 'error'
        })
      }
      if (!this.user.dscUserName) {
        this.$message({
          message: '没有userName',
          type: 'error'
        })
      }
      return
    }
    let msgCn = ''
    let url = ''
    if (!this.user.dscUserId) {
      this.$message({
        message: '请选择用户',
        type: 'warning'
      })
      return
    }

    if (type === 'text') {
      if (!data.trim()) {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
        return
      }
      const matchUrl = data.match(urlRegExp)
      // console.log('type=link matchUrl:', matchUrl)
      if (matchUrl && matchUrl.length) { // URL
        type = 'link'
        url = matchUrl[0]
      }
      msgCn = data
    } else if (type === 'media') {
      if (!data.trim()) {
        this.$message({
          message: '请上传图片',
          type: 'warning'
        })
        return
      }
      url = data
    } else {
      this.$message({
        message: '消息类型不正确',
        type: 'error'
      })
      return
    }

    // this.loading = true
    // await sendMsg(this.user.userId, this.user.dscUserId, type, msgCn, url)
    // this.loading = false

    const msg: Msg = {
      userId: this.user.userId,
      dscUserId: this.user.dscUserId,
      action: 'sendMsg', // 类型：sendMsg-发送消息
      direction: 0, // 0-我方发送 1-粉丝发送
      status: 0,
      type,
      msgCn,
      url
    }
    this.$emit('sendMsg', msg)

    if (type !== 'media') {
      this.msg = ''
    }
  }

  // 发送图片
  async sendImage (file: File): Promise<void> {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    this.loading = true
    const [err, res] = await uploadImg(formData)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    this.send('media', data)
  }

  // 表情
  async doGetExpression (action: string | undefined): Promise<void> {
    if (this.expressionList.length && action !== 'update') return
    const [err, res] = await getExpression()
    if (err) return
    const { data } = res
    if (!data) return
    this.expressionList = JSON.parse(data) || []
    // fix element-ui的 popover 组件位置偏移
    this.$nextTick(() => {
      (this.$refs['emoji-popover'] as any).updatePopper()
    })
  }

  async doSaveExpression (action: ToolActionEnum, index: number): Promise<void> {
    const expression = this.expression.trim()
    let list: string[] = []
    if (action === 'insert') {
      if (!expression) {
        this.$message({
          message: '请输入表情',
          type: 'warning'
        })
        return
      }
      list = [...this.expressionList, expression]
    } else if (action === 'delete') {
      this.expressionList.splice(index, 1)
      list = this.expressionList
    }
    const [err, res] = await saveExpression(JSON.stringify(list))
    if (err) return
    if (!res) return
    this.expression = ''
    this.doGetExpression('update')
  }

  // 常用回复
  async doGetMsgCommonlyList (action: string | undefined): Promise<void> {
    if (this.msgCommonlyList.length && action !== 'update') return
    const [err, res] = await getMsgCommonlyList()
    if (err) return
    const data: MsgCommonly[] = res.data
    if (!data) return
    this.msgCommonlyList = (data || []).filter(item => item.isDelete === 0).map(item => {
      item.msg = this.decodeStr(item.msg)
      return item
    })
    this.$nextTick(() => {
      (this.$refs['msg-commonly-popover'] as any).updatePopper()
    })
  }

  async doSaveMsgCommonly (action: ToolActionEnum, index: number): Promise<void> {
    let msgCommonly = ''
    let id = undefined
    let isDelete = 0

    if (action === 'insert') {
      msgCommonly = this.msgCommonly.trim()
      if (!msgCommonly) {
        this.$message({
          message: '请输入回复内容',
          type: 'warning'
        })
        return
      }
    } else if (action === 'delete') {
      const item = this.msgCommonlyList[index]
      if (!item) {
        this.$message({
          message: '该回复不存在',
          type: 'warning'
        })
        return
      }
      msgCommonly = item.msg
      id = item.id
      isDelete = 1
    }

    const [err, res] = await saveMsgCommonly(msgCommonly, id, isDelete)
    if (err) return
    if (!res) return
    this.msgCommonly = ''
    this.doGetMsgCommonlyList('update')
  }

  // 新增/删除
  toolSave (type: ToolTypeEnum, action: ToolActionEnum, index = -1): void {
    switch (type) {
      case 'emoji':
        this.doSaveExpression(action, index)
        break
      case 'msgCommonly':
        this.doSaveMsgCommonly(action, index)
        break
    }
  }
}
</script>

<style scoped>
.emoji-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 2px;
  border-radius: 5px;
  background-color: #f2f5fa;
  cursor: pointer;
}
.emoji-item:hover {
  background-color: #d8d8d8;
}
/*.emoji {*/
/*  display: inline-block;*/
/*  width: 25px;*/
/*  height: 25px;*/
/*  font-size: 25px;*/
/*}*/

.icon-btn-delete {
  position: absolute;
  left: -4px;
  top: -4px;
}
.icon-btn-delete:hover {
  color: #409EFF;
  border-color: #c6e2ff;
}

.chat-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0;
}

.chat-tools {
  display: flex;
}
.chat-tool {
  display: flex;
  align-items: center;
}
.chat-tool + .chat-tool {
  margin-left: 15px;
}
.custom-item {
  margin-top: 5px;
}
.msg-commonly-item {
  position: relative;
  display: block;
  margin: 8px 0;
  padding: 5px 10px;
  background-color: #f2f5fa;
  cursor: pointer;
}
.msg-commonly-item:hover {
  background-color: #d8d8d8;
}

.chat-input {
  display: flex;
  flex: 1;
  margin: 10px 0;
  border: none;
  outline: none;
  resize: none;
}

.chat-send {
  text-align: right;
}
</style>
