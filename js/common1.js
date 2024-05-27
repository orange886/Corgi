var Xkey = $("#key").val();
//搜索类
var SERSHOW=0;//控制是否显示搜索预览结果
var MySearch = {
    oldkey: Xkey,
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    selval: function (datas) {
        $("#ser_result").hide();
        $("#key").val(datas);
        $("#search").submit();
    },
    replaces: function (findstr, strs) {
        if (strs.length > 0) {
            return strs.replace(findstr, '<span>' + findstr + '</span>');
        }
    },
    getlist: function () {
        var newkey = this.trim($("#key").val());
        if (this.oldkey != newkey && newkey.length > 0) {
            $.ajax({
                url: "/search/selbox/" + newkey,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                success: function (data) {
                    if (data.status === "OK" && data.result) {
                        var html = "";
                        var counts = data.result.length;
                        if (counts > 0) {
                            html += "<ul>";
                            for (i = 0; i < counts; i++) {
                                html += "<a href=\"#\" class=\"sersel\" onclick=\"MySearch.selval('" + data.result[i] + "')\">" + MySearch.replaces(newkey, data.result[i]) + "</a>";
                            }
                            html += "</ul>";
                            $("#ser_result").html(html);
                            if (SERSHOW==0){
                                 $("#ser_result").show();
                            }
                        } else {
                            $("#ser_result").html("");
                            $("#ser_result").hide();
                        }
                    } else if (data.status === "FAIL" && data.errors) {
                        $("#ser_result").hide();
                    }
                }
            });
            this.oldkey = newkey;
        } else if (newkey.length == 0) {
            $("#ser_result").html("");
            $("#ser_result").hide();
        }
    }
};
/*去空格函数*/
function trim(str) {
    str = str.replace(/^(\s|\u00A0)+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
function SetCookie(a, b) {
    var c = 5,
            d = new Date;
    d.setTime(d.getTime() + 1e3 * 60 * 60 * 24 * c),
            document.cookie = a + "=" + escape(b) + ";expires=" + d.toGMTString() + ";path=/;"
}
function GetCookie(a) {
    var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
    return null != b ? unescape(b[2]) : ""
}
function DelCookie(a) {
    var c,
            b = new Date;
    b.setTime(b.getTime() - 1),
            c = GetCookie(a),
            null != c && (document.cookie = a + "=" + c + ";expires=" + b.toGMTString() + ";path=/;")
}
/*cookies*/
function GetCdcount() {
    var h, a;
    h = GetCookie("csid");
    a = GetCookie("dqid");
    $("#carlist_cs").html("");
    l = 0;
    c = 0;
    if (h != "") {
        arcsid = h.split(",");
        l = arcsid.length - 1;
    }
    if (a != "") {
        ardqid = a.split(",");
        k = ardqid.length - 1;
        var d = 0;
        var b = 0;
        c = k % 12 > 0 ? parseInt(k / 12) + 1 : parseInt(k / 12);
    }
    var tcount = 0;
    tcount = l + c;
    return tcount;
}
function trim(s) {
    return s.replace(/(^s*)|(s*$)/g, "");
}
function ShowCdQuantity() {
    var tmpc = GetCdcount();
    if (tmpc > 0) {
        $("#cdquantity").html(tmpc);
        $("#cdquantity").show();
    } else {
        $("#cdquantity").hide();
    }
}
function SearchInit() {
    $("#searchbt").click(function () {
        var tmpkeys = trim($("#key").val());      
        if (tmpkeys.length < 1) {
            Tips("请输入搜索的关键字或舞曲编号!", "searchbt");
            return;
        }
        document.getElementById("search").submit();
    });
    $("key").keyup(function () {
        SERSHOW=0;
    });
    if (SERSHOW==0){
        $("#inputbox").hover(function () {
            var thtml = $("#ser_result").html()
            if (thtml != "") {
                $("#ser_result").show();
            }
        }, function () {
            $("#ser_result").hide();
        });
    }else{
        $("#ser_result").hide();
    }
    setInterval("MySearch.getlist()", 200);
}

function BannerInit() {
    $(".se").hover(function () {
        $(this).find("ul:first-child").stop().attr("class", "banneron");
        //alert($(this).find("div:first").html());
        $(this).find("div:first").stop().show();
    }, function () {
        $(this).find("ul:first-child").stop().attr("class", "se banneroff");
        $(this).find("div:first").stop().hide();
    });
    $("#login_menu_in").hover(function () {
        $("#login_menu_zi").stop().show();
    }, function () {
        $("#login_menu_zi").stop().hide();
    });
    //SetCookie("qf_musiclog", ",|97739|,|97160|,|96938|,|96752|,|96649|,|96609|,|96392|,|96217|");
    PlayLogInit();

}


function PlayLogInit(){
    $("#playlog_menu").hover(function () {
        var tmp = $("#playlog_history_list").html();
        var musicids = GetCookie("qf_musiclog");
        if (tmp.length == 0 && musicids.length > 0) {
            $.ajax({
                type: "get",
                url: "/play/ajax/log",
                timeout: 10000,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#playlog_history_list").html("<a href='#' class='nolog'>无记录...</a>");
                },
                data: "ids=" + musicids,
                success: function (data) {
                    eval("var reobj=" + data);
                    html = "<div class='mc_class'>";                   
                    for (var i = 0; i < reobj.Data.length; i++) {
                        html += "<div class='mc1'><a href='/play/" + reobj.Data[i].id + ".html' target='_Pt'>"+ reobj.Data[i].musicname + "</a></div>"
                    }
                    html += '</div>';
                    if (reobj.Data.length > 0) {
                        html += "<div  style='height:40px;'><a href='javascript:void(0)' class='btn-hred' onclick='PlayLog.Clear()'"
                        html += "style='display:block;width:180px;margin: 0 auto; color:#e1e1e1;line-height:26px; height:26px;text-align:center'>"
                        html += "清空播放历史记录</a></div>";
                    }       
                    $("#playlog_history_list").html(html);
                }
            });
        }
        if (tmp.length == 0) {
            $("#playlog_history_list").html("<a href='#' class='nolog'>无记录...</a>");
        }
        $("#playlog_history").stop().show();
    }, function () {
        $("#playlog_history").stop().hide();
    });
    
}
//提示框
function Tips(curstr, ids) {
    layer.tips('<span class=\'Tips_class\'>' + curstr + '</span>', document.getElementById(ids));
}


function page_init(totalpage) {
    $("#tzs").hover(function () {
        $(this).attr("class", "subon");
    }, function () {
        $(this).attr("class", "suboff");
    });

    // objf.action = 
    $("#page_tzs").click(function () {
        var objf = document.getElementById("pform");
        var objt = document.getElementById("pagex");
        if (objt.value == "") {
            return false;
        }
        if (objt.value > totalpage) {
            return false;
        }
        location.href = objf.action.replace('@page', objt.value);
    })
}
function GetCode() {
    $("#imgcode").attr("src", "/user/code?t=" + new Date().getTime());
}

function CheckLogin() {   
        username=GetCookie("loginname");
        icon=GetCookie("icon");
        isvip=GetCookie("isvip");
        if (username!=''){
            html = "<table width=\"100\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"> <tr><td width=\"35\" align=left>";
            html += "<a href='/user/' target='user'><img src='" + icon + "' style='width:30px;border:0px;'>";
            if (isvip == 1) {
                html += "<p class='menu_isvip'><img src='/static/images/user/vip.gif' ></p>"
            }
            html += "</a></td>"
            html += "<td><div class='username_menu'><a href='/user/' target='user'>" + username + "</a></div>"
            html += "<div class='zhuxiao'><a href='javascript:void(0)' onclick='LoginExc.LoginOut();'>注销</a></div></td></tr></table>";
            $("#inlogin").html(html);
            $("#login_menu").hide();
            $("#login_menu_in").show();
        }else{
            $("#login_menu").show();
            $("#login_menu_in").hide();
        }
        /*$.ajax({
            url: "/user/check_login",
            xhrFields: {withCredentials: true},
            dataType: "json",
            success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 200:
                        html = "<table width=\"100\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"> <tr><td width=\"35\" align=left>";
                        html += "<a href='/user/' target='user'><img src='" + reobj.icon + "' style='width:30px;border:0px;'>";
                        if (reobj.isvip == 1) {
                            html += "<p class='menu_isvip'><img src='/static/images/user/vip.gif' ></p>"
                        }
                        html += "</a></td>"
                        html += "<td><div class='username_menu'><a href='/user/' target='user'>" + reobj.username + "</a></div>"
                        html += "<div class='zhuxiao'><a href='/user/login/login_out'>注销</a></div></td></tr></table>";
                        $("#inlogin").html(html);
                        $("#login_menu").hide();
                        $("#login_menu_in").show();
                        break;
                    case 500:
                        $("#login_menu").show();
                        $("#login_menu_in").hide();
                        break;
                    default :
                        $("#login_menu").show();
                        $("#login_menu_in").hide();
                        break;
                }
            }
        });*/

}

function FunFouces(act, lx) {
    if (act == "clear") {
        if (confirm("确定清空关注吗？")) {
            $.get("/user/fouces/clear?lx=" + lx, function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 101:
                        alert('清空关注失败!');
                        break;
                    case 200:
                        location.reload();
                        break;
                }
            });
        }
    } else {
        var selid = "";
        $(".sel").each(function () {
            if ($(this).prop("checked")) {
                (selid == "") ? selid = $(this).val() : selid += "," + $(this).val();
            }
        });
        if (selid == "") {
            alert('请先选择要取消关注的记录!')
        } else {
            $.get("/user/fouces/del?lx=" + lx + "&selid=" + selid, function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 101:
                        alert('取消关注失败!');
                        break;
                    case 200:
                        location.reload();
                        break;
                }
            });
        }
    }
}
//取消CD订单
function DoCannel(ci, rid) {
    layer.confirm('确认要取消此订单吗？', {
        btn: ['确认', '取消'], //按钮
        title: '取消订单提示'
    }, function () {
        $.get("/user/" + ci + "/set?action=cancel&orderid=" + rid, function (data) {
            if (data.search('成功') == -1) {
                AlertRe(data, 0);
            } else {
                AlertRe(data, 1);
                setTimeout('location.reload()', 2000);
            }
        });
    }, function () {
        return;
    });
}

function FavShare(curid) {
    $.ajax({
        url: "/user/fav/share?id=" + curid,
        xhrFields: {withCredentials: true},
        dataType: "json",
        success: function (data) {
            eval('data=' + data);
            if (data.Result == 200) {
                AlertRe('分享成功！', 1);
            } else if (data.Result == 201) {
                AlertRe('分享成功,待审核后显示', 1);
            } else if (data.Result == 101) {
                AlertRe('错误的音乐盒参数', 0);
            } else if (data.Result == 103) {
                AlertRe('请修改音乐和名字再分享', 0);
            } else if (data.Result == 102) {
                AlertRe('分享的音乐和最少要有10首舞曲', 0);
            } else if (data.Result == 104) {
                AlertRe('请重新上传音乐盒图片', 0);
            }
        }
    });
}

function DelFav(id) {
    layer.confirm('确认要删除音乐盒吗？', {
        btn: ['确认', '取消'], //按钮
        title: '删除音乐盒'
    }, function () {
        $.get("/user/fav/del?id=" + id, function (data) {
            if (data.search('成功') == -1) {
                AlertRe(data, 0);
            } else {
                AlertRe(data, 1);
                setTimeout('location.reload()', 2000);
            }
        });
    }, function () {
        return;
    });
}


//会员收货地址表单获取
function AddressGetSel(action, thenum, objs, oldvalue) {
    $.get("/user/address/get?action=" + action + "&aid=" + thenum + "&oid=" + oldvalue, function (data) {
        document.getElementById(objs).innerHTML = data;
    });
}

function AddressDel(thenum) {
    layer.confirm('确认删除选中的地址吗？', {
        btn: ['确认', '取消'], //按钮
        title: '删除提示'
    }, function () {
        $.get("/user/address/save?action=del&aid=" + thenum, function (data) {
            if (data.search('成功') == -1) {
                AlertRe(data, 0);
            } else {
                AlertRe(data, 1);
                setTimeout('location.reload()', 2000);
            }
        });
    }, function () {
        return;
    });
}

//会员收货地址表单检测
function AddressChecks() {
    if ($("#provinces").val().length == 0) {
        Alert("请选择所属省份", 0);
        $("#provinces").focus();
        return false;
    }
    if ($("#citys").val().length < 1) {
        Alert("请选择所属城市", 0);
        $("#citys").focus();
        return false;
    }
    if ($("#areas").val().length < 1) {
        Alert("请选择所属县/区", 0);
        $("#areas").focus();
        return false;
    }
    if ($("#address").val().length < 5) {
        Alert("请正确填写收货地址", 0);
        $("#address").focus();
        return false;
    }
    if ($("#consignee").val().length < 2) {
        Alert("请正确填写收货人", 0);
        $("#consignee").focus();
        return false;
    }
    if ($("#mobile").val().length != 11 || $("#mobile").val().search("1") != 0) {
        Alert("请正确输入手机号码", 0);
        $("#mobile").focus();
        return false;
    }
    document.getElementById("frm_order").submit();
}
//全局带错误
function AlertRe(curct, num) {
    if (num == 0) {
        curct = "<span style='color:#d7880c;font-size:14px;'>" + curct + "</span>";
    } else {
        curct = "<span style='color:#03947c;font-size:14px;'>" + curct + "</span>";
    }
    layer.msg(curct, {time: 3000, icon: num});
}
//全局提示
function Alert(curct) {
    curct = "<span style='color:#d7880c;font-size:14px;'>" + curct + "</span>";
    layer.msg(curct, {time: 3000, icon: 0});
    return false;
}

function AddressSetDefault(num) {
    $.get("/user/address/save?action=setmoren&aid=" + num, function (data) {
        style = 0;
        (data.search('成功') == -1) ? style = 0 : style = 1;
        AlertRe(data, style);
    });

}

function FavAdd() {
    var boxname = $("#cname").val()
    if (boxname.length == 0) {
        AlertRe("音乐盒名称不合规范(2-50)位!", 0);
        return false
    }
    $.get("/user/fav/addsave?cname=" + boxname, function (data) {
        var re = trim(data);
        eval("var reobj=" + re);
        switch (reobj.Result) {
            case 101:
                AlertRe("音乐盒名称不合规范(2-50)位!", 0);
                break;
            case 500:
                AlertRe("登录已失效", 0);
                break;
            case 102:
                AlertRe("您最多只能创建10个音乐盒!", 0);
            case 200:
                location.href = '/user/fav';
            default :
        }
    });

}

function FavEdit() {
    var boxname = $("#cname").val()
    var boxid = $("#boxid").val()
    if (boxname.length == 0) {
        alert("请填写音乐盒名称");
        return false
    }
    $.get("/user/fav/editsave?cname=" + boxname + "&id=" + boxid, function (data) {
        var re = trim(data);
        eval("var reobj=" + re);
        switch (reobj.Result) {
            case 101:
                AlertRe("音乐盒名称不合规范(2-50)位!", 0);
                break;
            case 500:
                AlertRe("登录已失效", 0);
                break;
            case 102:
                AlertRe("您最多只能创建10个音乐盒!", 0);
            case 200:
                location.href = '/user/fav';
            default :
        }
    });
}

function MenuSetC(num, curboj, color1, color2) {
    for (i = 1; i <= num; i++) {
        var $boj = $("#" + curboj + i);
        aa = $boj.prop('className').search('back');
        if (aa > 0) {
            $boj.attr('style', 'color:' + color1);
        } else {
            $boj.attr('style', 'color:' + color2);
        }
    }
}

var FAV = {
    IsHide: 0,
    SetIsHide: function (auid) {
        this.IsHide = auid;
    },
    Boxid: 0, Musicid: 0,
    SetBoxid: function (curid, curname) {
        this.Boxid = curid;
        $("#selid").html(curname);
        $("#selboxct ul").each(function () {
            if (this.id == "box" + curid) {
                this.className = "selboxctcls";
            } else {
                this.className = "";
            }
        });

    },
    SetMusicid: function (curyid) {
        this.Musicid = curyid;
    },
    SelFav: function (id) {
        $.ajax({url: "/user/fav/selbox?musicid=" + id, success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 101:
                        break;
                    case 200:
                        FAV.SetMusicid(id);
                        var selhtml = ""
                        selhtml += "<div class='favpad' id='favct'><div class='favmusicname'>" + reobj.MusicName + "</div>";
                        selhtml += "<div class='selbox'>收藏到：<span id='selid'></span></div><div id='selboxct'>";
                        var exeu = "";
                        var selboxid, selboxname;
                        for (var i = 0; i < reobj.Total; i++) {
                            if (i == reobj.Total - 1) {
                                selboxid = reobj.FavList[i].ID;
                                selboxname = reobj.FavList[i].Cname;
                            }
                            selhtml += "<ul id='box" + reobj.FavList[i].ID + "'><a href=\"javascript:void(0)\" onclick=\"FAV.SetBoxid(" + reobj.FavList[i].ID + ",'" + reobj.FavList[i].Cname + "')\">" + reobj.FavList[i].Cname + "<span>(" + reobj.FavList[i].Counts + ")</span></a></ul>";
                        }
                        selhtml += "</div>";
                        selhtml += "<div class='favaddmenu'><input name=\"boxname\" type=\"text\" id=\"boxname\" size=\"50\" maxlength=\"50\" class='favinput' placeholder=\"新增音乐盒名称2-50位字符\"/>";
                        selhtml += "<input type=\"button\" name=\"button\" id=\"button\" value=\"添加并使用\" onclick=\"FAV.AddBox()\" class='favbutton'  /></div>";
                        selhtml += "<div class='favcontorl' ><ul><input type=\"button\" name=\"button\" id=\"button\" value=\"确定收藏\" class='btn btn-sm btn-danger' onclick=\"FAV.Save()\"/>";
                        selhtml += "<input type=\"button\" name=\"button\" id=\"button\" value=\"取消收藏\" class='btn btn-sm btn-warning' onclick=\"FAV.Hide()\"/></ul><ul id='tshtml'></ul></div></div>";

                        divct = '<div id="favbox" >';
                        divct += '<ul><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        divct += '<td id="sccontent">' + selhtml + '</td>';
                        divct += '</tr></table></ul></div>';
                        FAV.layname = layer.open({
                            type: 1,
                            title: "加入音乐盒",
                            skin: 'layui-layer-rim', //加上边框
                            area: ['520px', '340px'], //宽高
                            content: divct
                        });
                        FAV.SetBoxid(selboxid, selboxname);
                        break;
                    default :
                }

            }});
    },
    ShowMsg: function (num, curstr) {
        $("#tshtml").html("<div class='e" + num + "'>" + curstr + "</div>");
    },
    Loading: function () {
        $("#tshtml").html("<img src='/static/images/load_w.gif'>");
    },
    AddBox: function () {
        this.Loading();
        boxname = $("#boxname").val();
        if (boxname.length < 2) {
            this.ShowMsg(0, "音乐盒名称不合规范(2-50)位!");
            return false;
        }
        $.ajax({url: "/user/fav/addsave?cname=" + boxname,
            success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 101:
                        FAV.ShowMsg(0, "音乐盒名称不合规范(2-50)位!");
                        break;
                    case 102:
                        FAV.ShowMsg(0, "您最多只能创建10个音乐盒!");
                    case 200:
                        layer.close(FAV.layname);
                        var thisid = FAV.Musicid;
                        FAV.SelFav(thisid);
                    default :
                }
            }
        });

    },
    Save: function () {
        this.Loading();
        var musicid = this.Musicid;
        var boxid = this.Boxid;
        $.ajax({url: "/user/musicbox/addmusic?musicid=" + musicid + "&boxid=" + boxid, success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 101:
                        FAV.ShowMsg(0, reobj.Info)
                        break;
                    case 200:
                        layer.close(FAV.layname);
                        if (reobj.Result == 200) {
                            var htmls = '<div class="cor33">' + reobj.MusicName + "已收藏成功！<a href=/user/musicbox?id=" + boxid + " style='color:green'>查看</a></div>";
                            AlertRe(htmls, 1)
                        } else {
                            Alert(reobj.Info)
                        }
                        break;
                    default :
                }
            }, error: function () {
                Alert("请求超时，请重试!");
                FAV.Hide();
            }
        });
    },
    Hide: function () {
        layer.close(FAV.layname);
    },
    MoveSel: function (thisboxid) {
        var selmusicid = ""
        $(".idc").each(function () {
            if ($(this).prop("checked")) {
                if (selmusicid == "") {
                    selmusicid = $(this).val()
                } else {
                    selmusicid += "," + $(this).val();
                }
            }
        });

        if (selmusicid != "") {
            $.ajax({url: "/user/fav/selbox", success: function (data) {
                    eval("var reobj=" + data);
                    if (reobj.Result == 200) {
                        var sstr;
                        if (selmusicid.search(",") > -1) {
                            arr = selmusicid.split(",");
                            mcount = arr.length;
                        } else {
                            mcount = 1;
                        }
                        if (mcount > 6) {
                            sstr = mcount + "首";
                        } else {
                            sstr = selmusicid;
                        }
                        var selhtml = "<div class='favmusicname'>已选舞曲：" + sstr + "</div>";
                        selhtml += "<div class='selbox'>移动到：<span id='selid'></span></div><div id='selboxct'>";
                        for (var i = 0; i < reobj.Total; i++) {
                            if (i == reobj.Total - 1) {
                                selboxid = reobj.FavList[i].ID;
                                selboxname = reobj.FavList[i].Cname;
                            }
                            selhtml += "<ul id='box" + reobj.FavList[i].ID + "'><a href=\"javascript:void(0)\" onclick=\"FAV.SetBoxid(" + reobj.FavList[i].ID + ",'" + reobj.FavList[i].Cname + "')\">" + reobj.FavList[i].Cname + "<span>(" + reobj.FavList[i].Counts + ")</span></a></ul>";
                        }
                        selhtml += "</div><div class='favmovecontorl' ><ul><input type=\"button\" name=\"button\" id=\"button\" value=\"确定移动\" class='btn btn-sm btn-danger' onclick=\"FAV.MoveSave('" + selmusicid + "','" + thisboxid + "')\"/>";
                        selhtml += "&nbsp;&nbsp;<input type=\"button\" name=\"button\" id=\"button\" value=\"取消\" class='btn btn-sm btn-warning' onclick=\"HideScbox()\"/></ul><ul id='tshtml'></ul></div></div>";

                        divct = '<div id="scshow" >';
                        divct += '<ul><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        divct += '<td id="sccontent">' + selhtml + '</td>';
                        divct += '</tr></table></ul></div>';
                        FAV.layname = layer.open({
                            type: 1,
                            title: "音乐盒舞曲转移",
                            skin: 'layui-layer-rim', //加上边框
                            area: ['520px', '320px'], //宽高
                            content: divct
                        });


                    }
                }});


        } else {
            Alert('请先选择舞曲!')
        }
    },
    layname: '',
    MoveSave: function (curmusicid, oldbox) {
        this.Loading();
        if (this.Boxid == 0) {
            this.ShowMsg(0, '请选择目标音乐盒!')
        } else {
            var newbox = this.Boxid;
            $.ajax({url: "/user/fav/movebox?oldbox=" + oldbox + "&newbox=" + newbox + "&musicid=" + curmusicid,
                success: function (data) {
                    eval("var reobj=" + data);
                    layer.close(FAV.layname);
                    if (reobj.Result == 200) {
                        AlertRe('转移成功!', 1)
                        setTimeout('location.reload()', 1000);
                    } else {
                        Alert(reobj.Info)
                    }
                }
            });

        }
    }
}

var PubLay = {
    name: "",
    close: function () {
        layer.close(this.name);
    }
}


/*
 * @class CDCAR
 * @type type
 */
var CDCAR = {
    PutCar: function (a, b) {//a=舞曲ID，b=1为串烧，0为单曲
        "" != a && (1 == b ? (tmpcsid = GetCookie("csid"), "" != tmpcsid ? tmpcsid += a + "," : tmpcsid = a + ",",
                SetCookie("csid", tmpcsid), this.AlertS(a, 1)) : (tmpdqid = GetCookie("dqid"), "" != tmpdqid ? tmpdqid += a + "," : tmpdqid = a + ",",
                SetCookie("dqid", tmpdqid), this.AlertS(a, 1)));
    },
    GetCdCount: function () {//返回CD碟数
        var h, a;
        h = GetCookie("csid");
        a = GetCookie("dqid");
        $("#carlist_cs").html("");
        l = 0;
        c = 0;
        if (h != "") {
            arcsid = h.split(",");
            l = arcsid.length - 1;
        }
        if (a != "") {
            ardqid = a.split(",");
            k = ardqid.length - 1;
            var d = 0;
            var b = 0;
            c = k % 12 > 0 ? parseInt(k / 12) + 1 : parseInt(k / 12);
        }
        var tcount = 0;
        tcount = l + c;
        return tcount;
    },
    ShowCdQuantity: function () {//更新导航中CD的数量
        var tmpc = this.GetCdCount();
        if (tmpc > 0) {
            $("#cdquantity").html(tmpc);
            $("#cdquantity").show();
        } else {
            $("#cdquantity").hide();
        }
    },
    AlertS: function (a, b) {//a=提示内容，b=成功还是失败
        var c, d, e, f = 0, g = 0, h = 0, i = GetCookie("csid"), j = GetCookie("dqid");
        switch ("" != i && (arcsid = i.split(","), f = arcsid.length - 1), "" != j && (ardqid = j.split(","),
                g = ardqid.length - 1, h = g % 12 > 0 ? parseInt(g / 12) + 1 : parseInt(g / 12)),
                c = f + h, b) {
            case 0:
                AlertRe("<div class='car_tip0'>舞曲“<span>" + a + "</span>”您之前已经添加过了...<br>您待刻录的CD共有“<span>" + c + "</span>”张!</div>", 0);
                break;
            case 1:
                AlertRe("<div class='car_tip1'>舞曲“<span>" + a + "</span>”已成功加入待刻录...<br>您待刻录的CD共有“<span>" + c + "</span>”张!</div>", 1);
        }
        this.ShowCdQuantity();

    },
    CsTitle: "",
    DqTitle: "",
    GetMusicTitle: function () {//根据舞曲ID获取所有的舞曲名称
        var a, b, c = GetCookie("csid"), d = GetCookie("dqid");
        $.ajax({
            type: "GET",
            async: false,
            url: "/car/ajax/getmusic?csid=" + c + "&dqid=" + d,
            dataType: "json",
            success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                CDCAR.CsTitle = reobj.csname;
                CDCAR.DqTitle = reobj.dqname;
            }
        });

    },
    DelCar: function (a, b, c) {//删除舞曲a=舞曲ID,b=是否串烧，c=排序号
        if (1 == b) {
            for (tmpcsid = GetCookie("csid"), arrid = tmpcsid.split(","), tmpcsid = "", j = 0; j < arrid.length - 1; j++)
                a == arrid[j] && j == c || (tmpcsid += arrid[j] + ",");
            "" == tmpcsid ? DelCookie("csid") : SetCookie("csid", tmpcsid);
        } else {
            for (tmpdqid = GetCookie("dqid"), arrid = tmpdqid.split(","), tmpdqid = "", j = 0; j < arrid.length - 1; j++)
                a == arrid[j] && j == c || (tmpdqid += arrid[j] + ",");
            "" == tmpdqid ? DelCookie("dqid") : SetCookie("dqid", tmpdqid);
        }
        this.ShowCar();
    },
    GetCsCf: function (a) {//a=舞曲ID,检测串烧是否重复
        var b, c;
        for (tmpcsid = GetCookie("csid"), arrid = tmpcsid.split(","), b = 0, c = 0, c = 0; c < arrid.length - 1; c++)
            a == arrid[c] && (b += 1);
        return b > 1 ? '<span style="background-color:#FF0000; color:#FFFFFF; padding:3px; margin:2px;">有重复</span>' : "";
    },
    GetDqCf: function (a) {//a=舞曲ID,检测单曲是否重复
        var b, c;
        for (tmpdqid = GetCookie("dqid"), arrid = tmpdqid.split(","), b = 0, c = 0, tmpdqid = "",
                c = 0; c < arrid.length - 1; c++)
            a == arrid[c] && (b += 1);
        return b > 1 ? '<span style="background-color:#FF0000; color:#FFFFFF; padding:3px; margin:2px;">有重复</span>' : "";
    },
    ShowCar: function () {//显示购物车的CD订单
        var a, b, c, d, e, f, g, h, k, l, m;
        if (this.GetMusicTitle(), d = 0, e = 0, f = 0, a = GetCookie("csid"), b = GetCookie("dqid"),
                $("#carlist_cs").html(""), "" != a) {
            for (arcsid = a.split(","), arcstitle = this.CsTitle.split(","), d = arcsid.length - 1,
                    c = "", i = 0; d > i; i++)
                c += "<table cellspacing='0' cellpadding='0' class='cdlist'><tr><td class='cdnum' >" + (i + 1) + ".</td><td><div class='chuanshao'><ul><li class='num'>01</li><li class='musicid'>" + arcsid[i] + "</li><li class='music'><a href='/play/" + arcsid[i] + ".html' target='_blank' >" + arcstitle[i] + "</a>" + this.GetCsCf(arcsid[i]) + "</li><p class='dqs'></p><p class='dqx'></p><p class='pdel' onclick='CDCAR.DelCar(" + arcsid[i] + ",1," + i + ")'></p></ul></div></td></tr></table>";
            $("#carlist_cs").html(c);
        }
        if ($("#carlist_dq").html(""), "" != b) {
            for (ardqid = b.split(","), ardqtitle = this.DqTitle.split(","), e = ardqid.length - 1,
                    dqhtml = "", g = 0, h = 0, k = 0, f = e % 12 > 0 ? parseInt(e / 12) + 1 : parseInt(e / 12),
                    0 != e % 12 && (isfull = !1), i = 1; f >= i; i++) {
                for (dqcs = e % 12 > 0 && i == f ? "emptycd" :"fullcd", dqhtml += "<table cellspacing='0' cellpadding='0' class='cdlist'><tr><td class='cdnum' valign='top'>" + (i + d) + ".</td><td><div class='danqu " + dqcs + "'>",
                        j = 0; 11 >= j; j++)
                    h = 10 > j + 1 ? "0" + (j + 1) : j + 1, dqhtml += e >= g && "" != ardqid[g] ? "<ul><li class='numon'>" + h + "</li><li class='musicid'>" + ardqid[g] + "</li><li class='music'><a href='/play/" + ardqid[g] + ".html' target='_blank' >" + ardqtitle[g] + "</a>" + this.GetDqCf(ardqid[g]) + "</li><p class='dqs' onclick='CDCAR.PxCar(" + ardqid[g] + ",-1)'></p><p class='dqx' onclick='CDCAR.PxCar(" + ardqid[g] + ",1)'></p><p class='pdel'onclick='CDCAR.DelCar(" + ardqid[g] + ",0," + k + ")'></p></ul>" : "<ul><li class='numoff'>" + h + "</li><li class='musicid'>未选</li><li class='music'>未选</li></ul>",
                            k += 1, g += 1;
                dqhtml += "</td></tr></table>";
            }
            $("#carlist_dq").html(dqhtml);
        }
        l = 0, m = "", cdcount = d + f, $("#cartitleInfo").html("您的购物车共有<span> " + (d + e) + " </span>条舞曲，合计<span> " + cdcount + " </span>张CD"),
                cdcount >= 2 ? (l = cdcount >= 10 ? 20 * cdcount : cdcount > 2 ? 25 * cdcount : 50,
                        m = "您共需要支付 <span>" + l.toFixed(2) + "</span> 元", $("#addorder").prop("class", "btn btn-danger"),
                        $("#addorder").prop("disabled", "")) : (m = "您最少要选购<span> 2 </span>张CD才能购买...", $("#addorder").prop("class", "btn btn-default"),
                $("#addorder").prop("disabled", "disabled")), $("#buyInfo").html(m), this.LoadCss();
    },
    LoadCss: function () {//加载样式
        $(".danqu > ul:even").attr("style", "background-color:#e7e8eb"), $(".danqu > ul").hover(function () {
            $(this).attr("style", "background-color:#e7e8eb");
        }, function () {
            $(this).attr("style", "background-color:none"), $(".danqu > ul:even").attr("style", "background-color:#e7e8eb");
        }), $(".danqu > ul").hover(function () {
            $(this).attr("style", "background-color:#cccccc");
        }, function () {
            $(this).attr("style", "background-color:none"), $(".danqu > ul:even").attr("style", "background-color:#e7e8eb");
        }), $(".danqu ul .dqs").hover(function () {
            $(this).attr("style", "background-image:url(/static/images/car/dqs.gif)");
        }, function () {
            $(this).attr("style", "background-image:url(/static/images/car/dqs_off.gif)");
        }), $(".danqu ul .dqx").hover(function () {
            $(this).attr("style", "background-image:url(/static/images/car/dqx.gif)");
        }, function () {
            $(this).attr("style", "background-image:url(/static/images/car/dqx_off.gif)");
        }), $(".pdel").hover(function () {
            $(this).attr("style", "background-image:url(/static/images/car/carclo.gif)");
        }, function () {
            $(this).attr("style", "background-image:url(/static/images/car/carclo_off.gif)");
        });
    },
    PxCar: function (a, b) {
        var c, d, e, f, g = "", h = GetCookie("dqid");
        for (ardqid = h.split(","), dqcout = ardqid.length - 1, e = 0, c = 0; dqcout > c; c++)
            parseInt(a) == parseInt(ardqid[c]) && (e = c);
        for (f = e + b, - 1 == f && (f = dqcout - 1), f == dqcout && (f = 0), f > - 1 && dqcout > f && (tmpid = ardqid[f],
                ardqid[f] = ardqid[e], ardqid[e] = tmpid), d = 0; dqcout > d; d++)
            g += ardqid[d] + ",";
        SetCookie("dqid", g), this.ShowCar();
    }

}


/*
 * @class 登录类
 * @type type
 */
var LoginExc = {
    Fun: "",
    Chk: function (curname) {
        this.Fun = curname;
        $.ajax({url: "/user/check_login",
            success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                switch (reobj.Result) {
                    case 500:
                        LoginExc.MinLogin();
                        break;
                    case 200:
                        if (this.Fun != '') {
                            eval(LoginExc.Fun);
                        }
                        break;
                    default :
                }
            },
            error: function () {
                Alert("请求超时，请重试!");
            }
        });

    },
    MinLogin: function () {
        tmpusername = GetCookie('tmpusername');
        var login_html = "<form action=\"/user/login/ajax_chk\" name=\"loginfrom\" id=\"loginfrom\" method=\"post\" onsubmit=\"LoginExc.AjaxLogin();return false\">";
        login_html += "<div class=\"logincontent\"><ul ><img src=\"/static/images/min_login/tx_ico.gif\" class=\"login_ico\"></ul>";
        login_html += "<ul><li id=\"info\"></li></ul>";
        login_html += "<ul class=\"h50\"><input name=\"username\" type=\"text\" class=\"login_input\" id=\"username\" maxlength=\"30\" placeholder=\"帐号名\" /";
        if (tmpusername.length > 4 && tmpusername.length < 20) {
            login_html += " value=\"" + tmpusername + "\"";
        }
        login_html += " ></ul><ul class=\"h50\"><input name=\"password\" type=\"password\" class=\"login_input\" id=\"password\" maxlength=\"30\"placeholder=\"密码\"  /></ul>";
        login_html += "<ul id=\"loginyz\" class=\"h50\"><input name=\"code\" type=\"text\" class=\"login_input\" id=\"code\" maxlength=\"5\" style=\"width:80px;\"/>";
        login_html += "<img src=\"/static/images/code.gif\" id=\"imgcode\" align=\"absmiddle\" onclick=\"GetCode();\"/> &nbsp;<span><a href=\"#\" onclick=\"GetCode();\">看不清楚？</a></span></ul>";
        login_html += "<ul><li class='reg'><a href=\"/user/reg\" target=\"_blank\">注册新帐号</a></li><li class=\"getpwd\"><a href=\"/user/getpwd\">取回密码</a></li></ul>";
        login_html += "<ul id=\"loginbt\" class=\"h50\"><input name=\"button\" type=\"submit\" class=\"login_botton\" id=\"button\" value=\"立即登录\" /></li></ul>";
        login_html += "<input type=\"hidden\" Name=\"pixel\" value=\" " + screen.width + " x " + screen.height + "\">";
        login_html += "<ul id=\"logind3\"><span onClick=\"LoginExc.QqLogin()\" style=\"cursor:pointer\" >";
        login_html += "<img src=\"/static/images/qq.gif\" width=30 height=30 align=absmiddle border=0 /> 使用QQ登录</span> &nbsp; &nbsp; ";
        login_html += "<span  onClick=\"LoginExc.WxLogin()\" style=\"cursor:pointer\" >";
        login_html += "<img src=\"/static/images/wx.gif\" width=30 height=30 align=absmiddle  style=\"cursor:pointer\" /> 使用微信登录</span>";
        login_html += "</ul></div><div style=\"height:20px;\"></div></form> ";
        PubLay.name = layer.open({
            content: login_html,
            type: 1,
            title: '用户登录',
            skin: 'layui-layer-rim', //加上边框
            area: ['330px', ''] //宽高             
        });

    },
    AjaxLogin: function () {
        var infoObj = document.getElementById('info');
        if ((document.getElementById("username").value.match(/\s/) !== null) || (document.getElementById("username").value.length < 4)) {
            infoObj.innerHTML = '用户名内不含空格，且不小于四位';
            $("#username").focus();
            $("#username").val("");
            return
        }
        var pwd = /^[A-Za-z0-9_]{5,16}$/;
        if (!pwd.test(document.getElementById("password").value)) {
            infoObj.innerHTML = '请正确填写密码';
            $("#password").focus();
            $("#password").val("");
            return
        }
        infoObj.innerHTML = '<img src="/static/images/load_w.gif" align="absmiddle"/>&nbsp;正在提交...';
        $.post("/user/login/ajax_chk", $("#loginfrom").serialize(),
                function (data) {
                    eval("var reobj=" + data);
                    if (reobj.Result == "200") {
                        PubLay.close();
                        LoginExc.LoginSetInfo(reobj.UserId,reobj.UserName,reobj.Icon,reobj.IsVip);
                        SetCookie('tmpusername',reobj.UserName);
                        if (LoginExc.Fun != '') {                         
                            eval(LoginExc.Fun);
                        } else {                                 
                            location.reload();
                        }
                    } else {
                        $("#info").html(reobj.Info);
                    }
                    if (reobj.Result == "101") {
                        $("#info").html(reobj.Info);
                        $("#loginyz").show();
                        GetCode();
                    }
                    if (reobj.Result == "102" || reobj.Result == "103" || reobj.Result == "105") {
                        $("#info").html(reobj.Info);
                        $("#password").val("");
                        $("#password").focus();
                    }
                });
    },
    QqLogin: function () {
        PubLay.close();
        reurl = '';
        if (parent.location.href != null) {
            reurl = parent.location.href;
        }
        parent.PubLay.name = parent.layer.open({
            content: '/user/loginqq?gourl=' + reurl,
            type: 2,
            title: 'QQ登录',
            skin: 'layui-layer-demo', //加上边框
            area: ['720px', '630px'] //宽高             
        });
    },
    WxLogin: function () {
        reurl = '';
        if (parent.location.href != null) {
            reurl = parent.location.href;
        }
        var url = '/user/loginwx?gourl=' + reurl;                            //转向网页的地址; 
        var name = '第三方登录';                    //网页名称，可为空; 
        var iWidth = 500;                          //弹出窗口的宽度; 
        var iHeight = 500;                         //弹出窗口的高度; 
        //获得窗口的垂直位置 
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        //获得窗口的水平位置 
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
        PubLay.close();
    },
    OpenWin: function (curl) {


    },LoginSetInfo:function(cur_userid,cur_username,cur_icon,cur_isvip){
         SetCookie("loginid",cur_userid); 
         SetCookie("loginname",cur_username); 
         SetCookie("icon",cur_icon); 
         SetCookie("isvip",cur_isvip); 
    }
    ,LoginOut:function(){
         $.ajax({url: "/user/login/login_out",
            success: function (data) {
                var re = trim(data);
                eval("var reobj=" + re);
                if (reobj.Result==200) {                   
                    SetCookie("loginid",""); 
                    SetCookie("loginname",""); 
                    SetCookie("icon",""); 
                    SetCookie("isvip",""); 
                    location.reload();
                }
            },
            error: function () {
                Alert("请求超时，请重试!");
            }
        });      
    }
}

function DownLoad(musicid) {
    layer.open({
        id: "down119",
        type: 2,
        title: '舞曲下载',
        skin: 'demo-black-class',
        area: ['520px', '630px'],
        fixed: false, //不固定
        maxmin: false,
        content: '/down?id=' + musicid
    });
}

var PlayLog = {
    Add: function (curmusicid) {
        if (isNaN(curmusicid) == false) {
            var tmpmusicid = GetCookie("qf_musiclog");
            var tmusicid = ",|" + curmusicid + "|";
            if (tmpmusicid.indexOf(tmusicid) == -1) {
                tmpmusicid = tmpmusicid + tmusicid;
                SetCookie("qf_musiclog", tmpmusicid);
            }
        }
    }, Del: function (curmusicid) {
        if (isNaN(curmusicid) == false) {
            var tmpmusicid = GetCookie("qf_musiclog");
            var tmusicid = "|" + curmusicid + "|,";
            if (tmpmusicid.indexOf(tmusicid) != -1) {
                tmpmusicid = tmpmusicid.replace(tmusicid, "");
                SetCookie("qf_musiclog", tmpmusicid);
            }
        }
    },
    Clear: function (curmusicid) {
        SetCookie("qf_musiclog", '');
        $("#playlog_history_list").html("<a href='#' class='nolog'>无记录...</a>");
        AlertRe('已清空您的历史播放记录', 1);
    }
}

var PAYCLS = {
    CrOrder: function (form_name, iswx) {
        if (iswx == 1) {
            var lload = layer.load(0, {shade: false});
            $.ajax({
                type: "POST",
                url: "/pay/index/crorder",
                data: $("#" + form_name).serialize(),
                dataType: "json",
                success: function (data) {
                    eval("var reobj=" + data);
                    layer.close(lload);
                    if (reobj.orderid != '') {
                        layer.open({
                            id: "wxpay",
                            type: 2,
                            title: '微信扫码支付',
                            area: ['600px', '450px'],
                            fixed: false, //不固定
                            maxmin: false,
                            content: "/pay/weixin?orderid=" + reobj.orderid
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        } else {
            document.getElementById('payali').submit();
        }
    }, OpenPay: function (cur_orderid, iswx) {
        if (iswx == 1) {
            layer.open({
                id: "wxpay",
                type: 2,
                title: '微信扫码支付',
                area: ['620px', '500px'],
                fixed: false, //不固定
                maxmin: false,
                content: "/pay/crorder?orderid=" + cur_orderid
            });
        } else {
            location.href = "/pay/crorder?orderid=" + cur_orderid;
        }
    }
}


/*
 * @class 首页js
 * @type type
 */
var Disp = {
    //换一批
    Changeall:function(name){
        var mark = $('#' + name).attr('data-cge');
        var a = document.getElementById(name + '1');
        var b = document.getElementById(name + '2');
        var c = document.getElementById(name + '3');
        var n;
        if(mark == 1){
            a.style.display = 'none';
            b.style.display = 'block';
            c.style.display = 'none';
        }else if(mark == 2){
            a.style.display = 'none';
            b.style.display = 'none';
            c.style.display = 'block';
        }else if(mark == 3){
            a.style.display = 'block';
            b.style.display = 'none';
            c.style.display = 'none';
        }
        if( mark == 3){
            n = 1;
        }else{
            n = parseFloat(mark) + 1;
        }
        $('#' + name).attr('data-cge',n);
    },
    //推荐hover
    Detail:function(name){
        $('#' + name).find('ul').each(function(){
            $(this).find('li').each(function(){
                $(this).hover(
                    function(){
                        $('#' + name).find('ul').find('li').find('.index-music-bg').css({display:'none'});
                        $('#' + name).find('ul').find('li').find('.index-music-sm').css({display:'block'});
                        $(this).find('.index-music-bg').css({display:'block'});
                        $(this).find('.index-music-sm').css({display:'none'});
                    }
                );
            });
        });
    },
    //推荐部分二级更换
    Type:function(name1,name2,btn1,btn2,id){
        $('#' + name1).css('display','block');
        $('#' + btn1).addClass('btn-background-img').css('background-color','#D3320A');
        $('#' + name2).css('display','none');
        $('#' + btn2).removeClass('btn-background-img').css('background-color','#111111');
        $('#' + id).attr('onclick',"Disp.Changeall('" + name1 + "')");
        Disp.Href(name1,'clstype',0);
    },
    //推荐部分一级更换
    Classtype:function(){
        $("a[data-cls='clstype']").each(function(){
            $(this).click(function(){
                var a = $(this).attr('data-type');
                var b = $(this).attr('data-cas');
                var href = $(this).attr('data-href');
                $(this).css({'color':'#39c1de','font-weight': 'bold'});
                $("a[data-cls='clstype'][data-type!= "+ a +"]").css({'color':'#d1cfcf','font-weight':'normal'});
                Disp.Href('1','clstype',href);
                var casarr = b.split(',');
                $.ajax({
                    url: "/recajax/" + casarr['0'] + "/1",
                    success:function(data){
                        $('#fgx').prev('div').html(data);
                    }
                });
                $.ajax({
                    url: "/recajax/" + casarr['1'] + "/1",
                    success:function(data){
                        $('#fgx').next('div').html(data);
                    }
                });
            });
        });
    },
    //电台更换
    Radiotype:function(){
        $("a[data-cls='ratype']").each(function(){
            $(this).click(function(){
                var a = $(this).attr('data-type');
                var href = $(this).attr('data-href');
                $(this).css({'color':'#39c1de','font-weight': 'bold'});
                $("a[data-cls='ratype'][data-type!= "+ a +"]").css({'color':'#d1cfcf','font-weight':'normal'});
                $("div[id *= '-ralist'][id !=  '" + a +  "-ralist']").css('display','none');
                $("#" + a + "-ralist").css('display','block');
                $("#ra-cgeall").unbind('click');
                $("#ra-cgeall").click(function () {
                    Disp.Changeall('' + a + '-ralist');
                });
                Disp.Href('1','ratype',href);
            });
        });
    },
    //推荐人更换
    Pcertype:function(){
        $("a[data-cls='pcertype']").each(function(){
            $(this).click(function(){
                var a = $(this).attr('data-type');
                var href = $(this).attr('data-href');
                $(this).css({'color':'#39c1de','font-weight': 'bold'});
                $("a[data-cls='pcertype'][data-type!= "+ a +"]").css({'color':'#d1cfcf','font-weight':'normal'});
                $("div[id *= '-pcerlist'][id !=  '" + a +  "-pcerlist']").css('display','none');
                $("#" + a + "-pcerlist").css('display','block');
                $("#pcer-cgeall").unbind('click');
                $("#pcer-cgeall").click(function () {
                    Disp.Changeall('' + a + '-pcerlist');
                });
                Disp.Href('1','pcertype',href);
            });
        });
    },
    //排行榜更换
    Ranktype:function(){
        $("a[data-cls='ranktype']").each(function(){
            $(this).click(function(){
                var a = $(this).attr('data-type');
                $(this).css({'color':'#39c1de','font-weight': 'bold'});
                $("a[data-cls='ranktype'][data-type!= "+ a +"]").css({'color':'#d1cfcf','font-weight':'normal'});
                $("div[id *= '-ranklist'][id !=  '" + a +  "-ranklist']").css('display','none');
                $("#" + a + "-ranklist").css('display','block');
            });
        });
    },
    //排行榜 周月季更新
    Ranklist:function(){
        $("div[data-cls='rankltype']").each(function(){
            $(this).click(function(){
                var a = $(this).attr('data-type');
                var b = $(this).attr('data-prefix');
                $(this).css('background-color','#D3320A').addClass('btn-background-img-sm');
                $("div[data-cls='rankltype'][data-type!= "+ a +"][data-prefix = " + b + "]").css('background-color','#111111').removeClass('btn-background-img-sm');
                $("div[id *= '-rankslist'][id !=  '" + a +  "-rankslist'][data-prefix = " + b + "]").css('display','none');
                $("#" + a + "-rankslist").css('display','block');
            });
        });
    },
    //show 运行所有脚本
    Show:function(){
        Disp.Classtype();
        Disp.Radiotype();
        Disp.Pcertype();
        Disp.Ranktype();
        Disp.Ranklist();
        Disp.Pcerhover();
    },
    //更多按钮更新链接
    Href:function(cas,obj,href){
        switch (cas){
            case '1':
                $('#' + obj + '-more').attr('href',href);
                break;
            case 'recs-list':
                $("#" + obj + '-more').attr('href','/sort/c1/0-0-0-1-1.html');
                break;
            case 'redq-list':
                $("#" + obj + '-more').attr('href','/sort/c5/0-0-0-1-1.html');
                break;
            case 'newcs-list':
                $("#" + obj + '-more').attr('href','/sort/c1/0-0-0-0-1.html');
                break;
            case 'newdq-list':
                $("#" + obj + '-more').attr('href','/sort/c5/0-0-0-0-1.html');
                break;
        }
    },
    //推荐部分ajax
    Ajaxget:function(cas,lim,prefix){
        $.ajax({
            url: "/recajax/" + cas + "/" + lim,
            success:function(data){
                $('#recommended-' + prefix + '-box').html(data);
            }
        });
    },
    //推荐人hover事件
    Pcerhover:function(){
        $(function() {
            $('.index-radio-list[data-pcer = 1]').each(function(){
                $(this).find('ul').each(function () {
                    $(this).find('li').each(function () {
                        $(this).hover(function () {
                            $(this).children('.producer-detail-box').stop().css({'display': 'block'});
                            Disp.Pcerajax($(this));
                        }, function () {
                            $(this).children('.producer-detail-box').stop().css({'display': 'none'});
                        });
                    });
                });
            });
        });
    },
    // 推荐人ajax更新音乐列表 obj(JQ对象)
    Pcerajax:function(obj){
        var html = obj.find('.producer-detail-box').find('.ra-hover-music').html();
        var id = obj.find('.producer-detail-box').find(':input[name = id]').val();
        var key = obj.find('.producer-detail-box').find(':input[name = key]').val();
        if(html == false){
            $.ajax({
                url: "/pcerajax/" + id,
                success:function(data){
                    var res = trim(data);
                    eval("var reobj = " + res);
                    if(reobj.Result == 200){
                        var res = reobj.Data;
                        var h4 = '';
                        for(var i = 0;i<res.length;i++){
                            h4 = h4 + '<h4><a href="' + res[i].href + '" target="_Pt" title="' + res[i].musicname + '">' + res[i].musicname + '</a></h4>'
                        }
                        obj.find('.producer-detail-box').find('.ra-hover-music').html(h4);
                    }
                }
            });
        }
    }
}

/*
 * @class 购物车类
 * @type type
 */
var CDADDORDER = {
    GetCS: function () {
        var a, b;
        a = GetCookie("csid");
        if (a != '') {
            b = a.split(',');
            return b.length - 1;
        } else {
            return 0;
        }
    },
    GetDQ: function () {
        var a, b, c, d;
        a = GetCookie("dqid");
        if (a != '') {
            b = a.split(',');
            c = b.length - 1;
            d = c % 12 > 0 ? parseInt(c / 12) + 1 : parseInt(c / 12);
            return d;
        } else {
            return 0;
        }
    },
    GetCD: function () {
        var a, b, c;
        a = CDADDORDER.GetCS();
        b = CDADDORDER.GetDQ();
        c = a + b;
        return c;
    },
    GetPrice: function (a) {
        var b, c, d;
        c = a >= 2 ? (b = a >= 10 ? a * 20 : (d = a > 2 ? a * 25 : 50)) : "";
        return c;
    },
    Show: function () {
        var a, b, c, d, e, f;
        a = CDADDORDER.GetCS();
        b = CDADDORDER.GetDQ();
        c = CDADDORDER.GetCD();
        d = CDADDORDER.GetPrice(c);

        html = '<p style="line-height:50px;">您要选购的CD：</p>';
        if (a > 0) {
            html += '<p class="cs">× <span>' + a + '</span> 张</p>';
        }
        if (b > 0) {
            html += '<p class="dq">× <span>' + b + '</span> 张</p>';
        }
        html += '<p class="al">共 <span>' + c + '</span> 张CD，需要支付金额为：<span>' + d.toFixed(2) + '</span> 元</p>';
        $('#orderTitle').html(html);

    },
    Action: function () {
        CDADDORDER.Show();
    }
}


var PLAYER = {
    playingid:0,
    page:1,
    playlist_menu: function (curnum) {
        var k = 0;
        for (k = 0; k < 9; k++) {
            if (k == curnum) {
                $("#pt" + k).prop("class", "pton");
            } else {
                $("#pt" + k).prop("class", "ptoff");
            }
        }
    },
    playlist: function (curnum, curid, curpage) {
        //SetCookie("musicls","");
        this.page=curpage;
        this.playingid=curid;
        switch (curnum) {
            case 0 :
                var musicls = GetCookie("musicls");
                this.crlist("/play/ajax/temp","ids=" + musicls,0);
                this.playlist_menu(0);
                break;
            case 1 :
                var musiclog = GetCookie("qf_musiclog");
                this.crlist("/play/ajax/log","ids=" + musiclog,2);
                this.playlist_menu(1);
                break;
            case 2 :
                var musiclog = GetCookie("loginid");
                if (musiclog == "") {
                    LoginExc.MinLogin();
                    break;
                }
                this.crlist('/play/ajax/fav','ids=' + musiclog+'&boxid='+curpage,1);
                this.playlist_menu(2);
                break;
            case 3 :
                this.crlist("/play/ajax/news","classid=" + PLAYCLASSID,2);
                this.playlist_menu(3);
                break;
            case 4 :
                this.crlist("/play/ajax/recommand","classid=" + PLAYCLASSID,2);
                this.playlist_menu(4);
                break;
            case 5 :
                this.crlist("/play/ajax/downing","classid=" + PLAYCLASSID,2);
                this.playlist_menu(5);
                break;
            case 6 :
                this.crlist("/play/ajax/playing","classid=" + PLAYCLASSID,2);
                this.playlist_menu(6);
                break;
            case 7 :
                this.crlist("/play/ajax/yestoday","classid=" + PLAYCLASSID,2);
                this.playlist_menu(7);
                break;
            case 8 :
                this.crlist("/play/ajax/week","classid=" + PLAYCLASSID,2);
                this.playlist_menu(8);
                break;
        }
    },
    crlist:function(url,getdata,style) {
            $("#playlist_ct").html("<div id='playlist_ct1'><div class='load1'><img src='/static/images/load.gif'><br>加载中</div></div>");
            $.ajax({
                type: "get",
                url: url,
                timeout: 10000,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#playlist_ct").html("<div id='playlist_ct1'><div class='nonere'>错误数据...</div></div>");
                },
                data: getdata,
                success: function (data) {                  
                    eval("var reobj=" + data);
                    if (reobj.Result==200){
                        rehtml=PLAYER.pushhtml(reobj,style);                    
                        $("#playlist_ct").html(rehtml);                  
                        $(".td1").hover(function () {$(this).prop("class", "tdhover"); },function () { $(this).prop("class", "td1"); });
                        $(".td2").hover(function () {$(this).prop("class", "tdhover");},function () {$(this).prop("class", "td2");});
                        $("#selall").click(function () {
                            $(".selmusic").prop("checked", $(this).prop("checked"));
                            var tts = "";
                            $(".selmusic").each(function (i) {
                                if (this.checked == true) {
                                    tts = tts + this.value + ","
                                }
                            });
                            $("#allid").val(tts);
                        });
                        $(".selmusic").click(function () {
                            var tts = "";
                            $(".selmusic").each(function (i) {
                                if (this.checked == true) {
                                    tts = tts + this.value + ",";
                                }
                            });
                            $("#allid").val(tts);
                        });                    
                  }else{
                     if(reobj.Result==201){
                        $("#playlist_ct").html("<div id='playlist_ct1'><div class='nonere'>返回异常，请重试一次...</div></div>");
                     }else{
                        $("#playlist_ct").html("<div id='playlist_ct1'><div class='nonere'>"+reobj.Info+"</div></div>");
                     }
                  }
                }
            });

    },
    pushhtml:function(reobj,style){
        if (style==0){
            listhtml="<div id='playlist_ct1'>";
            if (reobj.Data==null){
                listhtml+="<div class='nonere'>暂无数据...</div>";
            }else{
                     for(i=0;i<reobj.Data.length;i++){
                        i%2==0? cls="td1": cls="td2";
                        cls2="num";
                        if (PLAYINGID==reobj.Data[i].id){  cls="td3"; cls2="num2"};
                        listhtml+="<ul class='"+cls+"'";
                        if (i==0){
                            listhtml+=" style='border-top:0px;'";
                        }
                        listhtml+= " data='"+cls+"' id='tempdellist"+reobj.Data[i].id+"'>";
                        listhtml+="<div class='"+cls2+"'><input  class='selmusic' id='musicid"+i+"' type='checkbox' value='"+reobj.Data[i].id+"'/></div>";
                        listhtml+="<div class='bt'><a  href='"+PLAYER.RePlayurl(reobj.Data[i].id)+"' title='"+reobj.Data[i].musicname+"'>"+reobj.Data[i].musicname+"</a></div>";
                        listhtml+="<div class='icodel' ><a href='javascript:void(0)' onclick='PLAYER.delplaylist("+reobj.Data[i].id+")'></a></div></ul>";
                    }   
                    listhtml+="</div>";            
                    listhtml+="<div id='playlist_ct2'>";
                    listhtml+="<div class='caozuo'><div class='tag_lv_sel'><input name='selall' id='selall' type='checkbox' value='' /></div><div class='tag_lv_sel'>全选</div>";
                    listhtml+="<div class='tag_lv' onclick='PLAYER.delplaylist($(\"#allid\").val());'>删除所选</div>";
                    listhtml+="<div class='tag_lv' onclick='PLAYER.clear()'>清空列表</div><input name='allid' id='allid' type='hidden' /></div></div>";
            }
            return listhtml;
            
        }else if(style==2){
            listhtml="<div id='playlist_ct1'>";
            if (reobj.Data==null){
               listhtml+="<div class='nonere'>暂无数据...</div>"; 
            }else{
                for(i=0;i<reobj.Data.length;i++){
                    i%2==0? cls="td1": cls="td2";
                    cls2="num";
                    if (PLAYINGID==reobj.Data[i].id){  cls="td3"; cls2="num2"};
                    listhtml+="<ul class='"+cls+"'";
                    if (i==0){
                        listhtml+=" style='border-top:0px;'";
                    }
                    listhtml+= " data='"+cls+"' id='tempdellist"+reobj.Data[i].id+"'>";
                    listhtml+="<div class='"+cls2+"'><input  class='selmusic' id='musicid"+i+"' type='checkbox' value='"+reobj.Data[i].id+"'/></div>";
                    listhtml+="<div class='bt'><a  href='"+PLAYER.RePlayurl(reobj.Data[i].id)+"' title='"+reobj.Data[i].musicname+"'>"+reobj.Data[i].musicname+"</a></div>";
                    listhtml+="<div class='icoadd' ><a href='javascript:void(0)' onclick='PLAYER.addplaylist_("+reobj.Data[i].id+")'></a></div></ul>";
                }   
                listhtml+="</div>";            
                listhtml+="<div id='playlist_ct2'>";
                listhtml+="<div class='caozuo'><div class='tag_lv_sel'><input name='selall' id='selall' type='checkbox' value='' /></div><div class='tag_lv_sel'>全选</div>";
                listhtml+="<div class='tag_lv' onclick='PLAYER.addplaylist_($(\"#allid\").val());'>添加到播放列表</div><input name='allid' id='allid' type='hidden' /></div></div>";
            }
            return listhtml;
            
        }else{
            listhtml="<div id='playlist_ct1'>";
            if (reobj.BoxList.length>0){
                 listhtml+="<div id='playlist_box'>";
                  for(i=0;i<reobj.BoxList.length;i++){
                    listhtml+="<a href='javascript:void(0)'";
                    reobj.SelBoxId==reobj.BoxList[i].id ? listhtml+=" class='boxon'":listhtml+=" class='boxoff'";             
                    listhtml+=" onclick='PLAYER.playlist(2, "+PLAYINGID+","+reobj.BoxList[i].id+")'>"+reobj.BoxList[i].cname+"("+reobj.BoxList[i].count+")</a>";
                  }
                 listhtml+="</div>";
            } 
            if (reobj.Data==null){
               listhtml+="<div class='nonere'>暂无数据...</div>"; 
            }else{
                for(i=0;i<reobj.Data.length;i++){
                    i%2==0? cls="td1": cls="td2";
                    cls2="num";
                    if (PLAYINGID==reobj.Data[i].id){  cls="td3"; cls2="num2"};
                    listhtml+="<ul class='"+cls+"'";
                    if (i==0){
                        listhtml+=" style='border-top:0px;'";
                    }
                    listhtml+= " data='"+cls+"' id='tempdellist"+reobj.Data[i].id+"'>";
                    listhtml+="<div class='"+cls2+"'><input  class='selmusic' id='musicid"+i+"' type='checkbox' value='"+reobj.Data[i].id+"'/></div>";
                    listhtml+="<div class='bt'><a  href='"+PLAYER.RePlayurl(reobj.Data[i].id)+"' title='"+reobj.Data[i].musicname+"'>"+reobj.Data[i].musicname+"</a></div>";
                    listhtml+="<div class='icoadd' ><a href='javascript:void(0)' onclick='PLAYER.addplaylist_("+reobj.Data[i].id+")'></a></div></ul>";
                }   
                listhtml+="</div>";            
                listhtml+="<div id='playlist_ct2'>";
                listhtml+="<div class='caozuo'><div class='tag_lv_sel'><input name='selall' id='selall' type='checkbox' value='' /></div><div class='tag_lv_sel'>全选</div>";
                listhtml+="<div class='tag_lv' onclick='PLAYER.addplaylist_($(\"#allid\").val());'>添加到播放列表</div><input name='allid' id='allid' type='hidden' /></div></div>";
            }
            return listhtml;
        }
        
    },
    clear:function(){
        SetCookie("musicls","");
        $("#playlist_ct").html("<div id='playlist_ct1'><div class='nonere'>暂无数据...</div></div>");
    },
    delloglist: function (ids, curid, curpage) {
        if (ids == "") {
            ids = $("#allid").val();
        }
        if (ids != "") {
            ids = ids + ",";
            arr = ids.split(",");
            for (i = 0; i < arr.length; i++) {
                if (arr[i] != "") {
                    tc = GetCookie("musiclog");
                    tc = tc.replace("|" + arr[i] + "|,", "");
                    SetCookie("musiclog", tc);
                }
            }
            this.playlist(1, curid, curpage);
        }
    },
    dellogall: function () {
        SetCookie('musiclog', '');
        this.playlist(1, "", 1);
    },
    delplaylist: function (ids) {
        if (ids == "") {
            ids = $("#allid").val();
        }
        if (ids != "") {
            ids = ids + ",";
            arr = ids.split(",");
            for (i = 0; i < arr.length; i++) {
                if (arr[i] != "") {
                    tc = GetCookie("musicls");
                    tc = tc.replace("|" + arr[i] + "|,", "");
                    SetCookie("musicls", tc);
                    $("#tempdellist"+arr[i]).html(""); $("#tempdellist"+arr[i]).hide();
                }
            }
        }
    },
    addplaylog: function (curmusicid) {
        if (isNaN(curmusicid) == false) {
            var tmpmusicid = GetCookie("qf_musiclog");
            var tmusicid = "|" + curmusicid + "|";
            if (tmpmusicid.indexOf(tmusicid) == -1) {
                tmpmusicid = tmusicid + "," + tmpmusicid;
                var t = tmpmusicid.split(",")
                var _mid = ""
                if (t.length > 201) {
                    for (i = 0; i <= 200; i++) {
                        if (i < t.length) {
                            if (t[i] != "") {
                                if (_mid == "") {
                                    _mid = t[i]
                                } else {
                                    _mid = _mid + "," + t[i]
                                }
                            }
                        }
                    }
                } else {
                    _mid = tmpmusicid
                }
                SetCookie("qf_musiclog", _mid);
            }
        }
    },
    addplaylist_:function(curmusicid){
         if(curmusicid==''){AlertRe('请选择添加的舞曲','');return false}
 	 var ids=curmusicid+",";
	 arr = ids.split(",");
	 for (i=0;i<arr.length;i++){
		if (arr[i]!=""){
		   this.addplaylist(arr[i]);
		}
 	 }
         LAYMSG('添加成功');
    },
    addplaylist: function (curmusicid) {     
        if (isNaN(curmusicid) == false) {
            var tmpmusicid = GetCookie("musicls");
            var tmusicid = "|" + curmusicid + "|";
            if (tmpmusicid.indexOf(tmusicid) == -1) {
                tmpmusicid =tmusicid + ","+ tmpmusicid  ;
                var t = tmpmusicid.split(",")
                var _mid = ""
                if (t.length == 201) {
                    for (i = 1; i < 200; i++) {
                        if (i < t.length) {
                            if (t[i] != "") {
                                _mid =  t[i] + ","+_mid
                            }
                        }
                    }
                } else {
                    _mid = tmpmusicid
                }
                SetCookie("musicls", _mid);
            }
        }
    },
    delplayall: function () {
        SetCookie('musicls', '');
        this.playlist(0, "", 1);
    },RePlayurl: function (curid) {
        return "/play/"+curid+".html";
    }
}


var Listadd = {
    //全选
    selall : function(obj){
        $("#selall").click(function () {
            $(obj).prop("checked", $(this).prop("checked"));
            Listadd.allid(obj);
        });
    },
    //获取歌曲列表
    allid : function(obj){
        var tts = "";
        $(obj).each(function (i) {
            if (this.checked == true) {
                tts = tts + this.value + ",";
            }
        });
        $("#allid").val(tts);
    },
    //CheckBox单击事件(执行allid)
    checkboxsel : function(obj){
        $(obj).each(function(){
            $(this).click(function(){
                Listadd.allid(obj);
            });
        });
    },
    //播放全部
    playall : function (curmusicid) {
        if(curmusicid==''){AlertRe('请选择播放的舞曲','');return false}
        var ids=curmusicid+",";
        arr = ids.split(",");
        for (i=0;i<arr.length;i++){
            if (arr[i]!=""){
                this.addplaylist(arr[i]);
            }
        }
        var href = '/play/' + arr['0'] + '.html';
        window.open(href,'_Pt','');
    },
    //初始化 处理对象与执行方法
    show : function(obj){
        var a = '.' + obj;
        Listadd.selall(a);
        Listadd.allid(a);
        Listadd.checkboxsel(a);
    },
    addplaylist_:function(curmusicid){
        if(curmusicid==''){AlertRe('请选择添加的舞曲','');return false}
        var ids=curmusicid+",";
        arr = ids.split(",");
        for (i=0;i<arr.length;i++){
            if (arr[i]!=""){
                this.addplaylist(arr[i]);
            }
        }
        LAYMSG('添加成功');
    },
    addplaylist: function (curmusicid) {
        if (isNaN(curmusicid) == false) {
            var tmpmusicid = GetCookie("musicls");
            var tmusicid = "|" + curmusicid + "|";
            if (tmpmusicid.indexOf(tmusicid) == -1) {
                tmpmusicid =tmusicid + ","+ tmpmusicid  ;
                var t = tmpmusicid.split(",");
                var _mid = "";
                if (t.length == 201) {
                    for (i = 1; i < 200; i++) {
                        if (i < t.length) {
                            if (t[i] != "") {
                                _mid =  t[i] + ","+_mid;
                            }
                        }
                    }
                } else {
                    _mid = tmpmusicid;
                }
                SetCookie("musicls", _mid);
            }
        }
    }
}

/*
 * @class 微信公众号弹出
 * @type type
 */
var WECHAT = {
    index: '',
    show: function () {
        $('#wechat').hover(function () {
            this.index = layer.tips('<div><img src="/static/images/qfdj.jpg" style="width:180px;display:block;border:0px"></div>', '#wechat', {
                id:'webcharmsg',
                tips: 3,
                isOutAnim:false,
                time: 0,
                area: ['200px','200px']
            });
        },function(){
            layer.close(this.index);
        });
        $('#wechat-footer').hover(function () {
            this.index = layer.tips('<div><img src="/static/images/qfdj.jpg" style="width:180px;display:block;border:0px"></div>', '#wechat-footer', {
                id:'webcharmsg',
                tips: 1,
                time: 0,
                isOutAnim:false,
                area: ['200px','200px']
            });
        },function(){
            layer.close(this.index);
        });
    }
};

function LAYMSG(str){
    if (ISIE6()){
       AlertRe(str,1);
    }else{
       layer.msg(str);
    }
}

function ISIE6(){
    var ie6=!-[1,]&&!window.XMLHttpRequest;
    return ie6
}

function AddToCart(fromEl,toEl,callback){
    var fromX = fromEl.offset().left;
    var fromY = fromEl.offset().top - $(document).scrollTop();
    var toX = toEl.offset().left;
    var toY = toEl.offset().top - $(document).scrollTop();
    var img = document.createElement('img');
    img.src = '/static/images/cdico.png';
    img.style.width = 100 + 'px';
    img.style.height = 100 + 'px';
    img.style.position = 'fixed';
    img.style.zIndex = '1000';
    img.style.left = fromX + 'px';
    img.style.top = fromY + 'px';
    document.getElementsByTagName('body')[0].appendChild(img);
    var fakeEl = $(img);
    fakeEl.animate({
        width: fromEl.width() * 0.2,
        height: fromEl.height() * 0.2,
        top: toY,
        left: toX
    }, 1000, null, function ()
    {
        fakeEl.remove();
        if (callback)
        {
            callback()
        }
    });
}