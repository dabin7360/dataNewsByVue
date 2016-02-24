var myList = new Vue({
	el : ".main",
	data : {
		chanelName : '',
		conTitle : '',
		nav : ['今日关注','最新笑话','爆笑趣图'],
		hotNews : [],
		jokes : [],
		gifs : [],
		shwCon : false,
		articleHtml : ''
	},
	methods : {
		changeChanel : function(i){
			var $mainLst = $('.main_list_con');
			this.chanelName = this.nav[i];
			this.whichRequest(i);
			$mainLst.hide();
			$mainLst.eq(i).show();
		},
		whichRequest : function(t){
			switch (t) {
				case 0:
					this.requestNews();
					break;
				case 1||2:
					this.requestjoke();
					break;
			};
		},
		//获取热点列表
		requestNews : function(){
			//随机获取频道
			var newChanelId = Math.floor(Math.random() * 7);
			var url = 'http://www.tngou.net/api/top/list';
			$.ajax({
				type : 'GET',
				url : url,
				data : {
					id : newChanelId
				},
				dataType : 'jsonp',
				success : function(data){
					myList.hotNews = data.tngou;
				},
				error : function(msg){
					console.log(msg);
				}
			})
		},
		//获取新闻正文
		requestNewsCon : function(id){
			var url = 'http://www.tngou.net/api/top/show';
			var _this = this;
			this.shwCon = true;
			$.ajax({
				type : 'GET',
				url : url,
				data : {
					id : id
				},
				dataType : 'jsonp',
				success : function(data){
					_this.conTitle = data.title;
					_this.articleHtml = data.message;
				},
				error : function(msg){
					console.log(msg);
				}
			})
		},
		//获取笑话趣图数据
		requestjoke : function(){
			var url = 'http://api.1-blog.com/biz/bizserver/xiaohua/list.do?size=60';
			var _this = this;
			$.ajax({
				type : 'POST',
				url : url,
				dataType : 'json',
				success : function(data){
					_this.jokes = [];
					_this.gifs = [];
					for(var i=0; i<data.detail.length; i++){
						if(data.detail[i].picUrl){
							_this.gifs.push({
									con : data.detail[i].content,
									picUrl : data.detail[i].picUrl
							});
						}else{
							_this.jokes.push(data.detail[i].content);
						}
						
					}
				},
				error : function(msg){
					console.log(msg);
				}
			})
		},
		//显示笑话正文
		shwJokeCon : function(curJoke){
			this.conTitle = '笑话正文';
			this.shwCon = true;
			this.articleHtml = "<p>"+curJoke+"</p>";
		},
		//显示趣图正文
		shwGifCon : function(curJoke,gifurl){
			this.conTitle = '趣图正文';
			this.shwCon = true;
			this.articleHtml = "<p>"+curJoke+"</p><p class='main_con_gif'><img src='"+gifurl+"' />";
		}
	},
	created : function(){
		var _this = this;
		//默认显示今日关注频道
		this.changeChanel(0);
		//添加返回按钮
		$('.main_con_title').append("<span class='goback'></span>");
		$('.goback').on('click',function(){
			_this.shwCon = false;
		})
	}
})