const routes = [{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		//aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		path: '/pages/index/index',
		name: 'index',
		meta: {
			title: '主页',
		},
	},
	{
		path: '/pages/index/scale',
		name: 'scale',
		meta: {
			title: '',
		},
	},

	{
		"path": "/pages/recipe/index",
		name: 'recipe',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/motion",
		name: 'motion',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/nutrition",
		name: 'nutrition',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/nutriDetail",
		name: 'nutriDetail',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/pharmacy",
		name: 'pharmacy',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/recipelDetail",
		name: 'recipelDetail',
		meta: {
			title: '处方',
		},
	},
	{
		"path": "/pages1/recipe/bluetooth",
		name: 'bluetooth',
		meta: {
			title: '处方',
		},
	},

	{
		"path": "/pages/site/scanQR",
		name: 'scanQR',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages/user/selectuser",
		name: 'selectuser',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages/user/authorize",
		name: 'authorize',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages/user/binding",
		name: 'binding',
		meta: {
			title: '',
		},
	},
	
	
	{
		"path": "/pages1/scale/write",
		name: 'write',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/scale/score",
		name: 'score',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/scale/records",
		name: 'records',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/user/baseInfo",
		name: 'baseInfo',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/basic",
		name: 'healthybasic',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/disease",
		name: 'disease',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/testing",
		name: 'testing',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/testitem",
		name: 'testitem',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/testlist",
		name: 'testlist',
		meta: {
			title: '',
		},
	},
	{
		"path": "/pages1/healthy/testrecord",
		name: 'testrecord',
		meta: {
			title: '',
		},
	},
	
	
	
	
	
	

	{

		path: '/pages/site/qrcode',

		name: 'qrcode',
		meta: {
			title: '二维码',
		},
	},
	{

		path: '/pages/patient/patientDetail',

		name: 'patientDetail',
		meta: {
			title: '患者详情',
		},
	},
	{

		path: '/pages/patient/healthRecords',
		name: 'healthRecords',
		meta: {
			title: '健康档案',
		},
	},
	{

		path: '/pages/patient/sportRecord',
		
		name: 'sportRecord',
		meta: {
			title: '运动记录',
		},
	},
	{
		path: '/pages/patient/scaleAssess',
		name: 'scaleAssess',
		meta: {
			title: '量表评估',
		},
	},
	{
		path: '/pages/patient/assessDetail',
		name: 'assessDetail',
		meta: {
			title: '评估详情',
		},
	},




	{
		path: '/pages/user/people',
		name: 'people',
		meta: {
			title: '个人中心',
		},
	},
	{
		path: '/pages/user/userdetail',
		name: 'userdetail',
		meta: {
			title: '个人详情',
		},
	},
	{
		path: '/pages/user/about',
		name: 'about',
		meta: {
			title: '关于',
		},
	},
	{
		path: '/pages/register/register',
		name: 'register',
		meta: {
			title: '注册',
		},
	},
	

]
export default routes
