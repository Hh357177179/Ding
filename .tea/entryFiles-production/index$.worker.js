
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/meorder/meorder');
require('../../pages/history/history');
require('../../pages/appointment/appointment');
require('../../pages/telbinding/telbinding');
require('../../pages/successful/successful');
require('../../pages/meetdetail/meetdetail');
require('../../pages/meetDevice/meetDevice');
require('../../pages/personalDetail/personalDetail');
require('../../pages/aboutMe/aboutMe');
require('../../pages/aboutMeSec/aboutMe');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
