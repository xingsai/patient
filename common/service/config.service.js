let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'https://caredev.schillerchina.com' // 开发环境
} else {
	BASE_URL = 'https://caredev.schillerchina.com' // 生产环境
}
let staticDomainURL = BASE_URL+ '/storage/';

const configService = {
	apiUrl: BASE_URL+"/api",
	staticDomainURL: staticDomainURL
};

export default configService
