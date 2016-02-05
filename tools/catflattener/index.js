var axios = require('axios');
var Promise = require('bluebird');


//get tree




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
        var res = yield axios.get('https://jasonholloway.cloudant.com/bb/categorytree').catch(console.error);
        
        var catTree = res.data;
        
        var cats = flatten(catTree).map(normalizeCatNode);
                
        console.log(cats);  
        
        for(var i = 0; i < cats.length; i++) {
            var cat = cats[i];            
            var res = yield axios.post(
                            'https://jasonholloway.cloudant.com/bb/category-' + cat._id, 
                            cat,
                            { 
                                headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Basic ' + process.env.CLOUDANT_AUTH  
                                } 
                            }).catch(console.error);
            
            
            
            // console.log(res);
        }
    })()
}

flattenCats();

