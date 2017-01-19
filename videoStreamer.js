
var fs              =   require('fs');
var express         =   require('express');
var app             =   express();
var path            =   __dirname+'/closer.mkv';
app.get('/',function(req,res){
    var stat,range,partition,start,end,chunkSize,data;
    //Fetching Information about the file
    stat            =   fs.statSync(path);
    total           =   stat.size;//Getting size of the file
    if(req.headers['range']){
        range       =   req.headers.range;
        partition   =   range.replace(/bytes=/,"").split("-");
        start       =   parseInt(partition[0],10);
        end         =   partition[1]?parseInt(partition[1],10):start+5000;
        chunkSize   =   end-start+1;
        data        =   fs.createReadStream(path,{start:start,end:end});
        res.writeHead(206,{
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4"
        })
        data.pipe(res);

    }
    else{
        res.writeHead(200, { 'Content-Length': null, 'Content-Type': 'video/mp4' });
        fs.createReadStream(path).pipe(res);
    }
}).listen(3000);