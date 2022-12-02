const path = require('path')
const fs = require('fs')
const exec = require('child_process')
const sqlite3 = require(path.resolve("./src/sqlite")).verbose();
const secirity = require('./src/security')
const cipher = new secirity.Security('1234567890qwerty1234567890qwerty')

const my_files = path.resolve('my_files')

// const c = cipher.getCipher("test")
// const dc = cipher.getDecipher(c)

const dd__container = document.querySelector('.dd__container')
const title = document.getElementById('title')

const path_main_folder = path.resolve('my_files')
const exists_main_folder = fs.existsSync(path_main_folder)

if (exists_main_folder === false) {
    exec.execSync('md my_files');
    exec.execSync('attrib +h my_files');
}

const path_db = path.resolve('info.db')
const exists_db = fs.existsSync(path_db)

let eventTarget;

if (exists_db === false) {
    const db = new sqlite3.Database('info.db');
    db.run(`CREATE TABLE "info" (
                "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "name"	TEXT NOT NULL,
                "extname"	TEXT NOT NULL,
                "size"	INTEGER NOT NULL,
                "date"	TEXT NOT NULL,
                "origin_path"	TEXT NOT NULL,
                "password"	TEXT NOT NULL
            ); `);

    db.close()
    exec.execSync('attrib +h info.db');
}

dd__container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

dd__container.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        drop(f.path)
    }
});

dd__container.addEventListener('dragenter', (event) => {
    eventTarget = event.target;
    dd__container.style.backgroundColor = 'rgba(99, 99, 99, 0.8)'
    dd__container.style.border = '5px black dotted'
    title.innerText = "Отпустите файл"
});

function dragleave() {
    dd__container.style.backgroundColor = 'rgba(99, 99, 99, 0.5)'
    dd__container.style.border = '5px rgb(99, 99, 99) dashed'
    title.innerText = "Перетащите сюда файл, который хотите защитить"
}

dd__container.addEventListener('dragleave', (event) => {
    if (eventTarget === event.target) dragleave()
});


function drop(full_path_file) {
    // let file = full_path_file.split('\\')
    // file = file[file.length - 1]

    password__container.style.display = 'grid'
    let file = path.basename(full_path_file)
    let file_extname = path.extname(file)
    const file_name = file.slice(0, file.indexOf(file_extname))
    file_extname = file_extname.replace('.', '')
    const file_size = fs.statSync(full_path_file).size

    // passwordChek
    password_send.onclick = () => {
        password__error.innerText = ''
        const pass = document.getElementById('pass').value
        const pass_repeat = document.getElementById('pass_repeat').value
        if (pass.length > 0 && pass === pass_repeat) {
            const date = new Date()
            const sqlite_date = date.toLocaleDateString()
            const sqlite_time = date.toLocaleTimeString()
            const full_date = `${sqlite_time} | ${sqlite_date}`

            exec.execSync(`move "${full_path_file}" "${my_files}"`)

            // const full_name = `${file_size}_${file_name}`
            // const entry_name = path.join(my_files, file)

            // const output_name = path.join(my_files, full_name + 'zip');
            // var archiver = require('archiver');
            // archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));
            // var output = fs.createWriteStream(output_name);
            // var archive = archiver('zip-encryptable', {
            //     zlib: { level: 9 },
            //     forceLocalTime: true,
            //     password: 'test'
            // });
            // archive.pipe(output);
            // archive.append('FounderList (2).docx');
            // archive.finalize();


            const db = new sqlite3.Database(path_db);
            db.run(`INSERT INTO info(name, extname, size, date, origin_path, password) VALUES(?,?,?,?,?,?)`,
                [file_name, file_extname, file_size, full_date, full_path_file, cipher.getHash(pass)])
            db.close()

            document.getElementById('pass').value = ''
            document.getElementById('pass_repeat').value = ''
            setActivate()
            dragleave()
        }
        else {
            password__error.innerText = 'Пароль не совподает'
        }
    }

}
