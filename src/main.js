const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`服务已启动，端口${port}`)
})

app.get('/', (req, res) => {
  res.send('hello')
})

const data = [
  {
    id: 1,
    title: '关山月',
    content: '明月出天山，苍茫云海间',
  },
  {
    id: 2,
    title: '望岳',
    content: '会当凌绝顶，一览众山小',
  },
  {
    id: 3,
    title: '忆江南',
    content: '日出江花红胜火，春来江水绿如蓝',
  },
]

app.get('/posts', (req, res) => {
  res.send(data)
})

app.get('/posts/:postId', (req, res) => {
  const { postId } = req.params

  const item = data.find((item) => item.id == postId)

  res.send(item)
})
