
const $ply = require('../../mlGame/core/role.js').default.role;
const $block = require('../../mlGame/data/area.js').default.block;
const $cellTile = require('../../mlGame/data/area.js').default.cell;
const $bdData = require('../../mlGame/data/construct.js').default.construct;
const $typeName = require('../../mlGame/data/area.js').default.typeName
const mapCtrl = require('../../mlGame/core/map.js').default.mapCtrl;

const MAXCELL = 50;
const maxx=9;
const maxy=7;
const centerx = (maxx+1)/2;
const centery = (maxy+1)/2;
const topGap=55;
const leftGap=175;
const width = 60;

class _mapView
{
	constructor()
	{
		this.viewMode = 0;	//0:world,1:block
		this.WorldViewCenter = {'x':0,'y':0};
		this.curBlock = {'x':0,'y':0};
		this.worldSelect = {'x':-1,'y':-1,'i':-1,'j':-1};
		this.cellSelect = {'x':-1,'y':-1,'i':-1,'j':-1};
		this.lastWorldSel = {'x':-1,'y':-1,'i':-1,'j':-1};
		this.showBorder = false;
		this.renderReady=false;
	}

	getWorldViewCenter()
	{
		return this.WorldViewCenter;
	}

	setWorldViewCenter(x,y)
	{
		this.WorldViewCenter.x = x;
		this.WorldViewCenter.y = y;
	}

	createEl()
	{
		createWorldTiles();
		this.renderReady=true;
		let closeAssign = document.getElementById("closeAssign");
		closeAssign.onclick = ()=>
		{
			let mengban = document.getElementById("mengban");
			let assign = document.getElementById("build");

			mengban.style.visibility = "hidden";
			assign.style.visibility = "hidden";
		};
	}

	render()
	{
		if(this.viewMode==0)
		{
			this.renderWorld();
		}
		else
		{
			this.renderBlock();
		}
		initMapActBtn();
	}

	showBlock(v)
	{
		if(v)
		{
			let mapRoot = document.getElementById("block");
			mapRoot.style.visibility = "visible";
		}
		else
		{
			let mapRoot = document.getElementById("block");
			while (mapRoot.firstChild) {
		    	mapRoot.removeChild(mapRoot.firstChild);
			}
			mapRoot.style.visibility = "hidden";
		}
	}

	renderCell(block_idx,i,j)
	{
		if(!this.renderReady)
			return;

		if(this.viewMode==0)
			return;

		let $builds = require('../../mlGame/core/consCtrl.js').default.builds;
		let bd = document.getElementById("cell_build_"+i+"_"+j);
		let m = mapCtrl.getBlockByIdx(block_idx);
		let cell = m.data.cells[i*m.data.width+j];
		let idx = cell.data.build;

		if(idx==-1)
		{
			bd.src="";
			bd.style.visibility="hidden";
			return;
		}

		let lv = $builds[$ply.side()][idx].data.lv;
		let bid = $builds[$ply.side()][idx].data.id;

		if($bdData[bid].lvl)
		{
			console.log("lv="+lv);
			let img = "/static/img/mlGame/bd_"+$bdData[bid].lvl[lv].img+".png";
			bd.src=img;
		}
		else
		{
			let img = "/static/img/mlGame/bd_"+$bdData[bid].img+".png";
			bd.src=img;
		}
		bd.style.visibility="visible";
	}

	renderBlock(block)
	{
		if(block.data.cells==-1)
			block.createCell();

		let id = block.data.id;
		let w = block.data.width;
		let cell;
		let cell_id;
		let mapRoot = document.getElementById("block");
		let center_cell_x = 350;
		let offset = Math.floor((5-w)/2*width);

		for(let i=0;i<w;i++)
    	{
    		for(let j=0;j<w;j++)
    		{
    			cell = block.data.cells[i*w+j];
    			cell_id = cell.data.id;
    			let left = i*width + center_cell_x + offset;
				let top = (w-j-1)*width + 100 + offset;
				let div = document.createElement("div");
				let bk = document.createElement("img");
				let bd = document.createElement("img");
				bk.id = "cell_img_"+i+"_"+j;
				bk.src= "/static/img/mlGame/cell_"+$cellTile[cell_id].img+".png";
				bk.classList.add("mapTile");
				bd.id = "cell_build_"+i+"_"+j;
				bd.src="";
				bd.classList.add("mapTileNo");
				div.appendChild(bk);
				div.appendChild(bd);
				//bk.style.border = "1px solid green";
				div.classList.add("map");
				div.id = "cell_"+i+"_"+j;
				div.style.top = top+"px";
				div.style.left = left+"px";

				//禁用chrome的拖拽图片
				div.onmousedown = (e)=>{
				    e.preventDefault()
				}
				//响应左键事件
				div.onmouseup = (e)=>{
				    this.onLeftCell(i,j);
				}
				mapRoot.appendChild(div);

				this.renderCell(block.data.idx,i,j);
    		}
    	}
	}

	switchView(mode)
	{
		this.viewMode = mode;
		if(mode==0)
		{
			this.showBlock(false);
			showBlockInfo(false);
			showWorldTiles();
			this.renderWorld();
		}
		else
		{
			let block_x = this.curBlock.x;
			let block_y = this.curBlock.y;
			let block = mapCtrl.getBlockByPos(block_x, block_y);
			if(!block||!block.data.hasCell)
			{
				this.viewMode = 0;
				return;
			}
			hideWorldTiles();
			showBlockInfo(true);
			this.showBlock(true);
			this.renderBlock(block);
		}
		hideSel();
		hideMapTip();
		refreshBtn();
	}

	getBlockTile(x,y)
	{
		let xmin = this.WorldViewCenter.x - centerx + 1;
		let ymin = this.WorldViewCenter.y - centery + 1;
		let xi = x - xmin;	//绘图坐标
		let xj = y - ymin;	//绘图坐标
		var div = document.getElementById("tile_"+xi+"_"+xj);
		return div;
	}

	getBorder(x,y)
	{
		let xmin = this.WorldViewCenter.x - centerx + 1;
		let ymin = this.WorldViewCenter.y - centery + 1;
		let xi = x - xmin;	//绘图坐标
		let xj = y - ymin;	//绘图坐标
		var div = document.getElementById("border_"+xi+"_"+xj);
		return div;
	}

	renderBorderPos(x,y)
	{
		if(!this.inWorldView(x,y))
			return;

		let div = this.getBorder(x,y);
		if(!div)
			return;

		if(this.showBorder==false)
		{
			div.style.visibility="hidden";
			return;
		}
		else
			div.style.visibility="visible";

		var m = mapCtrl.getBlockByPos(x, y);
		var s = m.data.ownBy;

		//判断上边
		if(this.inWorldView(x,y+1))
		{
			var s1 = mapCtrl.getBlockByPos(x, y+1).data.ownBy;
			if(s1==s)
			{
				div.style.borderTop = "";
				let d = this.getBorder(x,y+1);
				d.style.borderBottom = "";
			}
			else
			{
				this.renderSgB("borderTop",s,div);
			}
		}
		else
		{
			//不在范围
			this.renderSgB("borderTop",s,div);
		}
		
		if(this.inWorldView(x,y-1))
		{
			var s1 = mapCtrl.getBlockByPos(x, y-1).data.ownBy;
			if(s1==s)
			{
				div.style.borderBottom = "";
				let d = this.getBorder(x,y-1);
				d.style.borderTop = "";
			}
			else
			{
				this.renderSgB("borderBottom",s,div);
			}
		}
		else
		{
			//不在范围
			this.renderSgB("borderBottom",s,div);
		}
		if(this.inWorldView(x+1,y))
		{
			var s1 = mapCtrl.getBlockByPos(x+1, y).data.ownBy;
			if(s1==s)
			{
				div.style.borderRight = "";
				let d = this.getBorder(x+1,y);
				d.style.borderLeft = "";
			}
			else
			{
				this.renderSgB("borderRight",s,div);
			}
		}
		else
		{
			//不在范围
			this.renderSgB("borderRight",s,div);
		}
		if(this.inWorldView(x-1,y))
		{
			var s1 = mapCtrl.getBlockByPos(x-1, y).data.ownBy;
			if(s1==s)
			{
				div.style.borderLeft = "";
				let d = this.getBorder(x-1,y);
				d.style.borderRight = "";
			}
			else
			{
				this.renderSgB("borderLeft",s,div);
			}
		}
		else
		{
			//不在范围
			this.renderSgB("borderLeft",s,div);
		}
	}

	renderSgB(b,s,el)
	{
		if(s==$ply.side())
		{
			el.style[b]="1px solid green";
		}
		else if(s==0)
		{
			el.style[b]="";
		}
		else
		{
			el.style[b]="1px solid red";
		}
	}

	renderWorld()
	{
		var img;
		var m;
		var startx = this.WorldViewCenter.x - centerx + 1;
		var starty = this.WorldViewCenter.y - centery + 1;
		var x,y;
		var id;

		for(var i=0;i<maxx;i++)
		{
			for(var j=0;j<maxy;j++)
			{
				x = startx+i;
				y = starty+j;
				m = mapCtrl.getBlockByPos(x, y);
				id = m.data.id;
				img = document.getElementById("tile_img_"+i+"_"+j);
				img.src = "/static/img/mlGame/tile_"+$block[id].img+".png"
				this.renderBuild(m);
				this.renderBorderPos(x,y);
			}
		}
	}

	renderBuild(b)
	{
		if(this.viewMode==1)
			return;
		
		let t = b.data.type;
		if(t==1)
		{
			let pop = b.data.pop;
			if(pop==0)
			{
				div.visibility="hidden";
				return;
			}
			let len = $typeName[t].img.length;
			let img;
			for(let i=0;i<len;i++)
			{
				if(pop>=$typeName[t].img[i].pop)
				{
					img = $typeName[t].img[i].img;
					break;
				}
			}
			let xmin = this.WorldViewCenter.x - centerx + 1;
			let ymin = this.WorldViewCenter.y - centery + 1;
			let xi = b.data.x - xmin;	//绘图坐标
			let xj = b.data.y - ymin;	//绘图坐标
			let div = document.getElementById("tile_build_"+xi+"_"+xj);
			div.style.visibility="visible";
			div.src = "/static/img/mlGame/bt_1_"+img+".png";
		}
	}

	posInWorld(px,py)
	{
		if(px<0||py<0||px>=MAXCELL||py>=MAXCELL)
			return false;
		return true;
	}

	//传入坐标是否在当前世界视图
	inWorldView(px,py)
	{
		if(px<0||py<0||px>=MAXCELL||py>=MAXCELL)
			return false;
		let xmin = this.WorldViewCenter.x - centerx + 1;
		let ymin = this.WorldViewCenter.y - centery + 1;
		let xmax = xmin + (maxx-1);
		let ymax = ymin + (maxy-1);
		if(px>=xmin&&px<=xmax&&py>=ymin&&py<=ymax)
			return true;
		return false;
	}

	renderBorder()
	{
		let startx = this.WorldViewCenter.x - centerx + 1;
		let starty = this.WorldViewCenter.y - centery + 1;
		let x,y;
		for(var i=0;i<maxx;i++)
		{
			for(var j=0;j<maxy;j++)
			{
				x = startx+i;
				y = starty+j;
				this.renderBorderPos(x,y);
			}
		}
	}

	setworldSelect(x,y,pi,pj)
	{
		let i=pi||(x-(this.WorldViewCenter.x - centerx + 1));
		let j=pj||(y-(this.WorldViewCenter.y - centery + 1));
		this.lastWorldSel.x = this.worldSelect.x;
		this.lastWorldSel.y = this.worldSelect.y;
		this.lastWorldSel.i = this.worldSelect.i;
		this.lastWorldSel.j = this.worldSelect.j;
		this.worldSelect.x = x;
		this.worldSelect.y = y;
		this.worldSelect.i = i;
		this.worldSelect.j = j;	
		this.setCurBlock();
	}

	setCurBlock(x,y)
	{
		this.curBlock.x = this.worldSelect.x;
		this.curBlock.y = this.worldSelect.y;
	}

	onLeftClickTile(i,j)
	{
		let startx = this.WorldViewCenter.x - centerx + 1;
		let starty = this.WorldViewCenter.y - centery + 1;
		let x = startx + i;
		let y = starty + j;
		this.setworldSelect(x,y,i,j)
		refreshAcB()
		renderSel();
	}

	onLeftCell(i,j)
	{
		this.cellSelect.x = i;
		this.cellSelect.y = j;
		renderSel();
	}

	renderSelTip()
	{
		showMapTip();
	}
}

function mapName(m)
{
	let t = m.data.type;
	return $typeName[t].name;
}

function showMapTip()
{
	let tip = document.getElementById("mapInfo");
	tip.style.visibility = "visible";
	if(mapView.viewMode==0)
	{
		let x = mapView.worldSelect.x;
		let y = mapView.worldSelect.y;
		if(x==-1||y==-1)
		{
			tip.innerText = "";
			return;
		}
		let m = mapCtrl.getBlockByPos(x, y);
		let id = m.data.id;
		let own = m.data.ownBy;
		let t = m.data.type;
		let name= $block[id].name;

		if(own==$ply.side())
		{
			if(t==0)
			{
				tip.innerText = name+" ( "+x+","+y+" )"+"，"+$typeName[t].name;
			}
			else
			{
				tip.innerText = $typeName[t].name+" ( "+x+","+y+" )";
			}

		}
		else if(own==0)
		{
			tip.innerText = name+" ( "+x+","+y+" )";
			//tip.innerText = tip.innerText + "，无主";
		}
		else
		{
			tip.innerText = name+" ( "+x+","+y+" )";
			tip.innerText = tip.innerText + "，被占";
		}
	}
	else
	{
		let i = mapView.cellSelect.x;
		let j = mapView.cellSelect.y;
		if(i==-1||j==-1)
		{
			tip.innerText = "";
			return;
		}
		let x = mapView.curBlock.x;
		let y = mapView.curBlock.y;
		let m = mapCtrl.getBlockByPos(x, y);
		let cell = m.data.cells[i*m.data.width+j];
    	let cell_id = cell.data.id;
    	let bidx = cell.data.build;
    	if(bidx==-1)
    	{
			tip.innerText = $cellTile[cell_id].name;
    	}
		else
		{
			let $builds = require('../../mlGame/core/consCtrl.js').default.builds;
			let lv = $builds[$ply.side()][bidx].data.lv;
			let bid = $builds[$ply.side()][bidx].data.id;
			if($bdData[bid].lvl)
			{
				tip.innerText = $bdData[bid].lvl[lv].name;
			}
			else
			{
				tip.innerText = $bdData[bid].name;
			}
		}
	}
}

function showBlockInfo(v)
{
	let tip = document.getElementById("blockInfo");
	if(v)
	{
		let x = mapView.curBlock.x;
		let y = mapView.curBlock.y;
		let m = mapCtrl.getBlockByPos(x, y);
		tip.style.visibility = "visible";
		tip.innerText = "【"+mapName(m)+"】"+"( "+x+","+y+" )";
		if(m.data.ownBy==$ply.side())
			tip.innerText+="，这块地属于你";
	}
	else
		tip.style.visibility = "hidden";
}

function hideMapTip()
{
	let tip = document.getElementById("mapInfo");
	tip.style.visibility = "hidden";	
}

function hideWorldTiles()
{
	let mapRoot = document.getElementById("world");
	mapRoot.style.visibility = "hidden";
}

function showWorldTiles()
{
	let mapRoot = document.getElementById("world");
	mapRoot.style.visibility = "visible";
}

function createWorldTiles()
{
	let mapRoot = document.getElementById("world");
	for(let i=0;i<maxx;i++)
	{
		for(let j=0;j<maxy;j++)
		{
			let left = i*width+leftGap;
			let top = (maxy-j-1)*width+topGap;
			let div = document.createElement("div");
			let bk = document.createElement("img");
			//let pos = document.createElement("div");
			let bd = document.createElement("img");
			let border = document.createElement("div");
			bk.id = "tile_img_"+i+"_"+j;
			bk.src="";
			bk.classList.add("mapTile");
			bd.id = "tile_build_"+i+"_"+j;
			bd.src="";
			bd.classList.add("mapTileNo");
			border.id = "border_"+i+"_"+j;
			border.classList.add("border");
			border.style.opacity = "0.5";
			div.appendChild(bk);
			div.appendChild(border);
			div.appendChild(bd);
			//div.appendChild(pos);
			//pos.id = "tilePos_"+i+"_"+j;
			//pos.classList.add("tilePos");
			//div.innerHTML="<img class=\"mapTile\" id=\""+"tile_img_"+i+"_"+j+"\" src=\"\">"
			//div.innerText=i+","+j;
			div.classList.add("map");
			div.id = "tile_"+i+"_"+j;
			div.style.top = top+"px";
			div.style.left = left+"px";

			//禁用chrome的拖拽图片
			div.onmousedown = (e)=>{
			    e.preventDefault()
			}
			//响应左键事件
			div.onmouseup = (e)=>{
			    mapView.onLeftClickTile(i,j);
			}
			/*
			div.addEventListener("mouseup", (e) => {
				mapCtrl.onLeftClickTile(i,j);
			})
			*/
			mapRoot.appendChild(div);
		}
	}	
}

function onBlockView()
{
	mapView.switchView(1);
}

function onWorldView()
{
	mapView.switchView(0);
}

function onClickExplore()
{
	if(mapView.showBorder)
	{
		mapView.showBorder = false;
		document.getElementById("explore").innerText="显示边界";
	}
	else
	{
		mapView.showBorder = true;
		document.getElementById("explore").innerText="隐藏边界";
	}

	let startx = mapView.WorldViewCenter.x - centerx + 1;
	let starty = mapView.WorldViewCenter.y - centery + 1;
	let x,y;
	for(var i=0;i<maxx;i++)
	{
		for(var j=0;j<maxy;j++)
		{
			x = startx+i;
			y = starty+j;
			mapView.renderBorderPos(x,y);
		}
	}
}

function onClickBuy()
{

}


function assignBlock()
{
	let mengban = document.getElementById("mengban");
	let assign = document.getElementById("build");

	let x = mapView.worldSelect.x;
	let y = mapView.worldSelect.y;
	let m = mapCtrl.getBlockByPos(x, y);
	let t = m.data.type;
	let len = $typeName[t].to.length;
	console.log(len);
	if(len<1)
		return;

	let assignTitle = document.getElementById("assignTitle");
	assignTitle.innerText = $typeName[t].desc;
	

	let choiceArea = document.getElementById("choiceArea");
	while (choiceArea.firstChild) {
    	choiceArea.removeChild(choiceArea.firstChild);
	}

	for(let i=0;i<len;i++)
	{
		let div = document.createElement("div");
		div.classList.add("choice");
		div.style.top = 8+2.5*i+"em";
		div.innerText = "【"+$typeName[$typeName[t].to[i]].name+"】";
		div.innerText+= "："+$typeName[$typeName[t].to[i]].desc;
		div.onclick = ()=>
		{
			mapCtrl.setBlockType(x,y,$typeName[t].to[i]);
			mengban.style.visibility = "hidden";
			assign.style.visibility = "hidden";
			renderSel();
			refreshBtn();
		}
		choiceArea.appendChild(div);
	}

	mengban.style.visibility = "visible";
	assign.style.visibility = "visible";


}

function conquer()
{
	let x = mapCtrl.worldSelect.x;
	let y = mapCtrl.worldSelect.y;
	mapCtrl.capturePosByUnit(x,y,$ply);
}

function refreshAcB()
{
	refreshBtn();
}

function renderSel()
{
	if(mapView.viewMode==0)
	{
		let px = mapView.worldSelect.x;
		let py = mapView.worldSelect.y;

		if(!mapView.inWorldView(px,py))
			return;

		let xmin = mapView.WorldViewCenter.x - centerx + 1;
		let ymin = mapView.WorldViewCenter.y - centery + 1;
		let xmax = xmin + (maxx-1);
		let ymax = ymin + (maxy-1);
		if(px>=xmin&&px<=xmax&&py>=ymin&&py<=ymax)
		{
			let i = px - xmin;
			let j = py - ymin;
			//console.log(i+","+j);
			let div = document.getElementById("tile_"+i+"_"+j);
			let left = div.offsetLeft;
			let top = div.offsetTop;
			let flag = document.getElementById("sel");
			flag.style.border = "solid 1px yellow";
			flag.style.visibility="visible";
			//console.log(top+","+left);
			flag.style.top = top+"px";
			flag.style.left = left+"px";
		}
	}
	else
	{
		let i = mapView.cellSelect.x;
		let j = mapView.cellSelect.y;
		let div = document.getElementById("cell_"+i+"_"+j);
		let left = div.offsetLeft;
		let top = div.offsetTop;
		let flag = document.getElementById("sel");
		flag.style.border = "solid 1px yellow";
		flag.style.visibility="visible";
		flag.style.top = top+"px";
		flag.style.left = left+"px";
	}
	showMapTip();
}

function hideSel()
{
	let flag = document.getElementById("sel");
	flag.style.visibility="hidden";
	//mapCtrl.setworldSelect(-1,-1,-1,-1)
}

function initMapActBtn()
{
	let rt = document.getElementById("mapAct");
	if(mapView.viewMode==0)
	{
		let x = mapView.worldSelect.x;
		let y = mapView.worldSelect.y;
		if(x==-1||y==-1)
			return;
		let m = mapCtrl.getBlockByPos(x, y);
		let id = m.data.id;
		let own = m.data.ownBy;
		let t = m.data.type;
		if(own==$ply.side())
		{
			if(t!=0&&t!=99)
			{
				adMpAcBtn("建设地块","build",onBlockView,false);
			}
			else if(t==0)
			{
				adMpAcBtn("分配建设类型","assign",assignBlock,false);
			}
		}
		
		if(!mapView.showBorder)
			adMpAcBtn("显示边界","explore",onClickExplore,false);
		else
			adMpAcBtn("隐藏边界","explore",onClickExplore,false);
	}
	else
	{
		adMpAcBtn("回到世界","build",onWorldView,false);
	}
}

function refreshBtn()
{
	let rt = document.getElementById("mapAct");
	while (rt.firstChild) {
    	rt.removeChild(rt.firstChild);
	}
	initMapActBtn();
}

function adMpAcBtn(name,id,fun,f)
{
	let rt = document.getElementById("mapAct");
	let btn = document.createElement("button");
	btn.classList.add("mapActBtn");
	btn.innerText = name;
	btn.id=id;
	btn.disabled=f;
	btn.addEventListener("click", () => {fun()})
	rt.appendChild(btn);
}


document.onkeydown = ()=>{
	var oEvent = window.event;
	if(oEvent.keyCode ==27) 
	{
		hideSel();
		hideMapTip();
	}
}


var mapView = new _mapView();

export default { mapView };