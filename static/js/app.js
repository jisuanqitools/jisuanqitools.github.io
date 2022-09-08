var lilv = {
    "year": "2015/07/24",
    "gjjdk_le_5year": "3.25",
    "gjjdk_gt_5year": "3.75",
    "sydk_ge_1year": "5.10",
    "sydk_gt_1year_and_le_5year": "5.50",
    "sydk_gt_5year": "5.65"
}

// 页面加载时需要执行的
window.onload = function () {
    $("#gjjnll").val(lilv.gjjdk_gt_5year);
    $("#ptime").text(lilv.year + "贷款利率基准表");
}

// 判断选择的那种贷款
function select(obj) {
    //(a)为公积金贷款计算器
    //(b)为商业贷款计算器
    //(c)为组合贷款计算器
    if (obj == "a") {
        // 切换li背景样式
        $("#li1").addClass("liClass");
        $("#li2").removeClass("liClass");
        $("#li3").removeClass("liClass");
        // 切换div内容
        $("#table1").show();
        $("#table2").hide();
        $("#table3").hide();
        // 隐藏利率表
        $("#lilvbiao").hide();
        // 切换标题文本
        $("#title").text("公积金贷款计算器");
        // 隐藏结果表
        $("#jieguo").hide();
        // 给年利率赋值
        $("#gjjnll").val(lilv.gjjdk_gt_5year);
    } else if (obj == "b") {
        // 切换li背景样式
        $("#li2").addClass("liClass");
        $("#li1").removeClass("liClass");
        $("#li3").removeClass("liClass");
        // 切换div内容
        $("#table1").hide();
        $("#table2").show();
        $("#table3").hide();
        // 隐藏利率表
        $("#lilvbiao").hide();
        // 给年利率赋值
        $("#synll").val(lilv.sydk_gt_5year);
        $("#title").text("商业贷款计算器");
        $("#jieguo").hide();
    } else if (obj == "c") {
        $("#li3").addClass("liClass");
        $("#li2").removeClass("liClass");
        $("#li1").removeClass("liClass");
        $("#table1").hide();
        $("#table2").hide();
        $("#table3").show();
        $("#lilvbiao").hide();
        $("#jieguo").hide();
        $("#zhsynll").val(lilv.sydk_gt_5year);
        $("#zhgjjnll").val(lilv.gjjdk_gt_5year);
    }
}

// 公积金的年限选取
function gjjchange(obj) {
    var select = obj.value;
    if (select <= 5) {
        $("#gjjnll").val(lilv.gjjdk_le_5year);
    } else {
        $("#gjjnll").val(lilv.gjjdk_gt_5year);
    }
}

// 商业贷款选择年份
function sychange(obj) {
    var select = obj.value;
    if (select <= 1) {
        $("#synll").val(lilv.sydk_ge_1year);
    } else if (select > 5) {
        $("#synll").val(lilv.sydk_gt_5year);
    } else {
        $("#synll").val(lilv.sydk_gt_1year_and_le_5year);
    }
    $("#syjzll").val("0");
}

// 商业贷款选择折扣（基准利率）
function syselect(obj) {
    var select = obj.value;
    var synll = lilv.sydk_gt_5year;
    var jieguo = 0;
    if (select == "0") {
        $("#synll").val(synll);
    } else if (select < 5) {
        jieguo = select * synll;
        $("#synll").val(jieguo.toFixed(2));
    } else {
        jieguo = select * (synll / 10);
        $("#synll").val(jieguo.toFixed(2));
    }
}

// 公积金和商业共同的计算方式（根据参数判断）
function submit(obj) {
    $("#lilvbiao").hide();
    // 贷款金额
    var jine = 0;
    // 贷款期限
    var qixian = 0;
    // 贷款利率
    var lilv = 0;
    if (obj == "gjj") {
        jine = $("#gjjdkje").val() * 10000;
        qixian = $("#gjjdkqx").val() * 12;
        lilv = $("#gjjnll").val() / 100;
    } else if (obj == "sy") {
        jine = $("#sydkje").val() * 10000;
        qixian = $("#sydkqx").val() * 12;
        lilv = $("#synll").val() / 100;
    } else {
        alert("错误的使用!");
    }

    if (jine == "") {
        alert("请输入金额！");
    } else if (lilv == "") {
        alert("请输入年利率");
        $("#jieguo").hide();
    } else {
        $("#jgbxdkze").text(jine / 10000);	//本息贷款总额
        $("#jgbjdkze").text(jine / 10000);	//本金贷款总额
        $("#jgbxdkqx").text(qixian);	//本息贷款期限
        $("#jgbjdkqx").text(qixian);	//本金贷款期限

        // 计算本息每期还款
        var yuelilv = lilv / 12;
        var jgbxmqhk = (jine * yuelilv * (Math.pow(1 + yuelilv, qixian))) / (Math.pow(1 + yuelilv, qixian) - 1)
        $("#jgbxmqhk").text(jgbxmqhk.toFixed(2));	//本息每期还款

        // 计算本金的首月还款额
        var jgbjsyhk = (jine / qixian) + (jine - (jine / qixian) * (1 - 1)) * yuelilv;
        $("#jgbjmqhk").text(jgbjsyhk.toFixed(2));	//本金首期还款

        // 本息偿还本金
        var bxchbj = 0;
        // 本息的剩余本金
        var jgbxsybj = jine;
        // 本金的剩余本金
        var jgbjsybj = jine;
        // 本金的还款总额
        var jgbjhkze = 0;
        // 清空table中的所有
        $("#addTable").html("");
        var str1 = "<tr style='background-color:#5bc6ff;height:30px'>" +
            "<th rowspan='2' align='center' width='6%'>期次</th>" +
            "<th colspan='3'  align='center' width='47%'>等额本息</th>" +
            "<th colspan='3' align='center' width='47%'>等额本金</th>" +
            "</tr>" +
            "<tr style='background-color:#5bc6ff;'>" +
            "<td align='center'>偿还利息</td>" +
            "<td align='center'>偿还本金</td>" +
            "<td align='center'>剩余本金</td>" +
            "<td align='center'>偿还利息</td>" +
            "<td align='center'>每期还款</td>" +
            "<td align='center'>剩余本金</td>" +
            "</tr>";
        $("#addTable").append(str1);

        for (var i = 1; i < qixian + 1; i++) {
            // 本息偿还利息
            var jgbxchlx = (jine - bxchbj) * yuelilv;
            // 本息偿还本金
            var jgbxchbj = jgbxmqhk - jgbxchlx;
            // 本息剩余本金
            jgbxsybj = jgbxsybj - jgbxchbj;
            bxchbj = bxchbj + jgbxchbj;


            // 本金的计算

            // 已偿还本金累计额
            var jgbjbjlje = (jine / qixian) * i;
            // 每月还款利息部分
            var jgbjchlx = (jine - (jine / qixian) * (i - 1)) * yuelilv;
            // 每月还款本金部分
            var jgbjhkbj = jine / qixian;
            // 每期还款
            var jgbjmqhk = jgbjchlx + jgbjhkbj;
            // 剩余本金
            var jgbjsybj = 0;
            if (i == 1) {
                jgbjsybj = jine - jgbjhkbj;
            } else {
                jgbjsybj = jine - jgbjbjlje;
            }

            jgbjhkze = jgbjhkze + jgbjmqhk;
            // 判断如果最后的结果为负值则显示为0.00
            var asd = jgbxsybj.toFixed(2);
            var qwe = jgbjsybj.toFixed(2);
            if (asd == "-0.00") {
                asd = "0.00";
            }
            if (qwe == "-0.00") {
                qwe = "0.00";
            }
            var str = "<tr style='background-color:#ccc;'>" +
                "<td>" + i + "</td>" +
                "<td>" + jgbxchlx.toFixed(2) + "</td>" +
                "<td>" + jgbxchbj.toFixed(2) + "</td>" +
                "<td>" + asd + "</td>" +
                "<td>" + jgbjchlx.toFixed(2) + "</td>" +
                "<td>" + jgbjmqhk.toFixed(2) + "</td>" +
                "<td>" + qwe + "</td>" +
                "</tr>";
            var strs = "<tr>" +
                "<td>" + i + "</td>" +
                "<td>" + jgbxchlx.toFixed(2) + "</td>" +
                "<td>" + jgbxchbj.toFixed(2) + "</td>" +
                "<td>" + asd + "</td>" +
                "<td>" + jgbjchlx.toFixed(2) + "</td>" +
                "<td>" + jgbjmqhk.toFixed(2) + "</td>" +
                "<td>" + qwe + "</td>" +
                "</tr>";
            if (i % 2 == 0) {
                $("#addTable").append(str);
            } else {
                $("#addTable").append(strs);
            }

        }

        // 计算本息还款总额
        var jgbxhkze = jgbxmqhk * qixian;
        $("#jgbxhkze").text(jgbxhkze.toFixed(2));	// 本息还款总额
        $("#jgbjhkze").text(jgbjhkze.toFixed(2));	// 本金还款总额
        var jgbjzflx = jgbjhkze - jine;
        var jgbxzflx = jgbxhkze - jine;
        $("#jgbxzflx").text(jgbxzflx.toFixed(2));	// 本息支付利息
        $("#jgbjzflx").text(jgbjzflx.toFixed(2));	// 本金支付利息
        // 显示结果页
        $("#jieguo").show();
    }

}

// 公积金和商业共同的重置（根据参数判断）
function result(obj) {
    $("#lilvbiao").hide();
    $("#jieguo").hide();
    if (obj == "gjj") {
        $("#gjjdkqx").val("20");
        $("#gjjdkje").val("100");
        $("#gjjnll").val(lilv.gjjdk_le_5year);
    } else if (obj == "sy") {
        $("#sydkje").val("100");
        $("#sydkqx").val("20");
        $("#syjzll").val("0");
        $("#synll").val(lilv.sydk_gt_5year);
    } else {
        alert("错误的操作!");
    }
}

// 组合计算器
function zhchange(obj) {
    var select = obj.value;
    if (select <= 1) {
        $("#zhsynll").val(lilv.sydk_ge_1year);
        $("#zhgjjnll").val(lilv.gjjdk_le_5year);
    } else if (select > 5) {
        $("#zhsynll").val(lilv.sydk_gt_5year);
        $("#zhgjjnll").val(lilv.gjjdk_gt_5year);
    } else {
        $("#zhsynll").val(lilv.sydk_gt_1year_and_le_5year);
        $("#zhgjjnll").val(lilv.gjjdk_le_5year);
    }
}

// 组合商业贷款选择折扣（基准利率）
function zhselect(obj) {
    var select = obj.value;
    var synll = lilv.sydk_gt_5year;
    var jieguo = 0;
    if (select == "0") {
        $("#zhsynll").val(synll);
    } else if (select < 5) {
        jieguo = select * synll;
        $("#zhsynll").val(jieguo.toFixed(2));
    } else {
        jieguo = select * synll / 10;
        $("#zhsynll").val(jieguo.toFixed(2));
    }
}

// 组合的计算
function zhsubmit() {
    $("#lilvbiao").hide();
    var zhgjjnlls = $("#zhgjjnll").val();
    var zhsynlls = $("#zhsynll").val();
    if (gjjjine == "" || syjine == "") {
        alert("请输入金额！");
    } else if (zhgjjnlls == "" || zhsynlls == "") {
        alert("请输入年利率！");
        $("#jieguo").hide();
    } else {
        // 组合公积金的贷款金额
        var gjjjine = $("#zhgjjdkje").val() * 10000;
        // 组合公积金的贷款利率
        var gjjlilv = $("#zhgjjnll").val() / 100;
        // 组合商业的贷款金额
        var syjine = $("#zhsydkje").val() * 10000;
        // 组合的贷款期限
        var zhqixian = $("#zhdkqx").val() * 12;
        // 组合商业的贷款利率
        var sylilv = $("#zhsynll").val() / 100;

        // 组合
        $("#jgbxdkze").text((gjjjine / 10000) + (syjine / 10000));	//本息贷款总额
        $("#jgbjdkze").text((gjjjine / 10000) + (syjine / 10000));	//本金贷款总额
        $("#jgbxdkqx").text(zhqixian);	//本息贷款期限
        $("#jgbjdkqx").text(zhqixian);	//本金贷款期限

        //（公积金）计算本息每期还款
        var gjjyuelilv = gjjlilv / 12;
        var gjjjgbxmqhk = (gjjjine * gjjyuelilv * (Math.pow(1 + gjjyuelilv, zhqixian))) / (Math.pow(1 + gjjyuelilv, zhqixian) - 1)
        //（商业）计算本息的每期还款
        var syyuelilv = sylilv / 12;
        var syjgbxmqhk = (syjine * syyuelilv * (Math.pow(1 + syyuelilv, zhqixian))) / (Math.pow(1 + syyuelilv, zhqixian) - 1)
        //（组合）本息的每期还款
        $("#jgbxmqhk").text((gjjjgbxmqhk + syjgbxmqhk).toFixed(2));
        //（公积金）计算本金的首月还款额
        var gjjjgbjsyhk = (gjjjine / zhqixian) + (gjjjine - (gjjjine / zhqixian) * (1 - 1)) * gjjyuelilv;
        //（商业）计算本金的首月还款额
        var syjgbjsyhk = (syjine / zhqixian) + (syjine - (syjine / zhqixian) * (1 - 1)) * syyuelilv;
        //（组合）本金的首月还款额
        $("#jgbjmqhk").text((gjjjgbjsyhk + syjgbjsyhk).toFixed(2));	//本金首期还款


        //（公积金）
        // 本息偿还本金
        var gjjbxchbj = 0;
        // 本息的剩余本金
        var gjjjgbxsybj = gjjjine;
        // 本金的剩余本金
        var gjjjgbjsybj = gjjjine;
        // 本金的还款总额
        var gjjjgbjhkze = 0;
        //（商业）
        // 本息偿还本金
        var sybxchbj = 0;
        // 本息的剩余本金
        var syjgbxsybj = syjine;
        // 本金的剩余本金
        var syjgbjsybj = syjine;
        // 本金的还款总额
        var syjgbjhkze = 0;

        // 清空table中的所有
        $("#addTable").html("");
        var str1 = "<tr style='background-color:#5bc6ff;height:30px;'>" +
            "<th rowspan='2' align='center' width='7%'>期次</th>" +
            "<th colspan='3'  align='center' width='46.5%'>等额本息</th>" +
            "<th colspan='3' align='center' width='46.5%'>等额本金</th>" +
            "</tr>" +
            "<tr style='background-color:#5bc6ff;'>" +
            "<td align='center'>偿还利息</td>" +
            "<td align='center'>偿还本金</td>" +
            "<td align='center'>剩余本金</td>" +
            "<td align='center'>偿还利息</td>" +
            "<td align='center'>每期还款</td>" +
            "<td align='center'>剩余本金</td>" +
            "</tr>";
        $("#addTable").append(str1);

        for (var i = 1; i < zhqixian + 1; i++) {
            //（公积金）
            // 本息偿还利息
            var gjjjgbxchlx = (gjjjine - gjjbxchbj) * gjjyuelilv;
            //（商业）
            // 本息偿还利息
            var syjgbxchlx = (syjine - sybxchbj) * syyuelilv;
            //（公积金）
            // 本息偿还本金
            var gjjjgbxchbj = gjjjgbxmqhk - gjjjgbxchlx;
            //（商业）
            // 本息偿还本金
            var syjgbxchbj = syjgbxmqhk - syjgbxchlx;
            //（公积金）
            // 本息剩余本金
            gjjjgbxsybj = gjjjgbxsybj - gjjjgbxchbj;
            gjjbxchbj = gjjbxchbj + gjjjgbxchbj;
            //（商业）
            // 本息剩余本金
            syjgbxsybj = syjgbxsybj - syjgbxchbj;
            sybxchbj = sybxchbj + syjgbxchbj;

            // 本金的计算
            //（公积金）
            // 已偿还本金累计额
            var gjjjgbjbjlje = (gjjjine / zhqixian) * i;
            //（商业）
            // 已偿还本金累计额
            var syjgbjbjlje = (syjine / zhqixian) * i;
            //（公积金）
            // 每月还款利息部分
            var gjjjgbjchlx = (gjjjine - (gjjjine / zhqixian) * (i - 1)) * gjjyuelilv;
            //（商业）
            // 每月还款利息部分
            var syjgbjchlx = (syjine - (syjine / zhqixian) * (i - 1)) * syyuelilv;
            //（公积金）
            // 每月还款本金部分
            var gjjjgbjhkbj = gjjjine / zhqixian;
            //（商业）
            // 每月还款本金部分
            var syjgbjhkbj = syjine / zhqixian;
            //（公积金）
            // 每期还款
            var gjjjgbjmqhk = gjjjgbjchlx + gjjjgbjhkbj;
            //（商业）
            // 每期还款
            var syjgbjmqhk = syjgbjchlx + syjgbjhkbj;

            //（商业）
            // 剩余本金
            var syjgbjsybj = 0;
            //（公积金）
            // 剩余本金
            var gjjjgbjsybj = 0;
            if (i == 1) {
                gjjjgbjsybj = gjjjine - gjjjgbjhkbj;
                syjgbjsybj = syjine - syjgbjhkbj;
            } else {
                gjjjgbjsybj = gjjjine - gjjjgbjbjlje;
                syjgbjsybj = syjine - syjgbjbjlje;
            }

            gjjjgbjhkze = gjjjgbjhkze + gjjjgbjmqhk;
            syjgbjhkze = syjgbjhkze + syjgbjmqhk;
            var qwe = (gjjjgbxsybj + syjgbxsybj).toFixed(2);
            var asd = (gjjjgbjsybj + syjgbjsybj).toFixed(2);
            if (asd == "-0.00") {
                asd = "0.00";
            }
            if (qwe == "-0.00") {
                qwe = "0.00";
            }
            var str = "<tr style='background-color:#ccc;'>" +
                "<td>" + i + "</td>" +
                "<td>" + (gjjjgbxchlx + syjgbxchlx).toFixed(2) + "</td>" +
                "<td>" + (gjjjgbxchbj + syjgbxchbj).toFixed(2) + "</td>" +
                "<td>" + qwe + "</td>" +
                "<td>" + (gjjjgbjchlx + syjgbjchlx).toFixed(2) + "</td>" +
                "<td>" + (gjjjgbjmqhk + syjgbjmqhk).toFixed(2) + "</td>" +
                "<td>" + asd + "</td>" +
                "</tr>";
            var strs = "<tr>" +
                "<td>" + i + "</td>" +
                "<td>" + (gjjjgbxchlx + syjgbxchlx).toFixed(2) + "</td>" +
                "<td>" + (gjjjgbxchbj + syjgbxchbj).toFixed(2) + "</td>" +
                "<td>" + qwe + "</td>" +
                "<td>" + (gjjjgbjchlx + syjgbjchlx).toFixed(2) + "</td>" +
                "<td>" + (gjjjgbjmqhk + syjgbjmqhk).toFixed(2) + "</td>" +
                "<td>" + asd + "</td>" +
                "</tr>";
            if (i % 2 == 0) {
                $("#addTable").append(str);
            } else {
                $("#addTable").append(strs);
            }

        }
        //（公积金）
        // 计算本息还款总额
        var gjjjgbxhkze = gjjjgbxmqhk * zhqixian;
        //（商业）
        var syjgbxhkze = syjgbxmqhk * zhqixian;
        //（组合）
        $("#jgbxhkze").text((gjjjgbxhkze + syjgbxhkze).toFixed(2));	//本息还款总额
        $("#jgbjhkze").text((gjjjgbjhkze + syjgbjhkze).toFixed(2));	//本金还款总额
        //（公积金）
        var gjjjgbjzflx = gjjjgbjhkze - gjjjine;
        var gjjjgbxzflx = gjjjgbxhkze - gjjjine;
        //（商业）
        var syjgbjzflx = syjgbjhkze - syjine;
        var syjgbxzflx = syjgbxhkze - syjine;
        //（组合）
        $("#jgbxzflx").text((gjjjgbxzflx + syjgbxzflx).toFixed(2));	//本息支付利息
        $("#jgbjzflx").text((gjjjgbjzflx + syjgbjzflx).toFixed(2));	//本金支付利息
        // 显示结果页
        $("#jieguo").show();
    }
}

// 组合重置
function zhresult() {
    $("#jieguo").hide();
    $("#lilvbiao").hide();
    $("#zhgjjdkje").val("50");
    $("#zhsydkje").val("100");
    $("#zhdkqx").val("20");
    $("#zhjzll").val("0");

    $("#zhgjjnll").val(lilv.gjjdk_gt_5year);
    $("#zhsynll").val(lilv.sydk_gt_5year);
}

// 利率表点击事件
function lilvbiao() {
    $("#jieguo").hide();
    $("#lilvbiao").show();
    $("#gjj1").text(lilv.gjjdk_le_5year);
    $("#gjj2").text(lilv.gjjdk_gt_5year);
    $("#sy3").text(lilv.sydk_ge_1year);
    $("#sy4").text(lilv.sydk_gt_1year_and_le_5year);
    $("#sy2").text(lilv.sydk_gt_5year);
}

// 控制输入框（判断只能输入数字和小数点后两位）
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是.
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
}