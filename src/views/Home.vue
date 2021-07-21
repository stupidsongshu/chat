<template>
  <div class="page page-home">
    <el-container class="page-container">
      <el-aside class="page-aside" width="330px">
        <ContactList ref="contactList" :user.sync="selectedContactUser" />
      </el-aside>
      <el-main class="page-main">
        <el-header class="page-header">
          <ContactUserHeader :user="selectedContactUser" @saveRemark="saveRemark"></ContactUserHeader>
        </el-header>
        <el-main class="chat-main">
          <ContactUserMain ref="contactUserMain" :user="selectedContactUser"></ContactUserMain>
        </el-main>
        <el-footer class="page-footer" style="height: 200px;">
          <ChatEdit :user="selectedContactUser" @sendMsg="sendMsg"></ChatEdit>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'

import ContactList from './component/contact-list.vue'
import ContactUserHeader from './component/contact-user-header.vue'
import ContactUserMain from './component/contact-user-main.vue'
import ChatEdit from './component/chat-edit.vue'

import { ContactUser } from '@/types'

@Component({
  components: {
    ContactList,
    ContactUserHeader,
    ContactUserMain,
    ChatEdit
  },
})
export default class Home extends Vue {
  selectedContactUser: ContactUser = {} as ContactUser

  @Ref() readonly contactList!: ContactList
  @Ref() readonly contactUserMain!: ContactUserMain

  saveRemark (): void {
    this.contactList.doGetContactList()
  }

  sendMsg (): void {
    this.contactUserMain.doGetMsgList()
  }
}
</script>

<style scoped>
.page-home {
  /* flex: 1; */
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 200px; /* TODO */
}
.page-container {
  position: relative;
  border: 1px solid #ddd;
}
.page-aside {
  /* height: 100vh; */
  border-right: 1px solid #ddd;
}
/* .page-header {
  display: flex;
  align-items: center;
} */
.page-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  /* padding-top: 60px;
  padding-bottom: 200px; */
}
.chat-main {
  height: calc(100vh - 260px);
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.page-footer {
  height: 100px;
}

@media screen and (max-width: 480px) {
  .page-aside {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #fff;
  }
}
</style>
