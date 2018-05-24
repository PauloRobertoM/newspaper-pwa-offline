
function createNewsElement(news){
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'col-1-of-1';
    
    var cardNews = document.createElement('div');
    cardNews.className = 'news';
    
    var cardNewsImgElement = document.createElement('img');
    cardNewsImgElement.src =  news.image;
    cardNewsImgElement.className = 'news__image';
    cardNews.appendChild(cardNewsImgElement);
    
    var cardNewsTitleElement = document.createElement('h3');
    cardNewsTitleElement.className = 'news__title';
    cardNewsTitleElement.textContent  =  news.title;
    cardNews.appendChild(cardNewsTitleElement);
    
    var cardNewsDescriptionElement = document.createElement('p');
    cardNewsDescriptionElement.className = 'news__description';
    cardNewsDescriptionElement.textContent = news.description;
    cardNews.appendChild(cardNewsDescriptionElement);
    
    cardWrapper.appendChild(cardNews);
    
    //
    var parent = document.getElementById('output');
    parent.appendChild(cardWrapper);

    return cardWrapper;
}
