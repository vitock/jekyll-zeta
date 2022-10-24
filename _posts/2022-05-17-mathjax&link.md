---
layout: post
title: "公式 MathJax link"
date: "2022-05-17 08:54:22"
categories: 
 - blog 
mathjax: true 
# key: false 
tags:
 - blog
 - math
 - jekyll-zeta
---

# mathjax $E=MC^2$

$$
\begin{bmatrix}
  F_n \\ 
  F_{n-1}
\end{bmatrix}
= A \begin{bmatrix}
  F_{n-1} \\ 
  F_{n-2}
\end{bmatrix}
$$




# `link` to other `blog`
{%post_link encrypt blog 2:12345 %}

{%post_link BlogNotExist %}


```
{% raw %}
{%post_link encrypt blog 2:12345   %}
{% endraw %}
```
# image
```
{% raw %}
{% asset_img nahan.png %}
{% endraw %}
```
{% asset_img nahan.png %}


 
 ``` javascript
例子，取两个素数， 5 和 11 ，计算  
n = 5 * 11 = 55$
y(n)= (5-1)(11 -1) =  40

随机取一数,私钥 e = 3 
根据 ed   = 1 mod n  得到
d = 27

已知消息为 7 , 

加密: 7 ^ 3 mod  55 = 13

13 ^ 27 = ((13 )^ 3 ) ^ 9 = (52 ^ 3) ^ 3 = 28 ^ 3 = 7 mod 55

消息为 22
加密:22 ^ 3 = 33 mod 55

解密:33 ^ 3 ^ 3 ^ 3 = 22 ^ 3 ^ 3 = 33 ^ 3 = 22
 ```
