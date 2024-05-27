function BannerInit() {
    $(".se").hover(function () {
        $(this).find("ul:first-child").stop().attr("class", "banneron");
        $(this).find("div:first").stop().show();
    }, function () {
        $(this).find("ul:first-child").stop().attr("class", "se banneroff");
        $(this).find("div:first").stop().hide();
    });
}
function select_all(){
	var a = $(".xuan");
    for (var i = 0; i < a.length; i++) {
        a[i].checked = (a[i].checked) ? false : true;
    }
}
//加入播放
function playall(cls,num,sign){
	var a = $('.'+cls+'_'+num).children('li');
	if(sign==1) a = $('.'+cls+'_'+num).children('input');
	if(sign==2) a = $('.'+cls+'_'+num).children('ul').children('li');
	var arr = new Array();
	var id = 0;
	for (var i = 0; i < a.length; i++) {
		if(sign==1){
			if(a[i].checked) arr.push(a[i].value);
		}else{
			arr.push(a[i].getAttribute('data-id'));
		}
	}
	if(arr.length<1){
		cscms.layer.msg('请选择歌曲',{icon:2});return;
	}
	var ids = arr.join(',');
	SetCookie('recordlist', ids, null, "/", top.location.hostname, false);
	window.open('/play/'+arr[0]+'.html','_Pt');
}
//加入列表
function addplaylist(cls,num,sign){
	var a = $('.'+cls+'_'+num).children('li');
	if(sign==1) a = $('.'+cls+'_'+num).children('input');
	if(sign==2) a = $('.'+cls+'_'+num).children('ul').children('li');
	var arr = new Array();
	for (var i = 0; i < a.length; i++) {
		if(sign==1){
			if(a[i].checked) arr.push(a[i].value);
		}else{
			arr.push(a[i].getAttribute('data-id'));
		}
	}
	if(arr.length<1){
		cscms.layer.msg('请选择歌曲',{icon:2});return;
	}
	var cookiename = 'recordlist';
	var name = get_cookie(cookiename);
	var newname = '';var test = 0;
	if(name!=''){
		var temparr = name.split(',');
		for (var i = 0; i < arr.length; i++) {
			if($.inArray(arr[i], temparr)==-1){
				temparr.unshift(arr[i]);
			}
		}
		newname = temparr.join(',');
	}else{
		newname = arr.join(',');
	}
	SetCookie(cookiename, newname, null, "/", top.location.hostname, false);
	cscms.layer.msg('添加成功',{icon:1});
}
//头部获取播放记录
function getplaylist(sign){
	var mylist = 'playlist';
	if(sign==2) mylist = 'recordlist';
	var precord = get_cookie(mylist).split(',');
	var listid = precord.join(',');
	if(listid==''){
		$('#playlog_history_list').html('<a href="#" class="nolog">无记录...</a>');
	}else{
		$.post('/index.php/dance/vvvdj/getdata', {
			id: listid
		}, function(data) {
			showdata(data.info,sign);
		},"json");
	}
}
//头部播放记录数据
function showdata(data,sign){
	console.log(data);
	var html = '';
	if(sign==2){

	}else{
		for (var i = 0; i < data.length; i++) {
			html += '<div class="mc1"><a href="'+data[i]['link']+'" target="_Pt">'+data[i]['name']+'</a></div>';
		}
	}
	if(html==''){
		html = '<a href="#" class="nolog">无记录...</a>';
	}else{
		html = '<div class="mc_class">'+html+'</div><div style="height:40px;"><a href="javascript:void(0)" class="btn-hred" onclick="listClear()" style="display:block;width:180px;margin: 0 auto; color:#e1e1e1;line-height:26px; height:26px;text-align:center">清空播放历史记录</a></div>';
	}
	$('#playlog_history_list').html(html);
}
//头部清空播放记录
function listClear(){
	SetCookie('playlist', '', null, "/", top.location.hostname, false);
	$('#playlog_history_list').html('<a href="#" class="nolog">无记录...</a>');
	cscms.layer.msg('已清空播放记录',{icon:1});
}
/*判断是否为当前日期*/
function judgeDate(){
	var date = $('.judgeDate');
	var nowDate = new Date();
    var nowtime = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
	for (var i = 0; i < date.length; i++) {
    	if(date[i].getAttribute('data')==nowtime){
    		date[i].style.color="#94d500";
    	}
    }
}
//播放器
function bfq() {
	document.writeln("<iframe id=\"player\" marginwidth=\"0\" marginheight=\"0\" src=\"" + cscms_path + "tpl/pc/skins/uuudj/real/index.php\" frameborder=\"0\" width=\"960\" scrolling=\"no\" height=\"34\" leftmargin=\"0\" topmargin=\"0\"></iframe>");
}
//tab切换
function changeOne(cls,num,which,total){
	$('.'+cls).hide();
	if(total==''||total==undefined) total = 3;
	if(num==total){
		num=1;
	}else{
		num++;
	}
	$('.'+cls+'_'+num).show();
	if(which==11){
		$('#recommended-cgeall1').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
		$('#recommended-cgeall1').siblings('.playall').attr('onclick', "playall('"+cls+"',"+num+",2)");
		$('#recommended-cgeall1').siblings('.addall').attr('onclick', "addplaylist('"+cls+"',"+num+",2)");
	}
	if(which==1){
		$('#recommended-cgeall1').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
		$('#recommended-cgeall1').siblings('.playall').attr('onclick', "playall('"+cls+"',"+num+")");
		$('#recommended-cgeall1').siblings('.addall').attr('onclick', "addplaylist('"+cls+"',"+num+")");
	}
	if(which==2){
		$('#recommended-cgeall2').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
		$('#recommended-cgeall2').siblings('.playall').attr('onclick', "playall('"+cls+"',"+num+")");
		$('#recommended-cgeall2').siblings('.addall').attr('onclick', "addplaylist('"+cls+"',"+num+")");
	}
	if(which==3){
		if(num==1){
			$('#ra-cgeall').attr('onclick', "changeOne('item4',1,4)");
			$('.zjcls1').addClass('on');
			$('.zjcls2').removeClass('on');
		}else{
			$('#ra-cgeall').attr('onclick', "changeOne('item5',1,4)");
			$('.zjcls2').addClass('on');
			$('.zjcls1').removeClass('on');
		}
		var link1 = $('#ratype-more').attr('href');
		var link2 = $('#ratype-more').attr('_href');
		$('#ratype-more').attr('href', link2);
		$('#ratype-more').attr('_href', link1);
	}
	if(which==4){
		$('#ra-cgeall').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
	}
	//首页右侧热门专辑
	if(which==5){
		$('#hot-cgeall').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
	}
	//首页右侧排行榜
	if(which==6){
		if(num==1){
			$('.rankcs1').addClass('on');
			$('.rankcs2').removeClass('on');
		}else{
			$('.rankcs2').addClass('on');
			$('.rankcs1').removeClass('on');
		}
	}
	if(which==7){
		$('.btnrank1').removeClass('btn-background-img-sm');
		$('.btnrank2').removeClass('btn-background-img-sm');
		$('.btnrank3').removeClass('btn-background-img-sm');
		$('.btnrank'+num).addClass('btn-background-img-sm');
	}
	if(which==8){
		$('.btn2rank1').removeClass('btn-background-img-sm');
		$('.btn2rank2').removeClass('btn-background-img-sm');
		$('.btn2rank3').removeClass('btn-background-img-sm');
		$('.btn2rank'+num).addClass('btn-background-img-sm');
	}
	//音乐制作人
	if(which==9){
		if(num==1){
			$('#pcer-cgeall').attr('onclick', "changeOne('item11',1,10)");
			$('.rzid1').addClass('on');
			$('.rzid2').removeClass('on');
		}else{
			$('#pcer-cgeall').attr('onclick', "changeOne('item12',1,10)");
			$('.rzid2').addClass('on');
			$('.rzid1').removeClass('on');
		}
		var link1 = $('#pcertype-more').attr('href');
		var link2 = $('#pcertype-more').attr('_href');
		$('#pcertype-more').attr('href', link2);
		$('#pcertype-more').attr('_href', link1);
	}
	if(which==10){
		$('#pcer-cgeall').attr('onclick', "changeOne('"+cls+"',"+num+","+which+")");
	}
}
//获取cookie
function get_cookie(_name){
	var Res = eval('/'+_name+'=([^;]+)/').exec(document.cookie); return Res==null?'':unescape(Res[1]);
}
//写入cookie
function SetCookie(name, value){
	var exdate = new Date();
	var expiredays = 30;
	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = name + "=" + escape (value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))+((secure == true) ? "; secure" : "");
}
//获取首页推荐数据
function getRecoData(id){
	$.post('/index.php/dance/vvvdj/getreco', {id:id}, function(data) {
		if(data.error==0){
			showRecoData(data.info);
			$('.recoName'+id).siblings().children('a').removeClass('on');
			$('.recoName'+id).children('a').addClass('on');
			var name1 = '推荐'+$('.recoName'+id).children('a').html();
			var name2 = '最新'+$('.recoName'+id).children('a').html();
			if(id==-1){
				name1 = '最新推荐';
				name2 = '最热推荐';
			}
			if(id==0){
				name1 = '最新单曲';
				name2 = '最热单曲';
			}
			$('#clsRecoLink').attr('href', data.info.clslink);
			$('#group_item1').html(name1);
			$('#group_item2').html(name2);
		}
	},"json");
}
//展示数据
function showRecoData(arr){
	var arr1 = arr.res1;
	var arr2 = arr.res2;
	var html1 = '<ul class="clearfix item1 item1_1">';
	for (var i = 0; i<arr1.length; i++) {
		if(i==12) html1 += '</ul><ul class="clearfix item1 item1_2" style="display:none">';
		if(i==24) html1 += '</ul><ul class="clearfix item1 item1_3" style="display:none">';
		var cls1 = '';var cls2 = '';
		if(i==0 || i==12 || i==24){
			cls1 = 'style="display:none;"';
			cls2 = 'style="display:block;"';
		}
		var temp = arr1[i];
		html1 += '<li data-id="'+temp['id']+'"><div class="index-music-sm" '+cls1+'> <span>'+temp['name']+'</span><i class="judgeDate" data="'+temp['time2']+'">'+temp['time1']+'</i></div><div class="index-music-bg"  '+cls2+'><div class="index-music-img"><a href="'+temp['link']+'" target="_Pt"><img src="'+temp['pic']+'"></a><p>'+temp['cname']+'</p></div><div class="index-music-ct"><h2 class="index-music-title"><a href="'+temp['link']+'" target="_Pt">'+temp['name']+'</a></h2><div class="index-music-hit"><p>'+temp['hits']+' <b class="judgeDate" data="'+temp['time2']+'">'+temp['time2']+'</b></p></div></div></div></li>';
	}
	html1 += '</ul>';
	$('#recs-list').html(html1);

	var html2 = '<ul class="clearfix item2 item2_1">';
	for (var i = 0; i<arr2.length; i++) {
		if(i==12) html2 += '</ul><ul class="clearfix item2 item2_2" style="display:none">';
		if(i==24) html2 += '</ul><ul class="clearfix item2 item2_3" style="display:none">';
		var cls1 = '';var cls2 = '';
		if(i==0 || i==12 || i==24){
			cls1 = 'style="display:none;"';
			cls2 = 'style="display:block;"';
		}
		var temp = arr2[i];
		html2 += '<li data-id="'+temp['id']+'"><div class="index-music-sm" '+cls1+'> <span>'+temp['name']+'</span><i class="judgeDate" data="'+temp['time2']+'">'+temp['time1']+'</i></div><div class="index-music-bg"  '+cls2+'><div class="index-music-img"><a href="'+temp['link']+'" target="_Pt"><img src="'+temp['pic']+'"></a><p>'+temp['cname']+'</p></div><div class="index-music-ct"><h2 class="index-music-title"><a href="'+temp['link']+'" target="_Pt">'+temp['name']+'</a></h2><div class="index-music-hit"><p>'+temp['hits']+' <b class="judgeDate" data="'+temp['time2']+'">'+temp['time2']+'</b></p></div></div></div></li>';
	}
	html2 += '</ul>';
	$('#redq-list').html(html2);
	changeOne('item1',3,1);
	changeOne('item2',3,2);
	BannerInit();
	judgeDate();
       $('.recommended-list li').hover(function() {
            $(this).children('.index-music-sm').hide();
            $(this).children('.index-music-bg').show();
            $(this).siblings().children('.index-music-bg').hide();
            $(this).siblings().children('.index-music-sm').show();
        });
}

function danceFav(id){//歌曲收藏
	$.getJSON(cscms_path+"index.php/dance/ajax/dancefav/"+id+"?callback=?",function(data) {
       	if(data){
       	    if(data['msg']=='ok'){
               cscms.layer.msg('歌曲收藏成功!',{icon:6});
           	}else{
               cscms.layer.msg(data['msg'],{icon:5});
           	}
       	} else {
            cscms.layer.msg('网络故障，连接失败!',{icon:2});
       	}
 	});
}

function danceDown(url){
	cscms.layer.open({
		title:['舞曲下载', 'background: #010101;color: #fff;border: none;'],
		type: 2,
		zIndex:998,
		area: ['520px', '630px'],
		closeBtn: 1, //不显示关闭按钮
		shade: 0.01,
		shadeClose: false, //开启遮罩关闭
		content: url
	});
}