const names = {
	'food':"谷物",
	'wood':"木材",
	'iron':"生铁",
	'stone':"石头",
	'animal':"动物",
	'wood_commodity':"木质日用品",
	'meat':"肉食",
	'iron_commodity':"铁质日用品",
	'bread':"面包",
};

const cons_sheet = 
[
	{
		name:"基本",
		list:[0,1,2,3,4,5],
	},
	{
		name:"生产",
		list:[11,12,13,14],
	},
	{
		name:"原材料",
		list:[6,7,8,9,10],
	},
	{
		name:"功能",
		list:[15,16,17],
	},
];

const construct = 
[
	{
		id:0,
		name:'居民区',
		desc:'居民区会吸引市民来居住。居民提供税收和劳动力。如果附近居住水平提升的话，会吸引更富有的人和更多的居民来居住。但富有的人也消耗更多的资源。',
		cost:0,
		img:'village_0',
		type:0,			//居民区类型
		lvl:
		[
			{
				lv:0,
				name:"居民区空地",
				max:0,
				consume:
				[
				],
				upgrade:
				[
				],
				upg_wait:0,
				upg_prop:80,
				img:'00_00',
				down_pop:0,
				tax:0,
			},
			{
				lv:1,
				name:"帐篷",
				max:2,
				consume:
				[
					{type:"food",num:1},
				],
				upgrade:
				[
					{type:'wood',num:10},
					{type:'stone',num:10},
				],
				upg_wait:2,
				upg_prop:80,
				img:'00_01',
				down_pop:0,
				tax:1,
			},
			{
				lv:2,
				name:"简陋的房屋",
				max:5,
				consume:
				[
					{type:"food",num:5},
				],
				upgrade:
				[
					{type:'wood',num:10},
					{type:'stone',num:10},
					{type:'gold',num:10},
				],
				upg_wait:4,
				upg_prop:50,
				img:'00_02',
				down_pop:2,
				tax:3,
			},
		],
	},
	{
		id:1,
		name:'市场',
		desc:'市场为附近3格的居民提供更多样化的食物，如果没有市场，居民区只会出现贫民住帐篷。',
		cost:0,
		img:'market_0',
		type:4,						//无存储型产出建筑物
		work:
		{
			num:5,
		},
	},
	{
		id:2,
		name:'用品店',
		desc:'用品店为附近2格的居民提供日用品，提升居民生活水平。用品店需要至少5个人才能运作。',
		cost:0,
		img:'yongpin_0',
		type:3,						//自存储型产出建筑物
		work:
		{
			num:5,
			give:20,
			type:'wood_commodity',
		},
	},
	{
		id:3,
		name:'农田',
		desc:'农田提供粮食，每块农田至少需要10个人才能运作。',
		cost:20,
		img:'crop_0',
		type:2,			//2：产出型建筑物
		work:
		{
			num:10,
			give:20,
			type:'food',
		},
	},
	{
		id:4,
		name:'伐木场',
		desc:'伐木场从附近1格以内的树木收集木材，每个树林只能被一个伐木场收集，每个伐木场至少需要10人才能运作。',
		cost:20,
		img:'wood_0',
		type:2,	
		work:
		{
			worker:10,
			give:10,
			type:'wood',
		},
	},
	{
		id:5,
		name:'采石场',
		desc:'采石场从原地挖坑收集石头',
		need:'需要平原',
		gold:20,
		area:0,
		img:'caishichang_0',
		type:2,	
		work:
		{
			worker:5,
			max:100,
			type:'stone',
		},
	},
	{
		id:6,
		name:'铁矿场',
		desc:'铁矿场从附近1格以内的铁矿收集铁，每个铁矿只能被1个铁矿场收集',
		need:'需要平原',
		gold:20,
		area:0,
		img:'tiekuangc_0',
		type:2,	
		work:
		{
			worker:5,
			max:100,
			type:'iron',
		},
	},
	{
		id:7,
		name:'面包房',
		desc:'面包房从附近的粮仓获得面粉，加工为面包',
		need:'需要平原',
		gold:20,
		area:0,
		img:'mianbao',
		type:3,	
		work:
		{
			worker:5,
			max:10,
			type:'bread',
		},
	},
	{
		id:8,
		name:'工坊',
		desc:'工坊从附近的仓库获取木材，加工为一般木质日用品',
		need:'需要平原',
		gold:20,
		area:0,
		img:'gongfang_0',
		type:3,	
		work:
		{
			worker:5,
			max:10,
			type:'wood_commodity',
		},
	},
	{
		id:9,
		name:'铁匠铺',
		desc:'铁匠铺从附近的仓库收集生铁，加工为铁质日用品，或武器防具',
		need:'需要平原',
		gold:20,
		area:2,
		img:'tiejiangpu_0',
		type:3,	
		work:
		{
			worker:5,
			max:10,
			type:'iron_commodity',
		},
	},
	{
		id:10,
		name:'酒馆',
		desc:'酒馆为附近居民区娱乐，并且可以在这里遇见英雄',
		need:'需要平原',
		gold:200,
		area:2,
		img:'jiuguan_0',
		type:4,	
	},
	{
		id:11,
		name:'医院',
		desc:'医院为英雄及市民进行质量',
		need:'需要平原',
		gold:200,
		area:2,
		img:'yiyuan_0',
		type:4,	
	},
	{
		id:12,
		name:'花园',
		desc:'花园为附近居民区提供更好的景观和娱乐',
		need:'需要平原',
		gold:200,
		area:2,
		img:'garden_0',
		type:4,	
	},
];

export default { names,construct,cons_sheet }; 