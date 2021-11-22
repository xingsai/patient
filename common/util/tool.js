export const debounce = function(func, wait=200, immediate) {
	//函数防抖[func 函数,wait 延迟执行毫秒数,immediate true 表立即执行,false 表非立即执行,立即执行是触发事件后函数会立即执行，然后n秒内不触发事件才能继续执行函数的效果] 
	//所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		if (timeout) clearTimeout(timeout);
		if (immediate) {
			var callNow = !timeout;
			timeout = setTimeout(() => {
				timeout = null;
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timeout = setTimeout(function() {
				func.apply(context, args)
			}, wait);
		}
	}
}

export const throttle = function(fn, interval) {
	
	//函数节流 [func 函数 wait 延迟执行毫秒数 type 1 表时间戳版，2 表定时器版] 
	//所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数
	var last;
	var timer;
	var interval = interval || 200;
	return function() {
		var th = this;
		var args = arguments;
		var now = +new Date();
		if (last && now - last < interval) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				last = now;
				fn.apply(th, args);
			}, interval);
		} else {
			last = now;
			fn.apply(th, args);
		}
	}

}
/**
 * @desc   深度拷贝数组对象
 * @param  {Any} values  必填
 */
export function deepCopy(values) {
    let copy;
    if (null == values || "object" != typeof values) return values;
    if (values instanceof Date) {
        copy = new Date();
        copy.setTime(values.getTime());
        return copy;
    }
    if (values instanceof Array) {
        copy = [];
        for (let i = 0, len = values.length; i < len; i++) {
            copy[i] = deepCopy(values[i]);
        }
        return copy;
    }
    if (values instanceof Object) {
        copy = {};
        for (let attr in values) {
            if (values.hasOwnProperty(attr)) copy[attr] = deepCopy(values[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy values! Its type isn't supported.");
}
export function parseTime(time, cFormat) {
	console.log(time)
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
/**
 * @todo 验证手机号
 * @desc 验证规则：11位数字，以1开头。
 */
export function checkMobile(str) {
    var re = /^1\d{10}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @todo 验证身份证
 * @param {*} identNumber 
 */
export function checkIdcard (str) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    if (!reg.test(str)) {  
        // alert("身份证输入不合法");  
        return false;  
    } else {
        return true;
    }
}

/**
 * @todo 切割时间
 * @desc 例如："2019-05-29 10:01:00" 切割成 "2019-05-29"
 */
export function spliceTimeStr (str) {
    if (/\s+/.test(str)) {
        var reg = str.match(/.*[\s$]/g)[0];
        return reg;
    } else {
        return str;
    } 
}

export function serializeParams(str) {
    const paramsObj = {}
    const paramsStr = str.split('?')[1]
    if (paramsStr) {
        const paramsArr = paramsStr.split('&')
        paramsArr.forEach(item => {
            const characterSet  = item.split('=')
            const key = characterSet[0]
            const value = characterSet[1]

            paramsObj[key] = value
        })
    }
    return paramsObj
}

/**
 * @desc querystring
 */
export function getQueryString (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
      return r[2]
    }
    return null;
}