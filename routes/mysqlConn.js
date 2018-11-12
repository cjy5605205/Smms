// 1.引入mysql模块 （先安装模块 npm i mysql）
let mysql = require('mysql');

// 2.链接数据库
let connection = mysql.createConnection({
    host: "localhost",  // 主机名
    user: "root",       // 用户名
    password: "root",  // 密码
    database: "db_smms"// 数据库名
});

// 3.打开数据库
connection.connect();

// 暴露方法
module.exports = connection;