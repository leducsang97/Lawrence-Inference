var players = require('./faculty.json');
var request = require('sync-request');

players.forEach(p => {
	let url = "http://cmsc106.net/Lawrence/people?group=ASH";
    console.log(`Begin submit faculty: ${p.name}`);

    var res = request('POST', url, {
        json: {
            name: p["name"],
            // description: p["description"],
            additional: p["additional"]["photo"].replace("http://www2.lawrence.edu/hosted/photos/",""),
            role: p["additional"]["department"],
            group: "ASH"
        }
    });
    if (res.statusCode == 200) {
        var person = JSON.parse(res.getBody('utf8'));
        console.log(`SUCCESS - Submit faculty ${p.name}.`);
    } else {
        console.log(res.getBody('utf8'));
    }
});



// DANGEROUS ZONE!!!!!!!!! USE TO DELETE

// var start = 800;
// var end = 805;

// for(var i = start;i<=end;i++){
//     console.log(i);
//     request('DELETE', 'http://cmsc106.net/Lawrence/people/'+i);
// }