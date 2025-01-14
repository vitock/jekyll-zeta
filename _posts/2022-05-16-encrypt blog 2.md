---
layout: post
title: "encrypt blog 2:12345 or abcd"
date: "2024-09-14 19:00:58"
categories: 
 - blog 
mathjax: false 
key: '333' 
tags:
 - encrypt1
 - encryp_abcd
 - blog
 - jekyll-zeta
---

```

enc_tags:
    - tag: encrypt1
      password: "123"  # plain text ,not recommed

      # do Not write you public or privatekey in your repo,
      # use ltectool g to generate a new one for your own blog
      # publickey: Aos74Reqw/veNVVdCJJ8v8uTUx178mJIw1kjHjDtZ561
      # privatekey: L28e3HZofHGGIr3ZZTIPhtfBfTbvxedNYF1xpJdx5PA=
    - tag: encrypt2
      # 123
      password: AQAQACAAIQCvWkhJdhn0b21Pz381AdTeMLb5bRO4d2F3usQtpIL0fDD0G8cg4klENXxJNX+rAHwD8VW2iJo4hZKDQrjdOjbJFugo60XnMmbdLEfzXpkqGpjjbe875/owWyNnGGPk3Vf4
    
```

in your `_config.yml` file 
add tag you need to encrypt .


password could be plain text or encrypt by ECC  using ltectool,

```
ltectool g 
publickey: AkdG8hrtRhGkG95TrSwZ6WJDh8EfG7MJUMcM72sxhb5z
privatekey: 6xzP8FiwYNoGbtAZnkAUhGOwukxlnPBREEahuARmdOE=

ltectool e
```

# encrypt a password
```
ltectool e publickye passowrd
ltectool e AkdG8hrtRhGkG95TrSwZ6WJDh8EfG7MJUMcM72sxhb5z abc

you get 
AQAQACAAIQDCo+5Huibeu8sRDVULXrV4o5N9h1Cw8u4o7Vy7gIqXHYsQOeLQDlRI4QAKIbhfUpcCI8iL7daII0Krk0PpRi9TaIQxhC/aOnwZxKZ1MwsV9XbVg1/+aCyF5HAxxodWl5oZ

// decrypt 
ltectool d 6xzP8FiwYNoGbtAZnkAUhGOwukxlnPBREEahuARmdOE= AQAQACAAIQDCo+5Huibeu8sRDVULXrV4o5N9h1Cw8u4o7Vy7gIqXHYsQOeLQDlRI4QAKIbhfUpcCI8iL7daII0Krk0PpRi9TaIQxhC/aOnwZxKZ1MwsV9XbVg1/+aCyF5HAxxodWl5oZ

>> abc

```




