function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        return xmlHttp.responseText;
    } else {
        return '{"isSuccess":"failed","description":"cannot fetch the response"}';
    }
}

var jsonResult = httpGet('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fwwwid');
//var objResult = JSON.parse(jsonResult);
document.getElementById('content').innerHTML = jsonResult;
