var path = require('path')
var dir = path.resolve("./src/cipher_lib/crypto")
// стандартная библиотека шифрования по стандарту AES
var nodeCrypto = require(dir);
class Security {
    constructor(password) {
        this.password = password
    }

    getHash = text => nodeCrypto.createHash('sha256', this.password).update(text).digest('utf8')

    getCipher(text, password = this.password) {
        /* Функция для шифрования текста по ключу согласно стандарту AES */
        text = text.toString()
        // используем стандарт md5 Для хеширования
        let hash = nodeCrypto.createHash('md5')
        // получаем хеш пароля, по кускам
        hash.update(password)
        // получаем сам хеш
        let key = hash.digest('hex')

        // создаем хеш папроя и его хеша используя стандарт sha256 и секретный ключ Tunyan Edmon :)
        hash = nodeCrypto.createHash('sha256', "Tunyan Edmon")
        // повторно создаем пароль+хеш пароля
        hash.update(password + key)
        // получаем сам хеш
        const iv = hash.digest('hex')

        let _cipher = nodeCrypto.createCipheriv('aes-256-cfb', key, iv.slice(0, 16))

        // UPDATE: crypto changed in v0.10
        // https: // github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10
        // узнаем текущую версию узла
        let nodev = process.version.match(/^v(\d+)\.(\d+)/);
        let encrypted;

        // для старых версий
        if (nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            encrypted = _cipher.update(text, 'binary');
            // для новых версий
        } else {
            encrypted = _cipher.update(text, 'utf8', 'binary');
        }

        return Buffer.from(encrypted, 'binary').toString('base64');
    }

    getDecipher(text, password = this.password) {
        text = text.replace(/\-/g, '+').replace(/_/g, '/');
        let edata = Buffer.from(text, 'base64').toString('binary')
        let hash = nodeCrypto.createHash('md5')
        hash.update(password)
        let key = hash.digest('hex')
        hash = nodeCrypto.createHash('sha256', "Tunyan Edmon")
        hash.update(password + key)
        let iv = hash.digest('hex')
        let decipher = nodeCrypto.createDecipheriv('aes-256-cfb', key, iv.slice(0, 16))

        let nodev = process.version.match(/^v(\d+)\.(\d+)/);
        let decrypted, plaintext;

        // для старых версий
        if (nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            decrypted = decipher.update(edata, 'binary') + decipher.final('binary');
            plaintext = Buffer.from(decrypted, 'binary').toString('utf8');
            // для новых версий
        } else {
            plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
        }

        return plaintext
    }
}

module.exports.Security = Security;