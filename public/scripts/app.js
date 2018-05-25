
if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('./sw.js', {scope: '/newspaper/public/'})
    .then(function(){
        console.log('Service worker está registrado');
    });
}

window.onload =  fetch('http://localhost/newspaper/public/db.json')
.then(function(response){
    response.json().then(function(data){
        data.map(function(item){
            createNewsElement(item);         
        });
    })
});
