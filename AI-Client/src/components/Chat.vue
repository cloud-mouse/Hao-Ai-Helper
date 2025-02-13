<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import request from '../utils/request'
import { ElLoading } from 'element-plus'

const keyword = ref('')
const messageList = ref([]) // 请求消息列表
const isLoading = ref(false)
const currentInfo = ref(null)
const isAxiosError = ref(false)

const handleSend = () => {
  if (isLoading.value) return
  isLoading.value = true
  isAxiosError.value = false
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.7)',
  })
  request
    .get('/chat', {
      params: {
        keyword: keyword.value,
      },
    })
    .then((res) => {
      isLoading.value = false
      loading.close()
      currentInfo.value && messageList.value.push(currentInfo.value)
      currentInfo.value = {
        questions: keyword.value,
        answers: res,
      }
      typeWriter('typewriter', res, 150)
    })
    .catch(() => {
      loading.close()
      isAxiosError.value = true
      isLoading.value = false
    })
}
// 打字机效果
function typeWriter(elementId, texts, speed = 100) {
  const el = document.getElementById(elementId)
  el.innerHTML = ''
  let index = 0
  function type() {
    const currentText = texts[index]
    el.innerHTML += currentText
    index++
    if (index < texts.length) {
      setTimeout(type, speed)
    }
  }
  type()
}
onMounted(() => {
  messageList.value = JSON.parse(localStorage.getItem('messageList')) || []
})
onBeforeUnmount(() => {
  localStorage.setItem('messageList', JSON.stringify(messageList.value))
})
</script>

<template>
  <div class="chat-box">
    <h1>欢迎使用</h1>
    <div class="chat-message">
      <div v-for="(item, index) in messageList" :key="index" class="history">
        <p>问题：{{ item.questions }}</p>
        <p>回答：{{ item.answers?.join('') }}</p>
      </div>
      <div v-if="currentInfo" class="current">
        <p>问题：{{ currentInfo.questions }}</p>
        <p>回答：</p>
        <p id="typewriter" class="typewriter"></p>
        <p v-if="isAxiosError">请求失败，请重试</p>
      </div>
    </div>

    <div class="footer">
      <el-input
        v-model="keyword"
        style="max-width: 500px; margin: 0 auto"
        max-length="200"
        show-word-limit
        size="large"
        placeholder="请输入关键词"
        @keward.enter="handleSend"
      >
        <template #append>
          <el-button @click="handleSend">发送</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style>
.chat-box {
  position: relative;
  height: 80vh;
  width: 800px;
  margin: 0 auto;
  text-align: center;
  box-sizing: border-box;
  color: #fff;
}
.chat-message {
  height: calc(80vh - 180px);
  overflow-y: auto;
  text-align: left;
}
.history {
  background: #fff;
  color: #333;
  margin-bottom: 12px;
  border-radius: 16px;
  padding: 16px;
}
.current {
  border: 1px solid #fff;
  border-radius: 16px;
  padding: 16px;
}
h1 {
  padding: 20px;
}
p {
  margin-bottom: 24px;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px;
}
</style>
