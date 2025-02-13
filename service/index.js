// 使用express 给前端提供一个接口
const express = require('express')
const { Ollama }  = require('@langchain/community/llms/ollama');
const app = express()
const port = 3000
// 接口允许跨域 cros
const cors = require('cors');
app.use(cors());

const ollama = new Ollama({
  baseUrl: 'http://127.0.0.1:11434',
  model: 'deepseek-r1:1.5b'
})

// 这个接口 接受一个字符串
app.get('/chat', async(req, res) => {
  try {
    // 获取字符串
    const { keyword } = req.query
    console.log(keyword);
    if(!keyword) return res.status(400).send({ message: '请输入关键词' })
    // 调用函数
    const stream = await ollama.stream(keyword)
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    res.status(200).send(JSON.stringify(chunks))
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
