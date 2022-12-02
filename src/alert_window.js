const password_cancel = document.getElementById('password_cancel')
const password_check = document.getElementById('password_check')
const password_send = document.getElementById('password_send')
const settings__container = document.querySelector('.settings__container')
const password__container = document.querySelector('.password__container')
const switch_button = document.querySelector('.switch')
const display__container = document.querySelector('.display__container')
const display = document.querySelector('.display')
const password__error = document.getElementById('password__error')
const password__check__error = document.getElementById('password__check__error')
let ATTEMPT = 0

password_cancel.onclick = () => {
    document.getElementById('pass').value = ''
    document.getElementById('pass_repeat').value = ''
    password__container.style.display = 'none'
}

function settings_close() {
    document.getElementById('pass_check').value = ''
    settings__container.style.display = 'none'
}

password_check_cancel.onclick = () => settings_close()


function setActivate() {
    password__container.style.display = 'none'
    display__container.style.display = 'none'
    dd__container.style.display = 'flex'
}

function getActivate() {
    password__container.style.display = 'none'
    dd__container.style.display = 'none'
    display__container.style.display = 'flex'
    select()
}

function settings(id) {
    password__container.style.display = 'none'
    settings__container.style.display = 'grid'
    const db = new sqlite3.Database(path_db);


    db.get('SELECT * FROM info WHERE id = ?', [id], (err, row) => {
        if (err) console.log(`db_err ${err}`);
        else {
            const name = row.name
            const extname = row.extname
            const origin_path = row.origin_path
            const password = row.password
            const full_name = path.join(my_files, `${name}.${extname}`)

            function check(callback) {
                const pass = document.getElementById('pass_check').value
                const _password = cipher.getHash(pass)
                if (password === _password) {
                    callback()
                    settings_close()
                    getActivate()
                    ATTEMPT = 0
                }
                else {
                    if (ATTEMPT === 3) {
                        process.exit(-1);
                    }
                    password__check__error.innerText = `Пароль не верный, у вас ${3 - ATTEMPT} попыток`
                    ATTEMPT++
                    console.log(ATTEMPT);
                }
            }

            password_unblock.onclick = () => {
                check(() => {
                    const _db = new sqlite3.Database(path_db);
                    exec.execSync(`move "${full_name}" "${origin_path}"`)
                    _db.run(`DELETE FROM "info" WHERE id=?`, id, function (err) {
                        if (err) {
                            console.log(err)
                        }
                        _db.close()
                        settings_close()
                        select()
                    })
                }
                )
            }

            password_check.onclick = () => {
                check(() => exec.execSync(`start ${full_name}`))
            }
            document.getElementById('pass_check').value = ''
        }
    })
    db.close()
}

function select() {
    ATTEMPT = 0
    password__check__error.innerText = ''
    const db = new sqlite3.Database(path_db);
    display.innerHTML = ''
    const th_list = ['Имя', 'Расширение', 'Размер', 'Дата']
    const tr_title = document.createElement('tr')
    for (const item of th_list) {
        const th = document.createElement('th')
        th.innerText = item
        tr_title.appendChild(th)
    }
    display.appendChild(tr_title)

    db.all('SELECT * FROM info ORDER BY id ASC', (err, rows) => {
        if (err) console.log(`db_err ${err}`);
        else {
            for (const obj of rows) {
                const tr = document.createElement('tr')
                tr.id = obj.id
                tr.onclick = () => settings(obj.id)
                for (const key of Object.keys(obj).slice(1, -2)) {
                    const td = document.createElement('td')
                    td.textContent = obj[key]
                    tr.append(td)
                }
                display.appendChild(tr)
            }
        }
    })
    db.close()
}

switch_button.onclick = () => {
    const val = document.querySelector('input[name="file"]:checked').value
    if (val === 'set' && window.getComputedStyle(dd__container).display === 'none') {
        setActivate()
    }
    if (val === 'get' && window.getComputedStyle(display__container).display === 'none') {
        getActivate()
    }
}