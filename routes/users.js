var express = require('express');
var router = express.Router();

let connection = require("./mysqlConn");
// 引入md5加密模块
let md5 = require('crypto');

// 登录验证
router.post("/login", function (req, res) {
    let {username, password} = req.body;
    password = md5.createHash("md5").update(password).digest("hex");

    // console.log(username, password);

    // 执行查询的sql语句
    let sqlStr = `select * from tb_user where userName='${username}' and userPwd='${password}'`;
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;
        if (result.length>0) {
            // 把用户名和用户ID写入cookie
            res.cookie("username", result[0].userName);
            res.cookie("u_id", result[0].u_id);

            res.send({"isOK": true, msg: "登录成功！"});
        }else {
            res.send({"isOK": false, msg: "登录失败！"});
        }
    })
});

// 判断cookie是否存在 阻止未登录的用户访问功能页面
router.get('/checkState', function (req, res) {
    // 读取cookie中的username
    let username = req.cookies.username;

    // 如果username不存在 则跳转到登录页面
    if (!username) {
        res.send("alert('非法入侵，请登录！');location.href='signIn.html'");
    }else {
        res.send("");
    }
});

// 退出登录
router.get('/signOut', function (req, res) {
    /*console.log(req.cookies.username);
    console.log(req.cookies.u_id);*/
    res.clearCookie("username");
    res.clearCookie("u_id");
    res.redirect("/signIn.html");
});

// 添加管理员
router.post('/add', function(req, res, next) {
    let {username, pass, region} = req.body;
    pass=md5.createHash("md5").update(pass).digest("hex");

    // 4.执行sql语句
    let sqlSrc = `insert into tb_user(userName, userPwd, userGroup) values (?, ?, ?)`;
    let paramsArr = [username, pass, region];
    connection.query(sqlSrc, paramsArr, function(err, result){
      if (err) throw err;
      if (result.affectedRows>0) {
          res.send({"isOK": true, msg: "管理员添加成功！"});
      }else {
          res.send({"isOK": false, msg: "管理员添加失败！"});
      }


    });
});

// 管理员列表
router.get('/list', function (req, res) {
    // 执行sql语句
    let sqlSrc = `select * from tb_user order by u_id desc`;
    connection.query(sqlSrc, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// 修改管理员信息
router.get('/edit', function (req, res) {
    let u_id = req.query.uid;
    // console.log(u_id);

    // 查询语句
    let sqlStr = "select * from tb_user where u_id=?";
    let paramsArr = [u_id];
    connection.query(sqlStr, paramsArr, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

// 修改后 保存数据
router.post('/save', function (req, res) {
    let {pass, OldPass, username, region, uid} = req.body;
    // console.log(pass, OldPass, username, region, uid);

    // 判断密码是否有修改 如果有则需要重新加密 没有则不需要
    if (pass !== OldPass) {
        pass=md5.createHash("md5").update(pass).digest("hex");
    }

    // 更新语句
    let sqlSrc = "update tb_user set userName=?, userPwd=?, userGroup=? where u_id=?";
    let paramsArr = [username, pass, region, uid];
    connection.query(sqlSrc, paramsArr, (err, result)=>{
        if (err) throw err;
        if (result.affectedRows>0) {
            res.send({"isOK": true, msg: "修改成功！"});
        }else {
            res.send({"isOK": false, msg: "修改失败！"});
        }
    })
});

// 删除管理员
router.get('/del', function (req, res) {
    let uid = req.query.uid;
    console.log(uid);

    // 删除的sql语句
    let sqlStr = `delete from tb_user where u_id = ${uid}`;
    connection.query(sqlStr, (err, result)=>{
        if (err) throw err;
        if (result.affectedRows>0){
            res.send({"isOK": true, msg: "删除成功！"});
        }else {
            res.send({"isOK": false, msg: "删除失败！"});
        }
    })
});


module.exports = router;
