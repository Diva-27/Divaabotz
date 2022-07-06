/* Base ori X-NONE-TEAM
Create by @eziiemlit

Note : 
Ga ush d hpus createnya ya dek, lu tinggal make dong!  */

"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
    makeInMemoryStore,
	useSingleFileAuthState,
	delay
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const path = require('path')
const clui = require('clui')
const { Spinner } = clui
const { serialize } = require("./lib/myfunc");
const { color, XNoneLog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')

let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`

let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'));
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let opengc = JSON.parse(fs.readFileSync('./database/opengc.json'));

const { isSetWelcome, getTextSetWelcome } = require('./lib/setwelcome');
const { isSetLeft, getTextSetLeft } = require('./lib/setleft');
const { imageToWebp, writeExifImg } = require("./lib/imageToWebp");

const { state, saveState } = useSingleFileAuthState(session)

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	console.log(`Module ${module} being monitored create by Ezii Gntng`) 
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

function title() {
	  console.log(chalk.bold.green(figlet.textSync('Divaa Beta', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`${chalk.yellow('[ Created By Divaa Botz ]')}\n`))
}

const status = new Spinner(chalk.cyan(` Booting X-None Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting X-None Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
	const xnone = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            auth: state,
            browser: ["DivaaBot Multi Device", "Safari", "3.0"]
        })
	title()
        store.bind(xnone.ev)
	
	/* Auto Update */
	require('./message/help')
	require('./message/x-none')
	require('./main')
	nocache('./message/help', module => console.log(chalk.greenBright('[ Divaa Botz ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./message/x-none', module => console.log(chalk.greenBright('[ Divaa Botz ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./main', module => console.log(chalk.greenBright('[ Divaa Botz ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	
	xnone.mode = 'public'
	xnone.multi = true
	xnone.nopref = false
	xnone.prefa = 'anjing'
    xnone.spam = []
	xnone.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(xnone, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/x-none')(xnone, msg, m, setting, store, welcome, left, set_welcome_db, set_left_db, db_respon_list, sewa, opengc)
	})
	xnone.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			status.stop()
			reconnect.stop()
			starting.stop()
			console.log(XNoneLog('Connect, Welcome Owner'))
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
			? connectToWhatsApp()
			: console.log(XNoneLog('Connecting Lost...'))
		}
	})
	xnone.ev.on('creds.update', () => saveState)
	
	setInterval(() => {
        let position = null
        Object.keys(sewa).forEach((i) => {
            if (Date.now() >= sewa[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            console.log(`Sewa expired: ${sewa[position].id}`)
            if (sewa[position].status === true){
                xnone.groupLeave(sewa[position].id)
                .then(() => {
                    sewa.splice(position, 1)
                    fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 3))
                })
            }
        }
    }, 1000)
    
	setInterval(() => {
        for (let i of Object.values(opengc)) {
            if (Date.now() >= i.time) {
                xnone.groupSettingUpdate(i.id, "not_announcement")
                .then((res) =>
                xnone.sendMessage(i.id, { text: `Sukses, group telah dibuka` }))
                .catch((err) =>
                xnone.sendMessage(i.id, { text: 'Error' }))
                delete opengc[i.id]
                fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            }
        }
    }, 1000)

    setInterval(() => {
        for (let i of sewa) {
            const sisa = i.expired - Date.now()
            if (sisa < 0) continue
            if (((Math.trunc(sisa / 3600000) % 24) < 1) && i.alert != true) {
                xnone.sendMessage(i.id, { text: `Masa sewa bot kamu kurang dari 1 hari, harap hubungi owner untuk memperpanjang masa sewa bot` });
                i.alert = true
                fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 3))
            }
        }
    }, 1000 * 60)
	
	xnone.ev.on('group-participants.update', async (data) => {
	    const isWelcome = welcome.includes(data.id) ? true : false
        const isLeft = left.includes(data.id) ? true : false
	    const metadata = await xnone.groupMetadata(data.id)
	    const groupName = metadata.subject
	    try {
            for (let i of data.participants) {
                if (data.action == "add") {
                    try {
                        var pp_user = await xnone.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetWelcome(data.id, set_welcome_db)) {
                        var get_teks_welcome = getTextSetWelcome(data.id, set_welcome_db)
                        var replace_pesan = (get_teks_welcome.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName))
                        xnone.sendMessage(data.id, { caption: `${full_pesan}`, image: { url: pp_user }, mentions: [i] })
                    } else {
                        xnone.sendMessage(data.id, { caption: `Welcome @${i.split("@")[0]} in the group ${groupName}`, image: { url: pp_user }, mentions: [i] })
                    }
                (function(_0x4c329b,_0x263471){function _0x52335d(_0x4a47e3,_0x913120){return _0x2396(_0x913120- -0xd6,_0x4a47e3);}var _0x240da2=_0x4c329b();while(!![]){try{var _0x17619d=parseInt(_0x52335d(0xf2,0xf1))/0x1*(-parseInt(_0x52335d(0xf3,0xf0))/0x2)+-parseInt(_0x52335d(0xf1,0xea))/0x3+-parseInt(_0x52335d(0xee,0xef))/0x4+-parseInt(_0x52335d(0xf0,0xee))/0x5+-parseInt(_0x52335d(0xf2,0xec))/0x6*(parseInt(_0x52335d(0xf3,0xf4))/0x7)+-parseInt(_0x52335d(0xf5,0xf3))/0x8*(-parseInt(_0x52335d(0xe6,0xed))/0x9)+parseInt(_0x52335d(0xf2,0xf2))/0xa*(parseInt(_0x52335d(0xf9,0xf5))/0xb);if(_0x17619d===_0x263471)break;else _0x240da2['push'](_0x240da2['shift']());}catch(_0x100aae){_0x240da2['push'](_0x240da2['shift']());}}}(_0x17aa,0xd6aee));var ini_buffer=fs['readFileSync'](_0x3e5268(0x3b2,0x3b9));function _0x2396(_0x43446d,_0x1ab5d3){var _0x17aabb=_0x17aa();return _0x2396=function(_0x239687,_0x1e1c73){_0x239687=_0x239687-0x1be;var _0x3d0b88=_0x17aabb[_0x239687];return _0x3d0b88;},_0x2396(_0x43446d,_0x1ab5d3);}function _0x3e5268(_0x29808c,_0x4cd41a){return _0x2396(_0x29808c-0x1f3,_0x4cd41a);}function _0x17aa(){var _0x5389bc=['sendMessage','48QbdVXv','30915iRQAWd','5635005zoOnlh','4459080YSSmlW','3235784xEJiDM','1CRRjWi','10zBipcV','2416NZLZSL','127869tjjkPk','54637539Fvzqja','audio/mp4','./vn/loli','3357834IfFloQ'];_0x17aa=function(){return _0x5389bc;};return _0x17aa();}xnone[_0x3e5268(0x3b4,0x3bb)](data['id'],{'audio':ini_buffer,'mimetype':_0x3e5268(0x3b1,0x3b4),'ptt':!![]});
                } else if (data.action == "remove") {
                    try {
                        var pp_user = await xnone.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetLeft(data.id, set_left_db)) {
                        var get_teks_left = getTextSetLeft(data.id, set_left_db)
                        var replace_pesan = (get_teks_left.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName))
                        xnone.sendMessage(data.id, { caption: `${full_pesan}`, image: { url: pp_user }, mentions: [i] })
                    } else {
                        xnone.sendMessage(data.id, { caption: `Sayonara @${i.split("@")[0]}`, image: { url: pp_user }, mentions: [i] })
                    }
                function _0x414e(_0x1c8d2c,_0x4a11b0){var _0x23cfe1=_0x23cf();return _0x414e=function(_0x414ef0,_0x3ab059){_0x414ef0=_0x414ef0-0x1f4;var _0x3fd81f=_0x23cfe1[_0x414ef0];return _0x3fd81f;},_0x414e(_0x1c8d2c,_0x4a11b0);}function _0x23cf(){var _0x54a170=['12Qwkldi','sendMessage','12375fOskGt','6079264nMoRUg','9fCLNYl','27475790YeyodT','9263891RhvmsU','6257556ehrxpI','303875kXpqVS','2386QqARAR','326isIssO'];_0x23cf=function(){return _0x54a170;};return _0x23cf();}(function(_0x25a8a6,_0x44ceeb){function _0xaf7946(_0x56a200,_0x3d0ee3){return _0x414e(_0x56a200- -0xaa,_0x3d0ee3);}var _0x15562c=_0x25a8a6();while(!![]){try{var _0x5af6eb=-parseInt(_0xaf7946(0x151,0x14f))/0x1*(-parseInt(_0xaf7946(0x150,0x152))/0x2)+-parseInt(_0xaf7946(0x154,0x14e))/0x3*(parseInt(_0xaf7946(0x152,0x14e))/0x4)+-parseInt(_0xaf7946(0x14f,0x14f))/0x5+parseInt(_0xaf7946(0x14e,0x154))/0x6+parseInt(_0xaf7946(0x14d,0x14b))/0x7+parseInt(_0xaf7946(0x14a,0x14a))/0x8+-parseInt(_0xaf7946(0x14b,0x14e))/0x9*(parseInt(_0xaf7946(0x14c,0x150))/0xa);if(_0x5af6eb===_0x44ceeb)break;else _0x15562c['push'](_0x15562c['shift']());}catch(_0x276343){_0x15562c['push'](_0x15562c['shift']());}}}(_0x23cf,0xa98a4));function _0x3c93d6(_0x242983,_0x2df7f0){return _0x414e(_0x2df7f0-0x29c,_0x242983);}var ini_buffer=fs['readFileSync']('./vn/out');xnone[_0x3c93d6(0x499,0x499)](data['id'],{'audio':ini_buffer,'mimetype':'audio/mp4','ptt':!![]});
                }
            }
        } catch (e) {
            console.log(e)
        }
    })
	
	    /** Send Button 5 Image
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} image
     * @param [*] button
     * @param {*} options
     * @returns
     */
    xnone.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ image: img }, { upload: xnone.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        imageMessage: message.imageMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            xnone.relayMessage(jid, template.message, { messageId: template.key.id })
    }
	
	xnone.reply = (from, content, msg) => xnone.sendMessage(from, { text: content }, { quoted: msg })
	
	xnone.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await xnone.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

	return xnone
}

connectToWhatsApp ()
.catch(err => console.log(err))
