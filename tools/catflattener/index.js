var axios = require('axios');
var Promise = require('bluebird');


//get tree


console.log(process.env.CLOUDANT_AUTH);





function flatten(n, r) {
    r = r || [];
    
    r.push(n);
    
    if(n.children) {
        n.children.forEach(c => {
            flatten(c, r);  
        }) 
    }    
    
    return r;
}



function normalizeCatNode(n) {        
    return {
        name : n.name,
        description: n.description,
        _id: n._id == "categorytree" ? "root" : n._id.match(/(?:^category\/)(.+)/)[1],
        children: n.children.map(c => c._id.match(/(?:^category\/)(.+)/)[1])
    };
}


function flattenCats() {
    Promise.coroutine(function*() {
        var res = yield axios.get('http://localhost:5984/bb/categorytree')
                                .catch(console.error);
        
        var catTree = res.data;
        
        var cats = flatten(catTree).map(normalizeCatNode);
                
        // console.log(cats);  
        
        for(var i = 0; i < cats.length; i++) {
            var cat = cats[i];            
            yield axios.put(
                    'http://localhost:5984/bb/category-' + cat._id, 
                    cat,
                    { 
                        headers: { 
                            'Content-Type': 'application/json'//,
                            //'Authorization': 'Basic ' + process.env.CLOUDANT_AUTH  
                        } 
                    }).catch(console.error);
        }
    })()
}

flattenCats();

