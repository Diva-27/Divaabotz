const fs = require('fs')

function getPosiMenu(id, _db) {
   var posi = null
   Object.keys(_db).forEach((i) => {
     if (_db[i].jid == id) {
       posi = i
     }
   })
   return posi
}

function getPosiCmd(menu, _db) {
   var posi = null
   Object.keys(_db).forEach((i) => {
     if (_db[i].menu == menu) {
       posi = i
     }
   })
   return posi
}

function getAnswerCmd(menu, _db) {
   var answer = null
   Object.keys(_db).forEach((i) => {
     if (_db[i].menu == menu) {
       answer = _db[i].harga
     }
   })
   return answer
}

function getPosiRows(title, _db) {
   var posi = null
   Object.keys(_db).forEach((i) => {
     if (_db[i].title == title) {
       posi = i
     }
   })
   return posi
}

module.exports = {
    getPosiMenu,
    getPosiCmd,
    getAnswerCmd,
    getPosiRows
}