---
layout: post
title: 加密的Post，密码:abc   
date: "2022-05-16 18:55:32"
categories: 
 - blog 
mathjax: false 
# key: abc
key: AQAQACAAIQACBNyjtxGA+C16+AaWy/qrbSuHbJSdnCSpr/22nuTkBKZDLh60SFFcJxGGt+U4d+UCnfzag3HByuvKg1cHK7JyfB6K6cja/CEOkBvDHCJbrQaUQkRYU3a5oIHeiYLGydbF
tags:
 - blog
 - jekyll-zeta
---
# 密码设置格式

密码有两种设置格式
1. 明文 
   
2. 通过椭圆曲线`Secp256k1`将 密码加密，防止泄露（推荐）
   ```
   AQAQACAAIQB41M9NIibnw864akkTI6TruWKhcqrfrlXhdd3JXWSaSVUaBXtYIUVyPhGWClXKoPUDfYg0X6ahzGH/PVPKqjqlXwWvGj0pddWuY3WxxSnYmYNFkBUbCAO3dKZum+sMc3oA
   ```
> 即使你的post被公开，那么你的密码也不会泄露


# 密码设置方法

1. 通过tag配置统一配置  
    在 _config 文件中设置，
    那么，所有encrypt1用 12345 加密， encrypt2用123加密
``` 
enc_tags:

    - tag: encrypt1
      password: "12345"  # plain text ,not recommed

      # do Not write you public or privatekey in your repo,
      # use ltectool g to generate a new one for your own blog
      # publickey: Aos74Reqw/veNVVdCJJ8v8uTUx178mJIw1kjHjDtZ561
      # privatekey: L28e3HZofHGGIr3ZZTIPhtfBfTbvxedNYF1xpJdx5PA=
    - tag: encrypt2
      # 123
      password: AQAQACAAIQCvWkhJdhn0b21Pz381AdTeMLb5bRO4d2F3usQtpIL0fDD0G8cg4klENXxJNX+rAHwD8VW2iJo4hZKDQrjdOjbJFugo60XnMmbdLEfzXpkqGpjjbe875/owWyNnGGPk3Vf4
```

2. 在markdown文件头中设置，
```
---
layout: post
title: "encrypted blog:123"
date: "2022-05-16 18:55:32"
categories: 
 - blog 
mathjax: false 
key: AQAQACAAIQB41M9NIibnw864akkTI6TruWKhcqrfrlXhdd3JXWSaSVUaBXtYIUVyPhGWClXKoPUDfYg0X6ahzGH/PVPKqjqlXwWvGj0pddWuY3WxxSnYmYNFkBUbCAO3dKZum+sMc3oA
tags:
 - 流水账
 - blog
---
```