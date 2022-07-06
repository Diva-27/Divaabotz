const moment = require("moment-timezone");
const fs = require("fs");
const speed = require("performance-now");

moment.tz.setDefault("Asia/Jakarta").locale("id");

let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
let setting = JSON.parse(fs.readFileSync('./config.json'))
const { getLimit, getBalance, cekGLimit } = require("../lib/limit")

function toCommas(x) {
    x = x.toString()
    var pattern = /(-?\d+)(\d{3})/;
     while (pattern.test(x))
       x = x.replace(pattern, "$1,$2");
    return x;
}

const timestamp = speed();
const latensi = speed() - timestamp

exports.allmenu = (ucapanWaktu, sender, mundur, prefix, jam, tanggal, runtime, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount) => {
    return`${ucapanWaktu} @${sender.split("@")[0]}

Menuju Tahun Baru Islam 
${mundur}

👑 Creator : ${setting.ownerName}
🤖 Bot Name : ${setting.botName}
📍 Prefix : ⟨ ${prefix} ⟩
⌚ Time : ${jam}
📆 Date : ${tanggal}
📶 Speed : ${latensi.toFixed(4)}
⏳ Runtime :
${runtime(process.uptime())}

*USER INFO*

> Name : ${pushname}
> Status : ${isOwner ? 'Owner' : isPremium ? 'Premium' : 'Gratisan'}
> Limit : ${isOwner ? '-' : isPremium ? 'Unlimited' : getLimit(sender, limitCount, limit)}
> Limit Game : ${isOwner ? '-' : cekGLimit(sender, gcount, glimit)}
> Balance : $${toCommas(getBalance(sender, balance))}

*LIST COMMAND*

❏ ${prefix}menusimple
❏ ${prefix}menusticker
❏ ${prefix}menugabut
❏ ${prefix}menugroup
❏ ${prefix}menusistem
❏ ${prefix}menustore
❏ ${prefix}menudownload
❏ ${prefix}menugame
❏ ${prefix}menurandom
❏ ${prefix}menusearch
❏ ${prefix}menumaker
❏ ${prefix}menuowner
❏ ${prefix}menuother
`
}

exports.simpleMenu = (prefix) => {
    return`
❏ ${prefix}sticker
❏ ${prefix}smeme
❏ ${prefix}attp
❏ ${prefix}simi
❏ ${prefix}hartatahta
❏ ${prefix}nulis
`
}

exports.stickerMenu = (prefix) => {
    return`
❏ ${prefix}sticker
❏ ${prefix}smeme
❏ ${prefix}attp
❏ ${prefix}toimg
❏ ${prefix}tovideo
`
}

exports.gabutMenu = (prefix) => {
    return`
❏ ${prefix}apakah
❏ ${prefix}bisakah
❏ ${prefix}kapankah
❏ ${prefix}bagaimanakah
❏ ${prefix}rate
❏ ${prefix}gantengcek
❏ ${prefix}cantikcek
❏ ${prefix}sangecek
❏ ${prefix}gaycek
❏ ${prefix}lesbicek
❏ ${prefix}cekbapak
`
}

exports.groupMenu = (prefix) => {
    return`
❏ ${prefix}welcome
❏ ${prefix}left
❏ ${prefix}setwelcome
❏ ${prefix}changewelcome
❏ ${prefix}delsetwelcome
❏ ${prefix}setleft
❏ ${prefix}changeleft
❏ ${prefix}delsetleft
❏ ${prefix}linkgc
❏ ${prefix}setppgc
❏ ${prefix}setnamegc
❏ ${prefix}setdesc
❏ ${prefix}group
❏ ${prefix}revoke
❏ ${prefix}hidetag
❏ ${prefix}add
❏ ${prefix}kick
❏ ${prefix}promote
❏ ${prefix}demote
`
}

exports.sistemMenu = (prefix) => {
    return`
❏ ${prefix}antilink
❏ ${prefix}antiwame
❏ ${prefix}setcmd
❏ ${prefix}delcmd
`
}

exports.storeMenu = (prefix) => {
    return`
❏ ${prefix}list
❏ ${prefix}addlist
❏ ${prefix}dellist
❏ ${prefix}update
❏ ${prefix}jeda
❏ ${prefix}tambah
❏ ${prefix}kurang
❏ ${prefix}kali
❏ ${prefix}bagi
❏ proses < reply chat >
❏ done < reply chat >
`
}

exports.downloadMenu = (prefix) => {
    return`
❏ ${prefix}play
❏ ${prefix}ytmp3
❏ ${prefix}ytmp4
❏ ${prefix}getmusic
❏ ${prefix}getvideo
❏ ${prefix}tiktok
❏ ${prefix}instagram
❏ ${prefix}facebook
`
}

exports.gameMenu = (prefix) => {
    return`
❏ ${prefix}tebakgambar
❏ ${prefix}tictactoe
❏ ${prefix}delttc
❏ ${prefix}suit
❏ ${prefix}slot
❏ ${prefix}topglobal
❏ ${prefix}toplocal
`
}

exports.randomMenu = (prefix) => {
    return`
❏ ${prefix}asupan
❏ ${prefix}couple
❏ ${prefix}meme
❏ ${prefix}waifu
❏ ${prefix}gachacowok
❏ ${prefix}gachacewek
❏ ${prefix}quotes
❏ ${prefix}bucin
❏ ${prefix}pantun
❏ ${prefix}katabijak
❏ ${prefix}faktaunik
❏ ${prefix}darkjokes
`
}

exports.searchMenu = (prefix) => {
    return`
❏ ${prefix}nickff
❏ ${prefix}nickml
❏ ${prefix}nickpubg
❏ ${prefix}nickdomino
❏ ${prefix}ytsearch
❏ ${prefix}lirik
❏ ${prefix}lirik2
❏ ${prefix}groupwa
❏ ${prefix}pinterest
❏ ${prefix}wikipedia
`
}

exports.makerMenu = (prefix) => {
    return`
❏ ${prefix}pornhub
❏ ${prefix}grafity-text
❏ ${prefix}grafity-text2
❏ ${prefix}logo-wolf
❏ ${prefix}logo-wolf2
❏ ${prefix}black-pink
❏ ${prefix}magma
❏ ${prefix}neon-light
❏ ${prefix}water-color
❏ ${prefix}larva
`
}

exports.ownerMenu = (prefix) => {
    return`
❏ >
❏ x
❏ $
❏ ${prefix}join
❏ ${prefix}leave
❏ ${prefix}self
❏ ${prefix}public
❏ ${prefix}broadcast
❏ ${prefix}setpp
❏ ${prefix}exif
❏ ${prefix}addpremium
❏ ${prefix}delpremium
❏ ${prefix}addsewa
❏ ${prefix}delsewa
❏ ${prefix}resetlimit
`
}

exports.otherMenu = (prefix) => {
    return`
❏ ${prefix}ssweb
❏ ${prefix}kalkulator
❏ ${prefix}readmore
❏ ${prefix}limit
❏ ${prefix}balance
❏ ${prefix}transfer
❏ ${prefix}buylimit
❏ ${prefix}buyglimit
`
}

exports.tos = (pushname) => {
    return`\t\t\t\t*💰「 DONATE 」💰*

Hai ${pushname}👋
Kalian bisa mendukung saya agar bot ini tetap up to date dengan:
🏧 ${setting.no_ewallet} (OVO/Dana/GoPay)

Berapapun donasi kalian akan sangat berarti 👍

Arigatou!

Contact person Owner:
wa.me/628895585970 (Owner)`
}

exports.rules = (prefix) => {
    return`Syarat & Ketentuan *${setting.botName}*

• ${setting.botName} *hanya menyimpan nomor anda* di dalam database sebagai nomor user
• ${setting.botName} *tidak pernah meminta informasi pribadi* anda seperti alamat rumah, asal daerah, dan lain-lain
• ${setting.botName} tidak menerima *Telpon / Video Call*
• Dilarang *copy tampilan* bot
• Dilarang melakukan *spam* terhadap bot
• ${setting.botName} tidak menyimpan *data pribadi* anda
• ${setting.botName} *tidak bertanggungjawab atas fitur apapun yang anda gunakan*
• ${setting.botName} *tidak* menyimpan foto, video, atau media apapun yang anda kirimkan
• Apabila menemukan bug, error, atau request fitur harap hubungi developer bot
• ${setting.botName} berhak *memblokir* atau *ban* terhadap user dengan alasan maupun tanpa alasan

_Regards : ${setting.ownerName}_`
}
