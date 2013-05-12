<?php 

function sendRawJsonPost($url, $rawPost)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL,            $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST,           1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,     $rawPost); 
    curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: application/json')); 

    $result = curl_exec ($ch);
    echo $result;
}

$url = 'http://127.0.0.1:8080/jsonrpc';
$url = 'http://rpi/jsonrpc';

sendRawJsonPost($url, '{"jsonrpc":"2.0","method":"Playlist.Clear","id":1,"params":{"playlistid":1}}'); // clear

sendRawJsonPost($url, '{"jsonrpc": "2.0","method":"Playlist.Add","id":1,"params":{"playlistid":1,"item":{"file":"plugin://plugin.video.lrytas/?mode=play_video&videoid=13677802671365663484"}}}'); // add vidoe

sendRawJsonPost($url, '{"jsonrpc":"2.0","method":"Player.Open","id":1,"params":{"item":{"playlistid":1,"position":0}}}'); // play playlist

// Queue
// {"jsonrpc":"2.0","method":"Player.GetActivePlayers","id":1,"params":{}}
// {"jsonrpc":"2.0","method":"Playlist.Clear","id":1,"params":{"playlistid":1}}
// {"jsonrpc":"2.0","method":"Playlist.Add","id":1,"params":{"playlistid":1,"item":{"file":"plugin://plugin.video.youtube/?action=play_video&videoid=R_ZvxMyFSCU"}}}
// {"jsonrpc":"2.0","method":"Player.GetActivePlayers","id":1,"params":{}}
// {"jsonrpc":"2.0","method":"Player.Open","id":1,"params":{"item":{"playlistid":1,"position":0}}}