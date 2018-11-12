var express = require('express');
var router = express.Router();

let connection = require('./mysqlConn');

// 添加商品
router.post('/add', function(req, res, next) {
    let {classify, barCode, goodsName, purchasePrice, marketPrice, goodsPrice, count, weight, unit, isDiscount, isPromotion, introduce} = req.body;

    // console.log(classify, barCode, goodsName, goodsPrice, marketPrice, purchasePrice, count, weight, unit, isDiscount, isPromotion, introduce);
    let sqlStr = "insert into tb_goods(classify, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weight, unit, promotion, discount, goodsDetails) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
    let paramsArr = [classify, barCode, goodsName, purchasePrice, marketPrice, goodsPrice, count, weight, unit, isDiscount, isPromotion, introduce];
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

// 商品列表
router.get("/list", function (req, res) {
    let sqlStr = "select * from tb_goods";
    connection.query(sqlStr, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

// 分页
router.get("/listPage",(req,res)=>{
    //接收页码和每页大小
    let {currentPage, pageSize, keywords, classify}=req.query;

    //构造sql
    let sqlStr="select * from tb_goods where 1=1";

    // --------------全表---------------
    connection.query(sqlStr, (err, goodsList)=>{
        if (err) throw err;
        let total = goodsList.length;  // 总条数


        // --------------查询---------------
        // 关键字
        if (keywords.length>0) {
            sqlStr += ` and (barcode like '%${keywords}%' or goodsname like '%${keywords}%')`;
        }

        // 分类
        if (classify.length>0) {
            sqlStr += ` and cg_id=${classify}`;
        }

        // 判断并执行查询sql
        if (keywords.length>0 || classify.length>0){
            connection.query(sqlStr, (err, searchList)=>{
                if (err) throw err;
                total = searchList.length;
            });
        }


        // ---------------分页---------------
        //定义分页参数数组
        let skip=(currentPage - 1)*pageSize; //跳过的条数
        let sqlParams=[skip,parseInt(pageSize)];
        sqlStr+=" limit ?,?";

        //执行查询当前页码应该显示的分页数据
        connection.query(sqlStr,sqlParams,(err,goodsPager)=>{
            if(err) throw err;
            res.send({"total":total,"dataList":goodsPager});
        });
    });
});


module.exports = router;
