---
layout: post
title: "Proctect your password"
date: "2024-12-30 09:04:25"
categories: 
 - blog 
mathjax: false 
# key: false 

permallink: proctect your password

 
tags:
 - blog
 - tool
---

# 1. Generate  a new keypair 

<style>
    input,textarea{
        margin: 10px auto ;
        padding: 10px;
        background-color: #f1f1f1;
        border-radius: 5px;
        border: none;
        
        margin-left: 10px;
        right: 0;
        width: auto;
        flex-grow: 1; /* default 0 */
    }
    input{
        padding: 1rem 2rem;
        min-height: 3rem
    }
    textarea{
        height: 6rem;
    }

    .row{
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    input[type="button"]{
        background-color: #334;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
        width: 100%;
    }

    .row > text{
        margin: 10px;
        width: 8rem;
    }

    .xx{
        opacity: 0.5;
        background-color: #EEE;
    }
  
</style>

<div class="row">
    <text>privateKey</text> <input id="privateKey" type="text" value=""   />
</div>
<div class="row">
    <text>publickKey</text><input id="publickKey" class="xx" type="text" value=""  readonly/>
</div>





<input class="btn" type="button" id='genKeyPair' value="Generate new keypair" >   
<input class="btn" type="button" id='genKeyPair2' value="Generate keypair with privateKey" >   



--- 

# 2. Encrypt message

<div class="row">
    <text>publicKey</text> <input id="publicKey2" type="text" value=""   />
</div>

<div class="row">
    <text>message </text> <input id="plaintext" type="text" value=""  placeholder="plaintext, e.g. Hello world"  />
</div>

<div class="row">
    <text>result </text> <textarea id="result1" type="text" value=""   readonly=true> </textarea>
</div>

<input class="btn" type="button" id='encryptMsg' value="Encrypt the Message" >   


--- 
# 3. Decrypt message

<div class="row">
    <text>privateKey</text> <input id="privateKey2" type="text" value=""   />    
</div>

<div class="row">
    <text >cipherMsg</text> <input id="cipher" type="text"    />    
</div>

<div class="row">
    <text>result </text> <textarea id="result2" type="text" value=""   readonly=true> </textarea>
</div>
<input class="btn" type="button" id='decyptMsg' value="Decrypt the chiper" /> 


<script>   {% include_file js/ec2.js %} </script>

<script  >
console.log('1')
    !async function (){

        document.getElementById('genKeyPair2').addEventListener('click', function(){
            genKeyPair2()
        })
        
        document.getElementById('genKeyPair').addEventListener('click', function(){
            let kp = genKeyPair();
        })

        document.getElementById('encryptMsg').addEventListener('click', async function(){
            let publicKey = document.getElementById('publicKey2').value
            let plaintext = document.getElementById('plaintext').value
            let enc = await encryptMsg(plaintext,publicKey)
            console.log('enc',enc)

            document.getElementById('result1').value = enc
        })

        document.getElementById('decyptMsg').addEventListener('click', async function(){
            let privateKey = document.getElementById('privateKey2').value
            let cipher = document.getElementById('cipher').value
            let dec = await decryptMsg(cipher,privateKey)
            console.log('dec',dec)
            document.getElementById('result2').value = dec
        })

        function Uint8ArrayToHex(arr){
            return Array.from(arr, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        
        function base64(uint8Array) {
            const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        }

        function base64ToUInt8Array(base64String) {
            const binaryString = atob(base64String);
            return Uint8Array.from(binaryString, char => char.charCodeAt(0));
        }

        function base64ToHex(base64String) {
            // Step 1: Decode Base64 to binary string
            const binaryString = atob(base64String);

            // Step 2: Convert binary string to hex
            const hexString = Array.from(binaryString)
                .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('');
            
            return hexString;
        }
        const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

        const EC = elliptic.ec;
        var ec = new EC('secp256k1');
        function genKeyPair(){    
            var key = ec.genKeyPair();
            let privateKey = fromHexString(key.getPrivate('hex'))
            let publickKey = fromHexString(key.getPublic().encodeCompressed('hex'))
            let kp = {
                publickKey:base64(publickKey),
                privateKey:base64(privateKey)
            }

            document.getElementById('publickKey').value = kp.publickKey;
            document.getElementById('privateKey').value = kp.privateKey;

            return kp
        }

        





    
        /// return uint8array length 64
        function sha512(arr){
            return crypto.subtle.digest('SHA-512', arr).then(function(hash){
                let r = new Uint8Array(hash)
                return r
            });
        }
 

        async function encryptMsg(msg,pubKeyB64){
            let te = new TextEncoder
            let arrMsg = te.encode(msg)

            let pubKeyObj = ec.keyFromPublic(base64ToHex(pubKeyB64), 'hex') 
            let tmpKp = ec.genKeyPair()

            let iv = crypto.getRandomValues(new Uint8Array(16));
            let dx = tmpKp.derive(pubKeyObj.getPublic()).toString('hex')
            let dhArr = fromHexString(dx)


            // using crypto api to encrypt using aes cbc 128
            let dhdata =  (await sha512(dhArr))
            let key = dhdata.slice(0,32)
            let hmacKey = dhdata.slice(32,64)
  

            let keyObj = await crypto.subtle.importKey('raw', key, {name: 'AES-CBC',iv}, false, ['encrypt'])
            let encArr = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-CBC', iv: iv}, keyObj, arrMsg));
            let hmacKeyObj = await crypto.subtle.importKey('raw', hmacKey, {name: 'HMAC', hash: {name: 'SHA-256'}}, false, ['sign'])

            let tmpPub = fromHexString(tmpKp.getPublic().encodeCompressed('hex'))

 
            let hmacArr = new Uint8Array(iv.length + tmpPub.length + encArr.length)

            hmacArr.set(iv)
            hmacArr.set(tmpPub,iv.length)
            hmacArr.set(encArr,iv.length + tmpPub.length)
            let mac = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKeyObj, hmacArr))

            let head = fromHexString('0100100020002100')
        

            // result = head + iv + mac + tmpPub + encArr 
            let result = new Uint8Array(head.length + iv.length + mac.length + tmpPub.length + encArr.length)
            result.set(head)
            result.set(iv,head.length)
            result.set(mac,head.length + iv.length)
            result.set(tmpPub,head.length + iv.length + mac.length)
            result.set(encArr,head.length + iv.length + mac.length + tmpPub.length)
 
            return base64(result)
        }

        async function decryptMsg(cipher,privateKeyBase64) {
            let cipherArr = base64ToUInt8Array(cipher)
            let head = cipherArr.slice(0,8)
            let iv = cipherArr.slice(8,24)
            let mac = cipherArr.slice(24,56)
            let pubKey = cipherArr.slice(56,89)
            let encArr = cipherArr.slice(89)
 

            let pirKeyObj = ec.keyFromPrivate(base64ToHex(privateKeyBase64), 'hex') 
            let pubKeyObj = ec.keyFromPublic(base64ToHex(base64(pubKey)), 'hex')
            let dh = pirKeyObj.derive(pubKeyObj.getPublic())

            let dhXHex = dh.toString('hex');
            let dhArr = fromHexString(dhXHex)
            let dhdata =  (await sha512(dhArr))
            let key = dhdata.slice(0,32)
            let hmacKey = dhdata.slice(32,64)

            let keyObj = await crypto.subtle.importKey('raw', key, {name: 'AES-CBC',iv}, false, ['decrypt'])
            let hmacKeyObj = await crypto.subtle.importKey('raw', hmacKey, {name: 'HMAC', hash: {name: 'SHA-256'}}, false, ['sign'])


            let hmacArr = new Uint8Array(iv.length + pubKey.length + encArr.length)
            hmacArr.set(iv)
            hmacArr.set(pubKey,iv.length)
            hmacArr.set(encArr,iv.length + pubKey.length)
            let mac2 = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKeyObj, hmacArr))
            if (mac2.toString() !== mac.toString()) {
                throw new Error('Bad MAC');
            }
            let decArr = new Uint8Array(await crypto.subtle.decrypt({name: 'AES-CBC', iv: iv}, keyObj, encArr));
            let td = new TextDecoder
            let decMsg = td.decode(decArr)

            
            return decMsg
            
        }


        function genKeyPair2(){

            
            try {
                document.getElementById('publickKey').value = '...'

                let kp = ec.keyFromPrivate(base64ToHex(document.getElementById('privateKey').value), 'hex') 

                let hex = kp.getPublic().encodeCompressed('hex');
                let b64 = base64(fromHexString(hex))
 
                setTimeout(() => {
                    try {
                        document.getElementById('publickKey').value = b64
                    } catch (error) {    
                    }
                }, 1000);
                
            } catch (error) {
                console.log('error',error)
                alert('Invalid privateKey')  
            }
           
        }


        let kp = genKeyPair();

        document.getElementById('publicKey2').value = kp.publickKey
        document.getElementById('privateKey2').value = kp.privateKey

        let plain = 'Hello World 🏊‍♀️ '
        document.getElementById('plaintext').value = plain
        document.getElementById('cipher').value = await encryptMsg(plain,kp.publickKey)
    }()
    
  
</script>






