/*!
 * project : lobby
 * author : LINOFFICE
 * 로비
 */

function commaAdd(amt) {
	let str = String(amt);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

let getDatas = function (urls, resolvedCallback, rejectedCallback) {
	let promises = [];

	for (let i = 0, max = urls.length; i < max; i++) {
		const promise = $.ajax({
			type: 'GET',
			url: urls[i],
			dataType: 'json'
		});
		promises.push(promise);
	}

	$.when.apply($, promises)
		.then(resolvedCallback)
		.fail(rejectedCallback);
};

const windowObjects = [];
// 현재 윈도우 폼(브라우저) 해제 이벤트
window.onunload = function() {
	if (windowObjects.length) {
		for (var win of windowObjects) {
			win.close();// 모든 자식 윈도우 폼(팝업) 종료
		}
	}
}

// 윈도우 팝업 생성
function openPopup(obj, objWidth, objHeight, objName, objScroll, deny, objFull, isPush, addParam){
	try {
		if (objScroll !== 1 && objScroll !== 0 && objScroll !== '1' && objScroll !== '0') {
			var objScrollCopy=objScroll;
			objScroll=objName;
			objName=objScrollCopy;
		}

		var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
		if (isMac) {
			var ih = objHeight+22;
		} else {
			var ih = objHeight;
		}
		if (typeof(obj) == 'string') {
			var setup="width="+objWidth+",height="+objHeight+", innerHeight="+ih+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
			if(objName==""||!objName)objName="popup";
			if(objFull)setup="fullscreen=1,scrollbars=0";
			var win=window.open(obj,objName,setup);
			if(win!=null)
			win.focus();
			if (isPush) {
				windowObjects.push(win);
			}
			return win;
		}
		if(!objName)objName="popup";
		if(!objScroll)objScroll="auto";
		var url=addParam?obj.href+'?'+addParam:obj.href;
		var setup="width="+objWidth+",height="+objHeight+", innerHeight="+ih+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
		if(objFull)setup="fullscreen=1,scrollbars=0";
		var win=window.open(url,objName,setup);
		if(deny){
		if(win==null)alert('팝업 차단을 해제하여 주시기 바랍니다.');
		else win.focus();
		}
		if (isPush) {
			windowObjects.push(win);
		}
		return win;
	}
	catch(e){}
}

const isLauncher = /(ngpclient)/i.test(navigator.userAgent.toLowerCase())

// 런처에서 계정 정보 요청
function get_account_from_launcher() {
	const result = {
		'NCOIN' : !account ? 0 : commaAdd(account.ncoin),
		'NPOINT' : !account ? 0 : commaAdd(account.npoint)
	};
	return result;
}

// 런처 디바이스 내장 함수 설정
// 크로미움 boundAsync 객채로 처리(예: ngpBindObject.onLogout(); 호출 -> 런처 폼 변경)
// 런처 암호화 처리시 내장 함수명이 변경되므로 사용 불가
const NGPBind = (callback) => {
	if (!isLauncher || window.ngpBindObject || typeof window.CefSharp === 'undefined' || !window.CefSharp) {
		return;
	}
	window.CefSharp.BindObjectAsync(
		'ngpBindObject',
		'ngpBindObject'
	).then(callback);
}

const NGP = {
	goTo: (url) => {
		if (!url || url === window.location.pathname) return
		window.location.href = url
	},
	logout: () => {
		if (windowObjects.length) {
			for (var win of windowObjects) {
				win.close();// 모든 자식 윈도우 폼(팝업) 종료
			}
		}
		getDatas([
			'/define/logout'
		], (data) => {
			if (window.ngpBindObject && window.ngpBindObject.onLogout) {
				// 런처 로그아웃 완료 호출
				window.ngpBindObject.onLogout();
			} else {
				NGPBind(() => {
					window.ngpBindObject.onLogout();
				});
			}
		}, (data) => {
			if (window.ngpBindObject && window.ngpBindObject.onLogoutFail) {
				// 런처 로그아웃 실패 호출
				window.ngpBindObject.onLogoutFail();
			} else {
				NGPBind(() => {
					window.ngpBindObject.onLogoutFail();
				});
			}
		});
	},
	user_setting: () => {
		if (!account) {
			return;
		}
		openPopup('/account/setting', 510, 546, 'settingForm', 1, 0, false, true);
	},
	coupon: () => {
		if (!account) {
			return;
		}
		openPopup('/coupon/form', 510, 694, 'couponForm', 1, 0, false, true);
	},
	onNavigation: (index) => {
		if (window.ngpBindObject && window.ngpBindObject.onNavigation) {
			window.ngpBindObject.onNavigation(index);
		} else {
			NGPBind(() => {
				window.ngpBindObject.onNavigation(index);
			});
		}
	},
	onMessage: (message) => {
		if (window.ngpBindObject && window.ngpBindObject.onMessage) {
			window.ngpBindObject.onMessage(message);
		} else {
			NGPBind(() => {
				window.ngpBindObject.onMessage(message);
			});
		}
	}
}

const NGPIE = {
	goTo: (url) => {
		if (!url || url === window.location.pathname) return
		window.location.href = url
	},
	logout: () => {
		if (windowObjects.length) {
			for (var win of windowObjects) {
				win.close();// 모든 자식 윈도우 폼(팝업) 종료
			}
		}
		getDatas([
			'/define/logout'
		], (data) => {
			if (window.external && window.external.onLogout) {
				// 런처 로그아웃 완료 호출
				window.external.onLogout();
			}
		}, (data) => {
			if (window.external && window.external.onLogoutFail) {
				// 런처 로그아웃 실패 호출
				window.external.onLogoutFail();
			}
		});
	},
	user_setting: () => {
		if (!account) {
			return;
		}
		openPopup('/account/setting', 510, 546, 'settingForm', 1, 0, false, true);
	},
	coupon: () => {
		if (!account) {
			return;
		}
		openPopup('/coupon/form', 510, 694, 'couponForm', 1, 0, false, true);
	},
	onNavigation: (index) => {
		if (window.external && window.external.onNavigation) {
			window.external.onNavigation(index);
		}
	},
	onMessage: (message) => {
		if (window.external && window.external.onMessage) {
			window.external.onMessage(message);
		}
	}
}


let lobby_singleton = null;
let lobby_singletonEnforcer = 'singletonEnforcer';
class Lobby {
	// 생성자
	constructor(enforcer) {
		if (enforcer !== lobby_singletonEnforcer) throw 'Cannot--construct singleton';
		this.init();
	}

	// 싱글톤 인스턴스 생성
	static get instance() {
		if (!lobby_singleton) lobby_singleton = new Lobby(lobby_singletonEnforcer);
		return lobby_singleton;
	}

	// 초기 설정
	init() {
		const _ = this;
		
		_.setInstance();
		_.addEvents();
	}

	setInstance() {
		const _ = this;

		const main_character = account ? account.firstChar : null;
		const main_character_name = main_character ? main_character.name : `대표 케릭터 미설정`;
		const main_character_profile = main_character ? main_character.profileUrl : `/img/user_unkown.jpg`;
		const main_character_level = main_character ? main_character.level : 0;
		let tpl = `<main id="app">` +
			`<div id="pageWrap">` +
				`<div id="homePage">` +
					`<div class="bg">` +
						`<div class="container">` +
							`<header>` +
								`<div><label type="outlined" shape="square" color="white800a">PC게임</label></div>` +
								`<img src="https://cdn.jsdelivr.net/gh/cckiss/web/img/lobby/lin-logo.png?${cacheVersion}" alt="LIN" class="game-logo">` +
							`</header>` +
							`<div class="content-container">` +
								`<div class="swiper-opener">` +
									`<div>` +
										`<section class="swiper-section">` +
											`<div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden swiper-header">` +
												`<div class="swiper-slide"><img src="https://cdn.jsdelivr.net/gh/cckiss/web/img/lobby/play.png"><span>${serverName} 에 오신 고객님 환영합니다.</span></div>` +
											`</div>` +
										`</section>` +
									`</div>` +
								`</div>` +
								`<div class="content-mouse">` +
									`<div class="mouse-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.94)" class="mouse-icon"><path fill-rule="evenodd" d="M17.5 16V8a5.5 5.5 0 1 0-11 0v8a5.5 5.5 0 1 0 11 0M12 1a7 7 0 0 0-7 7v8a7 7 0 1 0 14 0V8a7 7 0 0 0-7-7" clip-rule="evenodd"></path><rect width="2" height="3" x="11" y="6" rx="1"></rect></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.94)" class="chevron-down-icon"><path fill-rule="evenodd" d="M11.47 18.53a.75.75 0 0 0 1.06 0l9-9-1.06-1.06L12 16.94 3.53 8.47 2.47 9.53z" clip-rule="evenodd"></path></svg></div>` +
								`</div>` +
								`<div class="content-bottom"><div class="left-dim"></div><div class="right-dim"></div></div>` +
								`<div class="dimming"></div>` +
							`</div>` +
							`<section class="user-section">` +
								`<div class="top">` +
									`<div size="600" class="left">` +
										`<div type="character" class="character-img">` +
											`<div><img src="https://cdn.jsdelivr.net/gh/cckiss/web${main_character_profile}?${cacheVersion}" alt=""></div>` +
										`</div>` +
									`</div>` +
									`<div class="right"><strong>${main_character_name}</strong><span> ${serverName}</span></div>` +
								`</div>` +
								`<div class="bottom">` +
									`<ul>` +
										`<li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.94)"><path d="M4 17.844h7.168V15.86h-4.8V6.004H4zM14.183 17.844h2.72l2.992-8.96H17.64l-1.312 4.464c-.24.88-.496 1.808-.72 2.72h-.08c-.24-.912-.496-1.84-.72-2.72l-1.312-4.464h-2.368z"></path></svg>${main_character_level}</li>` +
									`</ul>` +
								`</div>` +
							`</section>` +
						`</div>` +
					`</div>` +
				`</div>` +
			`</div>` +
		`</main>`;
		$('#root').html(tpl);
	}

	addEvents() {
		const _ = this;

	}
}

Lobby.instance;