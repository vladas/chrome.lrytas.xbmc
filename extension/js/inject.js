var RpcService = function()
{
    this.playVideoOnXBMC = function(vId)
    {
        chrome.extension.sendMessage({message: "playVideo", videoId: vId}, function(response) {
            console.log("video sent! " + response);
        });
    };

    this.queueVideoToXBMC = function(vId)
    {
        chrome.extension.sendMessage({message: "queueVideo", videoId: vId}, function(response) {
            console.log("inject script >> video sent! " + response);
            if (response == ResultData.OK) {
                toastr.success("Added to Queue!");
            } else {
                toastr.error("Error! Can't Add to Queue!");
            }
        });
    };
    this.playListOnXBMC = function(listId, videoId)
    {
        chrome.extension.sendMessage({message: "playList", listId: listId, videoId: videoId}, function(response) {
            console.log("list sent! " + response);
        });
    };
};

var LRXBMC = (function () {
    var my = {};
    
    my.rpc = new RpcService();
    
    var triggerApplyXbmcLinks = false;
    
    my.parseVideoId = function(url) {
        var matches = url.match(/\/\?id=(\d+)/);
        if (matches) {
            return matches[1];
        }
        return "";
    };
    
    my.applyXbmcLinks = function() {
        triggerApplyXbmcLinks = false;
        var anchors = $("a[href*='/?id=']").filter(function() {
            return $(this).find('img[src*="show_foto"]').length === 1 && !$(this).hasClass('vidimg');
        });
        var playpng = chrome.extension.getURL('assets/play.png');
        var pluspng = chrome.extension.getURL('assets/plus.png');

        $(anchors).each(function(i, el) {
            var videoId = LRXBMC.parseVideoId($(el).attr('href'));
            var tpl = '<span><a href="#" title="Play in XBMC" class="play-in-xbmc" data-video-id="' + videoId + '"><img src="' + playpng + '" /></a><a href="#" title="Queue in XBMC" class="queue-in-xbmc" data-video-id="' + videoId + '"><img src="' + pluspng + '" /></a></span>';
            $(el).addClass('vidimg');
            $(el).append(tpl);
        });
    };
    
    my.injectPlayerSideLinks = function(videoId) {
        var tpl = '<span><a href="#" title="Play in XBMC" class="play-in-xbmc" data-video-id="' + videoId + '">Play in XBMC</a> | <a href="#" title="Queue in XBMC" class="queue-in-xbmc" data-video-id="' + videoId + '">Queue in XBMC</a></span>';
        $(tpl).insertAfter('.la-data-laikas');
    };
    
    my.applyXbmcLinksWithTimeout = function(timeout) {
        if (!triggerApplysXbmcLinks) {
            triggerApplyXbmcLinks = true;
            
            setTimeout(function(){
                my.applyXbmcLinks();
            }, timeout);
        }
    };
    
    return my;
}());

$(function(){
    LRXBMC.applyXbmcLinks();
    
    var videoId = LRXBMC.parseVideoId(window.location.href);
    if (videoId) {
        LRXBMC.injectPlayerSideLinks(videoId);
    }
    
    $(document).on('click', '.play-in-xbmc', function(){
        LRXBMC.rpc.playVideoOnXBMC($(this).data('video-id'));
        return false;
    });
    
    $(document).on('click', '.queue-in-xbmc', function(){
        LRXBMC.rpc.queueVideoToXBMC($(this).data('video-id'));
        return false;
    });
    
    $(document).on('DOMNodeInserted', '.bn-news', function(){
        LRXBMC.applyXbmcLinksWithTimeout(800);
        return false;
    });
});