const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
	return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

const XNoneLog = (text, color) => {
	return !color ? chalk.greenBright('[ X-None Team ] ') + chalk.magentaBright(text) : chalk.greenBright('[ X-None Team ] ') + chalk.keyword(color)(text)
}

module.exports = {
	color,
	bgcolor,
    XNoneLog
}
