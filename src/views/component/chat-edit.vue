<template>
  <div class="chat-edit">
    <ul class="chat-tools">
      <li class="chat-tool">
        <el-popover
          width="430"
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
            <span class="emoji-item" v-for="(item, index) in expressionList" :key="index" @click="insertMsg(item)">
              {{item}}
            </span>
          </div>
          <div>
            <el-input v-model="expression" placeholder="请输入表情" style="width:110px;margin-right:10px;"></el-input>
            <el-link type="primary" :underline="false" @click="doSaveExpression"><i class="el-icon-edit"></i>添加</el-link>
          </div>
          <el-link slot="reference" style="font-size: 20px; font-weight: bold" :underline="false" @click="doGetExpression">
            <!-- <i class="el-icon-user"></i> -->
            <!-- <span style="font-size:20px;">😊</span> -->
            <i class="iconfont icon-Smile"></i>
          </el-link>
        </el-popover>
      </li>
      <li class="chat-tool">
        <el-popover
          width="300"
          placement="top"
          trigger="click">
          <el-link class="msg-commonly" :underline="false" v-for="item in msgCommonlyList" :key="item.id" @click="insertMsg(item.msg)">{{item.msg}}</el-link>
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
        :disabled="disabled"
        :loading="loading"
        @click="send('text', msg)">
        发送
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { ContactUser, Msg, MsgType } from '@/types'
import { getExpression, saveExpression, getMsgCommonlyList, uploadImg } from '@/utils/api'
import { urlRegExp } from '@/utils'

@Component
export default class ChatEdit extends Vue {
  loading = false
  msg = '' // 发送内容
  expression = '' // 自定义表情
  expressionList = [] // 表情列表
  // expressionList = ['😔', '😁', '😉', '😱', '😖', '😚', '😝', '😌', '😨', '😷', '😳', '😒', '😰', '😲', '😭', '😜', '😘', '😡', '💪', '👊', '👍', '☝', '👏', '✌', '👎', '🙏', '👌', '👈', '👉', '👆', '👇', '👀', '👃', '👄', '👂', '🍚', '🍝', '🍜', '🍙', '🍧', '🍣', '🎂', '🍞', '🍔', '🍳', '🍟', '🍺', '🍻', '🍸', '☕', '🍎', '🍊', '🍓', '🍉', '💊', '🚬', '🎄', '🌹', '🎉', '🌴', '💝', '🎀', '🎈', '🐚', '💍', '💣', '👑', '🔔', '⭐', '✨', '💨', '💦', '🔥', '🏆', '💰', '💤', '⚡', '👣', '💩', '💉', '♨', '📫', '🔑', '🔒', '✈', '🚄', '🚗', '🚤', '🚲', '🐎', '🚀', '🚌', '⛵', '👩', '👨', '👧', '👦', '🐵', '🐙', '🐷', '🐤', '🐨', '🐮', '🐔', '🐸', '👻', '💀', '🐛', '🐠', '🐶', '🐯', '👼', '🐧', '🐳', '🐭', '👒', '👗', '💄', '👠', '👢', '🌂', '👜', '👙', '👕', '👟', '☁', '☀', '☔', '🌙', '⛄', '⭕', '❌', '❔', '❕', '☎', '📷', '📱', '📠', '💻', '🎥', '🎤', '🔫', '💿', '💓', '♣', '🀄', '〽', '🎰', '🚥', '🚧', '🎸', '💈', '🛀', '🚽', '🏠', '⛪', '🏦', '🏥', '🏨', '🏧', '🏪', '🚹', '🚺']
  msgCommonlyList = [] // 常用回复

  @Prop() readonly user!: ContactUser

  @Ref() readonly textareaRef!: HTMLTextAreaElement

  get disabled (): boolean {
    return !(this.user.dscUserId && this.msg.trim())
  }
  get canSendMsg (): boolean {
    return this.user.isBan === 0 && !!this.user.dscUserName
  }

  insertMsg (data: string): void {
    console.log('insertMsg:', data)
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

  // handleInput($event): void {
  //   console.log($event.target.innerHTML)
  //   this.msg = ($event.target as HTMLInputElement).innerHTML
  // }

  // https://stackoverflow.com/questions/34982381/how-to-insert-at-caret-position-of-contenteditable-using-typescript
  // insertNodeAtCaret (node): void {
  //     const doc = document as any;

  //     var sel, range, html;

  //     function containerIsEditable(selection) {
  //         return $(selection.anchorNode).parent().hasClass("editable");
  //     }

  //     if (window.getSelection) {
  //         sel = window.getSelection();
  //         // only if it is a caret otherwise it inserts
  //         // anywhere!
  //         if (containerIsEditable(sel) && sel.getRangeAt
  //             && sel.rangeCount) {
  //             var previousPosition = sel.getRangeAt(0).startOffset;
  //             sel.getRangeAt(0).insertNode(node);
  //         }
  //     }
  //     else if (doc.selection
  //         && doc.selection.createRange) {
  //         range = doc.selection.createRange();
  //         html = (node.nodeType == 3) ? node.data
  //             : node.outerHTML;
  //         range.pasteHTML(html);
  //     }
  // }

  dragover (e: DragEvent): void {
    e.preventDefault()
  }
  drop (e: DragEvent): void {
    e.preventDefault()
    const files = e.dataTransfer?.files || []
    const file = files[0]
    this.sendImage(file)
  }

  async doGetExpression (): Promise<void> {
    const [err, res] = await getExpression()
    if (err) return
    const { data } = res
    if (!data) return
    this.expressionList = data
  }

  async doSaveExpression (): Promise<void> {
    const expression = this.expression.trim()
    if (!expression) {
      this.$message({
        message: '请输入表情',
        type: 'warning'
      })
      return
    }
    const [err, res] = await saveExpression(expression)
    if (err) return
    if (!res) return
    this.doGetExpression()
  }

  async doGetMsgCommonlyList (): Promise<void> {
    const [err, res] = await getMsgCommonlyList()
    if (err) return
    const { data } = res
    if (!data) return
    this.msgCommonlyList = data
  }

  async send (type: MsgType, data: string): Promise<void> {
    if (!this.canSendMsg) {
      // this.$message({
      //   message: '账号异常',
      //   type: 'error'
      // })
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

  async sendImage (file: File): Promise<void> {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const [err, res] = await uploadImg(formData)
    if (err) return
    const { data } = res
    if (!data) return
    this.send('media', data)
  }
}
</script>

<style scoped>
/* .emoji-list {

} */
.emoji-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.emoji-item:hover {
  background-color: #f2f2f2;
}
.emoji {
  /* display: inline-block;
  width: 25px;
  height: 25px; */
  font-size: 25px;
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
.msg-commonly {
  display: block;
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

<style>
/* .chat-input textarea {
  border: none;
} */
</style>
