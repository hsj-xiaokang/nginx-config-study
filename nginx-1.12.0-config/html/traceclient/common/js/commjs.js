
/* IP */
const httpIp = 'http://10.88.20.84';

/* 端口8761 */
const httpPort1 = '8761';

/* 端口8763 */
const httpPort3 = '8763';

/* 端口8764 */
const httpPort4 = '8764';

/* 端口8765 */
const httpPort5 = '8765';

/* IP1 */
const httpPath1 = httpIp + ':' + httpPort1;
//const httpPath1 = '';

/* IP3 */
const httpPath3 = httpIp + ':' + httpPort3;
//const httpPath3 = '';

/* IP4 */
const httpPath4 = httpIp + ':' + httpPort4;
//const httpPath4 = '';

/* IP5 */
const httpPath5 = httpIp + ':' + httpPort5;
//const httpPath5 = '';

/* 上传照片、视频 */
const uploadImage = httpPath1 + '/trc-service-enterprise/enterprise/fileservice/upload';

/* 上传照片-base64 */
const uploadImageByBase64 = httpPath1 + '/trc-service-enterprise/enterprise/fileservice/base64/upload';

/* 首页添加访问记录 */
const visitTake = httpPath5 + '/trc-service-system/pageview/saveHomeView';

/* 查询防伪码 */
const searchFackCode =  httpPath3 + '/trc-service-product/production/client/queryProductionByTraceNoOrFakeNo';

/* 广告列表 */
const advert = httpPath3 + '/trc-service-product/production/client/queryAllShowHomePageByProduction';

/* 用户登录 */
const login =  httpPath5 + '/trc-service-system/users/login?plattype=role_front';

/* 获取验证码 */
const verifyCode = httpPath5 + '/trc-service-system/users/sendNoteToUsernameByVerificode';

/* 验证验证码 */
const verifyCodeFlag = httpPath5 + '/trc-service-system/users/checkUserVerificode';

/* 获取产品类型列表 */
const productTypeList = httpPath3 + '/trc-service-product/production/commons/queryProductionType';

/* 获取精选产品列表 */
const goodProductList = httpPath3 + '/trc-service-product/production/client/queryAllProductionByChoice';

/* 获取审核状态列表 */
const statusList = httpPath3 + '/trc-service-product/production/commons/queryAllProductionStatus';

/* 获取追溯档案列表 */
const productList = httpPath3 + '/trc-service-product/production/client/queryUserCenterProduction';

/* 获取父级分类下的子级分类 */
const sunProductTypeList = httpPath3 + '/trc-service-product/production/commons/queryProductionType';

/* 获取企业信息 */
const enterpriseInfo = httpPath1 + '/trc-service-enterprise/enterprise/client/queryEnterpriseInfoById';

/* 获取企业信息下的全部产品 */
const allProductionByEnterprise = httpPath3 + '/trc-service-product/production/client/queryAllProductionByEnterprise';

/* 编辑企业信息 */
const updateEnterprise = httpPath1 + '/trc-service-enterprise/enterprise/client/updateEnterpriseFromUserCenter';

/* 新增企业信息 */
const addEnterprise = httpPath1 + '/trc-service-enterprise/enterprise/addEnterprise';

/* 企业拥有的产品数量 */
const productionCount = httpPath3 + '/trc-service-product/production/client/queryProductionCountByEnterpriseId';

/* 检车产品名称是否重名 */
const productNameFlag = httpPath3 + '/trc-service-product/production/client/checkTraceArchivesNameIsRepeat';

/* 获取省份 */
const address = httpPath5 + '/trc-service-system/position/queryPosition';

const addressProvince = httpPath5 + '/trc-service-system/position/queryPosition';

/* 获取企业资质列表 */
const getNatural = httpPath1 + '/trc-service-enterprise/enterprise/client/queryEnterpriseQualifications';

/* 删除企业资质 */
const deleteNatural = httpPath1 + '/trc-service-enterprise/enterprise/client/deleteEnterpriseQualifications';

/* 用户中心 -更改密码 */
const inChangePassword = httpPath5 + '/trc-service-system/users/changeUserPassword';

/* 获取消息列表 */
const message = httpPath5 + '/trc-service-system/message/queryMessage';

/* 未读消息 */
const messageCount = httpPath5 + '/trc-service-system/message/queryMessageNoread';

/* 查询出列表显示用的产品证书信息 */
const queryAllProductionAuthentication  = httpPath3 + '/trc-service-product/productionAuthentication/queryAllProductionAuthentication';

/* 打印追溯码 */
const putTrace = httpPath3 + '/trc-service-product/production/client/printTraceNoQRCode';

/* 添加防伪码 */
const addTrace = httpPath3 + '/trc-service-product/production/client/addFakeArchivesHistory';

/* 根据添加防伪码的历史打印防伪码 */
const printFakeNoQRCodeByFakeArchivesHistory =  httpPath3 + '/trc-service-product/production/client/printFakeNoQRCodeByFakeArchivesHistory';

/* 防伪码历史 */
const fakeArchivesHistory = httpPath3 + '/trc-service-product/production/client/queryFakeArchivesHistory';

/* 根据用户id获取该企业信息 */
const enterpriseByUserId = httpPath1 + '/trc-service-enterprise/enterprise/client/queryEnterpriseByUserId';

/* 获取企业资质列表 */
const addNatural = httpPath1 + '/trc-service-enterprise/enterprise/client/addEnterpriseQualifications';

/* 添加产品档案 */
const addProduction = httpPath3 + '/trc-service-product/production/client/addProduction';

/* 获取地块 */
const land = 'http://smart.agthings.cn:7010/acp-web-platform/org/queryAll/gstar/10000';

/* 下载二维码 */
const downErweima = httpPath3 + '/trc-service-product/production/client/downloadFakeNoQRCodeByFakeArchivesHistory';

/* 下载追溯二维码 */
const downZhuisu = httpPath3 + '/trc-service-product/production/client/downloadTraceNoQRCode';
/**
 *
 *  政府
 *
 */

/* 获取今天、昨天的数据 */
const staticTime = httpPath4 + '/trc-service-report/report/staticLatestTwoDaysTime';

/* 获取报表统计相关数据 */
const visitCount = httpPath4 + '/trc-service-report/report/queryVisitCount';

/* 获取有无防伪码列表 */
const dictByHaveCreateFake = httpPath3 + '/trc-service-product/production/commons/queryDictByHaveCreateFake';

/* 获取排列方式 */
const sortWay = httpPath3 + '/trc-service-product/production/commons/queryDictByQueryTraceArchivesOrderBy';

/* 获取表格数据 */
const tableData = httpPath3 + '/trc-service-product/production/client/queryTraceArchivesForReportStatisticsFromUserCenter';

/* 导出报表 */
const FromUserCenter =  httpPath3 + '/trc-service-product/production/exportTraceArchivesForReportStatisticsFromUserCenter';

/* 会员登录汇总企业、档案、防伪的数量 */
const traceAllNumber = httpPath3 + '/trc-service-product/production/client/statisticsTraceArchivesForReportStatisticsFromUserCenter';


/**
 *  产品档案详情相关接口
 */

/* 获取产品档案详情  */
const detailedProduct = httpPath3 + '/trc-service-product/production/client/queryProductionByIdForChoice';

/*
*
*
*  方法
*
* */
/* 获取地址栏参数 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)return  unescape(r[2]); return null;
}





