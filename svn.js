#!/opt/local/bin/node

var exec = require('child_process').exec;
var argv = process.argv;
var libxmljs = require('libxmljs');
var repo = argv[3];
if (repo.slice(-1) !== '/') {
	repo = repo + '/';
}
var command = 'svn diff -r ' + argv[2] + ' --summarize --xml ' + repo;

var parse_files = function (error, stdout, stderr) {
    if (error !== null) {
        console.log(stderr);
        return;
    }
    stdout = stdout.replace(/\n/g, '');
    var xmlDoc = libxmljs.parseXmlString(stdout), files = xmlDoc.get('/diff/paths').childNodes(), k = 0, svn_path = '', path = '';
    for ( k in files) {
        svn_path = files[k].text();
        path = svn_path.replace(repo, '');
        export_file(svn_path, path);
    }
}

var export_file = function (svn_path, path) {
    var export_callback = function (error, stdout, stderr) {
        if(error !== null) {
            console.log(stderr);
        }
        return;
    }, mkdir_callback = function (error, stdout, stderr) {
        if(error !== null) {
            console.log(stderr);
        }
        return;
    };
	console.log('mkdir -p ' + path.split('/').slice(0, -1).join('/'));
    exec('mkdir -p ' + path.split('/').slice(0, -1).join('/'), mkdir_callback);
    exec('svn export ' + svn_path + ' ' + path, export_callback);
}

child = exec(command, parse_files);