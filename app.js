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

var jsonResponse = httpGet('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fwwwid');
var objResponse = JSON.parse(jsonResponse);
//document.getElementById('content').innerHTML = jsonResult;
var rssArray = objResponse.items;
var parentDivTag = document.getElementById('content');
for (var i=0; i<rssArray.length; i++){
    var childDivTag = document.createElement('div');
    var imgTag = document.createElement('img');
    imgTag.setAttribute('src',rssArray[i].thumbnail);
    var brTag0 = document.createElement('br');
    var textTag = document.createElement('text');
    textTag.innerHTML = rssArray[i].title;
    childDivTag.appendChild(imgTag);
    childDivTag.appendChild(brTag0);
    childDivTag.appendChild(textTag);
    parentDivTag.appendChild(childDivTag);
    var brTag1 = document.createElement('br');
    var brTag2 = document.createElement('br');
    var brTag3 = document.createElement('br');
    parentDivTag.appendChild(brTag1);
    parentDivTag.appendChild(brTag2);
    parentDivTag.appendChild(brTag3);
}
