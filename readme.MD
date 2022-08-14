# 宁皓服务端应用开发实践 - express

## 生成密钥与公钥

```
cd config
opensll
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```