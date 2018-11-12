var express = require('express');
var router = express.Router();

let connection = require("./mysqlConn");


// 添加分类
router.post('/add', function (req, res) {
    let {classify, classifyName, status} = req.body;
    console.log(classify, classifyName, status);
    // 添加数据
    let sqlStr = "insert into tb_classify(classify, c_name, c_status) values(?, ?, ?) ";
    let paramsArr = [classify, classifyName, status];
    connection.query(sqlStr, paramsArr, (err, result)=>{
        if (err) throw err;
        // console.log(result);
        if (result.affectedRows > 0) {
            res.send({"isOK": true, msg: "添加成功！"});
        }else {
            res.send({"isOK": false, msg: "添加失败！"});
        }
    })
});

// 分类列表
router.get('/list', function (req, res) {
    let sqlStr = "select * from tb_classify order by c_id desc";
    connection.query(sqlStr, (err, result)=>{
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
});

// 修改分类
// 获取分类信息
router.get('/edit', function (req, res) {
    let c_id = req.query.cid;
    // console.log(c_id);
    let sqlStr = "select * from tb_classify where c_id=?";
    let paramsArr = [c_id];
    connection.query(sqlStr, paramsArr, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});
// 保存数据
router.post('/save', function (req, res) {
    let { c_id, classify, classifyName, status, oldClassifyName} = req.body;
    // console.log(c_id, classify, classifyName, status, oldClassifyName);

    let sqlStr1 = "update tb_classify set classify=?, c_name=?, c_status=? where c_id=?";
    let paramsArr1 = [classify, classifyName, status, c_id];
    connection.query(sqlStr1, paramsArr1, (err, result)=>{
        if (err) throw err;
        if (result.affectedRows > 0){
            // 修改c_name里面的字段
            let sqlStr2 = "update tb_classify set classify=? where classify=?";
            let paramsArr2 = [classifyName, oldClassifyName];
            connection.query(sqlStr2, paramsArr2, (err, result)=>{
                if (err) throw err;
                res.send({"isOK": true, "msg": "修改成功！"});
            })
        }else {
            res.send({"isOK": false, "msg": "修改失败！"});
        }
    });
});


// 获取分类数据并去重
router.get('/getClassify', function (req, res) {
    let sqlStr = "select distinct classify from tb_classify";  // 去重 select distinct 字段名 from 表名
    connection.query(sqlStr, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

// 删除分类
router.get('/del', function (req, res) {
    let c_id = req.query.cid;
    // console.log(c_id);
    let sqlStr = "delete from tb_classify where c_id=?";
    let paramsArr = [c_id];
    connection.query(sqlStr, paramsArr, (err, result)=>{
        if (err) throw err;
        if (result.affectedRows > 0){
            res.send({"isOK": true, msg: "删除成功！"});
        }else {
            res.send({"isOK": false, msg: "删除失败！"});
        }
    })
});

module.exports = router;
