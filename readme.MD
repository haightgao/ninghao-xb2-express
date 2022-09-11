# 宁皓服务端应用开发实践 - express

## 生成密钥与公钥

```
cd config
opensll
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```

## 转换密钥与公钥格式

```
node config/convert.key.js
```

你会看到转换成 Base64 格式的 Private Key 与 Public Key，把得到的内容交给 .env 文件里的 PRIVATE_KEY 与 PUBLIC_KEY。