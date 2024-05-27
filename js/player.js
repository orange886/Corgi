var rerData;
var bid = 0;
var loop = 0;//0循环1单曲2随机
//切换播放菜单
function playShowMenu(sign){
	var sort = 'addtime';
	var id = '';
	if(sign==0){
		var precord = get_cookie('recordlist').split(',');
		id = precord.join(',');
		if(id=='') id=0;
	}
	if(sign==1){
		var precord = get_cookie('playlist').split(',');
		id = precord.join(',');
		if(id=='') id=0;
	}
	if(sign==2) sort = 'fav';
	if(sign==3) sort = 'addtime';
	if(sign==4) sort = 'reco';
	if(sign==5) sort = 'xhits';
	if(sign==6) sort = 'play';
	if(sign==7) sort = 'rhits';
	if(sign==8) sort = 'zhits';
	$('#playlist_ct1').html($('#playload').html());
	$('#playlist_ct2').html('');
	$('.pt'+sign).siblings().removeClass('pton').addClass('ptoff');
	$('.pt'+sign).removeClass('ptoff').addClass('pton');
	$.post('/index.php/dance/vvvdj/getdata', {
		id: id,sort:sort
	}, function(data) {
		if(data.error==0){
			showPlayData(data.msg,sign);
		}else if(data.error==2){
			$('#playlist_ct1').html('<div class="nonere">请登录后获取收藏列表...</div>');
			showLoginOpen(0);
		}else{

		}
	},"json");
}
//填入数据
function showPlayData(arr,sign){
	arr = Array.from(arr);
	var html = '';
	var icon = 'icoadd';
	var click = 'addplayl';
	if(sign==0){
		rerData = arr;
		icon = 'icodel';
		click = 'delplayl';
		$('#playlist_ct2').html('<div class="caozuo"><div class="tag_lv_sel"><input name="selall" id="selall" onclick="select_all()" type="checkbox" value=""></div><div class="tag_lv_sel">全选</div><div class="tag_lv" onclick="delSelectList();">删除所选</div><div class="tag_lv" onclick="RecordListClear()">清空列表</div></div>');
	}else{
		$('#playlist_ct2').html('<div class="caozuo"><div class="tag_lv_sel"><input name="selall" id="selall" onclick="select_all()" type="checkbox" value=""></div><div class="tag_lv_sel">全选</div><div class="tag_lv" onclick="addSelectList();">添加到播放列表</div></div>');
	}
	for (var i = 0; i < arr.length; i++) {
		var data = arr[i];
		var cls = 'td1';
		if(i%2==0) cls = 'td2';
		if(did==data['id']) cls = 'td3';
		if(sign==0 && did==data['id']) bid=i;
		html += '<ul class="delpl'+i+' '+cls+'" style="border-top:0px;"><div class="num2"><input class="selmusic xuan" data="'+i+'" type="checkbox" value="'+data['id']+'"></div><div class="bt"><a href="'+data['link']+'" title="'+data['name']+'">'+data['name']+'</a></div><div class="'+icon+'"><a href="javascript:void(0)" onclick="'+click+'('+data['id']+','+i+')"></a></div></ul>';
	}
	if(html==''){
		html = '<div class="nonere">暂无数据...</div>';
	}
	$('#playlist_ct1').html(html);
}
//删除播放记录选中
function delSelectList(){
	var a = $(".xuan");
    for (var i = 0; i < a.length; i++) {
    	if(a[i].checked){
    		delrplist(a[i].value);
    		var pos = a[i].getAttribute('data');
    		$('.delpl'+pos).remove();
    	}
    }
}
//清空播放记录
function RecordListClear(){
	SetCookie('recordlist', '', null, "/", top.location.hostname, false);
	$('#playlist_ct1').html('<div class="nonere">暂无数据...</div>');
	cscms.layer.msg('已清空播放列表',{icon:1});
}
//单一删除播放记录
function delplayl(id,i){
	delrplist(id);
	$('.delpl'+i).remove();
}
//单一加入播放记录
function addplayl(id,i){
	addrplist(id);
	cscms.layer.msg('添加成功',{icon:1});
}
//选中添加播放记录
function addSelectList(){
	var a = $(".xuan");
    for (var i = 0; i < a.length; i++) {
    	if(a[i].checked){
    		addrplist(a[i].value);
    	}
    }
    cscms.layer.msg('添加成功',{icon:1});
}

//加入到播放记录
function addrplist(id,sign){
	var cookiename = 'recordlist';
	if(sign==1) cookiename = 'playlist';
	var name = get_cookie(cookiename);
	var newname = '';var test = 0;
	if(name!=''){
		var temparr = name.split(',');
		var psign = 0;
		for(var i=0;i<temparr.length;i++){
			if(temparr[i]==id){
				psign=1;
			}
		}
		if(psign==0){
			temparr.unshift(id);
		}
		newname = temparr.join(',');
	}else{
		newname = id;
	}
	SetCookie(cookiename, newname, null, "/", top.location.hostname, false);
}
//删除播放记录
function delrplist(id){
	var cookiename = 'recordlist';
	var name = get_cookie(cookiename);
	var newname = '';
	var temparr = name.split(',');
	for (var i = 0;i<temparr.length;i++) {
		if(temparr[i]==id){
			temparr.splice(i,1);
		}
	}
	newname = temparr.join(',');
	SetCookie(cookiename, newname, null, "/", top.location.hostname, false);
}

//下一首
function getNext(){
	var tempid = rerData.length-1;
	if(tempid==-1) return;
	if(loop==0){
		if(bid==tempid){
			location.href = rerData[0]['link'];
		}else{
			tempid = bid+1;
			location.href = rerData[tempid]['link'];
		}
	}else{
		if(loop==1){//单曲
			location.href = rerData[bid]['link'];
		}else{
			tempid = parseInt(Math.random()*tempid);
			location.href = rerData[tempid]['link'];
		}
	}
}
//上一首
function getPre(){
	var tempid = rerData.length-1;
	if(tempid==-1) return;
	if(loop==0){
		if(bid==0){
			location.href = rerData[tempid]['link'];
		}else{
			tempid = bid-1;
			location.href = rerData[tempid]['link'];
		}
	}else{
		if(loop==1){//单曲
			location.href = rerData[bid]['link'];
		}else{
			tempid = parseInt(Math.random()*tempid);
			location.href = rerData[tempid]['link'];
		}
	}
}

function playLoop(){
	$('#bfsel').removeClass('bofang1');
	$('#bfsel').removeClass('bofang2');
	$('#bfsel').removeClass('bofang3');
	if(loop==0){
		loop = 1;$('#bfsel').addClass('bofang3');
	}else if(loop==1){
		loop = 2;$('#bfsel').addClass('bofang2');
	}else if(loop==2){
		loop = 0;$('#bfsel').addClass('bofang1');
	}
}