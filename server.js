const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // 引入 SQLite3 模块

const app = express();
const db = new sqlite3.Database('C:/backend/strains.db'); // 或使用 'C:\\backend\\strains.db'
// 创建一个内存数据库（或指定文件路径）

app.use(cors());
app.use(bodyParser.json());

// 创建数据库表
db.serialize(() => {
    db.run("CREATE TABLE strains (id INTEGER PRIMARY KEY, strain_number TEXT, storage_location TEXT, preserver TEXT, date TEXT, mass_spectrometry_result TEXT)");
});

// 添加菌株信息的 API
app.post('/strains', (req, res) => {
    const { strainNumber, storageLocation, preserver, date, massResult } = req.body;
    db.run("INSERT INTO strains (strain_number, storage_location, preserver, date, mass_spectrometry_result) VALUES (?, ?, ?, ?, ?)",
        [strainNumber, storageLocation, preserver, date, massResult], (err) => {
            if (err) {
                return res.status(500).send('数据库错误');
            }
            res.status(201).send('菌株信息已保存');
        });
});

// 检索菌株信息的 API
app.get('/strains', (req, res) => {
    const searchTerm = req.query.search;
    let query = "SELECT * FROM strains";
    const params = [];

    if (searchTerm) {
        query += " WHERE strain_number LIKE ? OR storage_location LIKE ? OR preserver LIKE ?";
        params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send('数据库错误');
        }
        res.json(rows);
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务器在 http://localhost:3000 运行');
});
