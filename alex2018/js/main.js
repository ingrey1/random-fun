// variables for event listeners
const activitySumbitButton = document.querySelector('.activity-choice-submit');
const languageSubmitButton = document.querySelector('.language-choice-submit');
const newSearchSubmitButton = document.querySelector('.new-search-submit');
const goBackButton = document.querySelector('.go-back-button');
const restaurantChoices = document.querySelector('.restaurant-choices');
const textToBeTranslated = document.querySelector('.text-to-be-translated');

// get the news on page load, with the default topic of aviation
const getAviationNews = getNews;


/* boolean to control when to call getNews function. if the user didn't enter a new search term, don't make another fetch request */
let newNews = false;


/******** FUNCTIONS ********/

// get the page sections that will be shown/hidden via javascript
function getPageSections() {
    const languageTranslationDiv = document.querySelector('.language-translation');
    const cirrusDiv = document.querySelector('.cirrus');
    const newsDiv = document.querySelector('.news');
    const foodDiv = document.querySelector('.food');

    return {
        languageTranslationDiv,
        cirrusDiv,
        newsDiv,
        foodDiv
    }
}


// if the user selects 'pick something' from the dropdown menu, reset everything to default values
const activitySelect = document.querySelector('.activity-select');
activitySelect.onchange = function (e) {
    const { languageTranslationDiv, cirrusDiv, newsDiv, foodDiv } = getPageSections();

    if (e.target.value === 'noValue') {
        hideUnselectedActivities(languageTranslationDiv, cirrusDiv, newsDiv, foodDiv);
        if (newNews) {
            resetNews();
        }
    }
}


// choose an activity from the select dropdown menu of activities
function chooseActivity(e) {
    const { languageTranslationDiv, cirrusDiv, newsDiv, foodDiv } = getPageSections();

    e.preventDefault();
    const activitySelect = document.querySelector('.activity-select');
    let activityChoice = activitySelect.value;

    if (activityChoice === 'languages') {
        showActivity(languageTranslationDiv, 'flex');
        hideUnselectedActivities(cirrusDiv, newsDiv, foodDiv);
    } else if (activityChoice === 'cirrus') {
        showActivity(cirrusDiv, 'grid');
        hideUnselectedActivities(languageTranslationDiv, newsDiv, foodDiv);
    } else if (activityChoice === 'news') {
        showActivity(newsDiv, 'block');
        hideUnselectedActivities(languageTranslationDiv, cirrusDiv, foodDiv);
    } else if (activityChoice === 'food') {
        showActivity(foodDiv, 'grid');
        hideUnselectedActivities(languageTranslationDiv, cirrusDiv, newsDiv);
    }
}


// show the activity div that the user selected
function showActivity(div, display) {
    div.style.display = display;
}


/*
    1. clear out translation div and reset news div, as needed
    2. hide all activity divs except for the one the user selected
*/
function hideUnselectedActivities(...args) {
    const divsArr = [...args];

    const { languageTranslationDiv, newsDiv, foodDiv } = getPageSections();

    if (divsArr.includes(languageTranslationDiv)) {
        clearTranslationDiv();
    }

    if (divsArr.includes(newsDiv) && (newNews)) {
        resetNews();
    }

    if (divsArr.includes(foodDiv)) {
        let restaurantChoice = document.querySelector('.restaurant-choice');
        if (restaurantChoice.innerHTML) {
            goBack();
        }
    }

    for (let div of divsArr) {
        div.style.display = 'none';
    }
}


// choose a language from the select dropdown menu of languages
function chooseLanguage(e) {
    e.preventDefault();
    const languageSelect = document.querySelector('.language-select');
    let languageChoice = languageSelect.value;
    let textToBeTranslated = document.querySelector('.text-to-be-translated').value;

    translate(languageChoice, textToBeTranslated);
}


// get the month, date, and current time
function getDate() {

    let fullDate = new Date();
    let time = fullDate.getHours();
    let month = fullDate.getMonth();
    let todaysDate = fullDate.getDate();

    return {
        fullDate: new Date(),
        time: fullDate.getHours(),
        month: fullDate.getMonth(),
        todaysDate: fullDate.getDate()
    }
}


// use today's date & time to determine the header greeting
function getHeaderText() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Obtober', 'November', 'December']

    // get all date info & destructure it into variables
    let { fullDate, time, month, todaysDate } = getDate();

    // the h1 element
    let greeting = document.querySelector('.greeting');


    // if it's Alex's birthday, display birthday greeting. otherwise display generic greeting 
    if ((month + 1 === 11) && (todaysDate === 27)) {
        greeting.innerHTML = 'HAPPY BIRTHDAY ALEX!'
    } else {
        if (time < 12) { // AM times
            greeting.innerHTML = 'Good Morning Alex!'
        } else { // PM times
            greeting.innerHTML = 'Hi Alex!';
        }
    }

    // return the day, date, and year
    let dateString = '';
    dateString = `${todaysDate} ${months[month]}, ${fullDate.getFullYear()}`
    return dateString;
}


// display today's date in the upper left hand corner
function displayDate(fn) {
    let dateDisplay = document.querySelector('.date');
    dateDisplay.innerHTML = fn();
}


// use the nasa APOD api to get the astronomy picture of the day
function getPicOfDay() {
    let apod = document.querySelector('.nasa-image');
    let url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
    let fallbackImage2 = 'https://apod.nasa.gov/apod/image/1811/CaveNebula_Ayoub_2469.jpg'
    let fallbackImage = 'https://apod.nasa.gov/apod/image/1811/ward30DoradusHaLRGB.jpg';

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                // use a fallback image if the request fails
                apod.setAttribute('src', fallbackImage);
                apod.setAttribute('alt', 'Nasa Astronomy Picture Of The Day');
            }
        })
        .then(function (data) {
            if (data.media_type === 'video') {
                // use a fallback image if the media type is video
                apod.setAttribute('src', fallbackImage2);
                apod.setAttribute('alt', 'Nasa Astronomy Picture Of The Day');
            } else {
                // otherwise, set the src and alt attributes for the image
                let apodSrc = data.hdurl;
                apod.setAttribute('src', apodSrc);
                apod.setAttribute('alt', 'Nasa Astronomy Picture Of The Day');
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}


// use funtranslations api to translate user input text into selected language
function translate(language, text) {
    let translatedText = document.querySelector('.translatedText');
    let textArr = text.split(' ').join('%20');
    let url = `https://api.funtranslations.com/translate/${language}.json?text=${textArr}`;

    // account for users not using the form properly
    if (text === '') {
        alert('Please enter some text in the input field');
        return;
    } else if (language === 'noValue') {
        alert('Please choose a language from the dropdown menu');
        return;
    }

    // if all fields are filled out, make the api request
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                translatedText.style.fontSize = '1.1rem';
                translatedText.innerHTML = "Sorry. We're having network issues. Please try again later";
            }
        })
        .then(function (data) { //TODO: do i need to reset font size?
            translatedText.innerHTML = data.contents.translated;
        })
        .catch(function (error) {
            translatedText.style.fontSize = '1.1rem';
            translatedText.innerHTML = 'Sorry. Limit of 5 requests per hour exceeded. Please come back later and try again.';
        })
}


function clearTranslationDiv() {
    // reset select to default value, clear text input field, and clear translated text output
    const languageSelect = document.querySelector('.language-select');
    const textInput = document.querySelector('.text-to-be-translated');
    const translatedText = document.querySelector('.translatedText');

    languageSelect.selectedIndex = 0;
    textInput.value = '';
    translatedText.innerHTML = '';
}


/*
 use the newsapi to get the 3 most recent news articles 
 the default topic is aviation, but the user can enter a different search word
 */
function getNews(topic = 'aviation') {
    const noNews = document.querySelector('.no-news');
    const key = 'a3a6c68b52394f46a9542de03f99dc94';
    let url = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${key}`;

    let articles = [];

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                //TODO: account for response NOT being ok
            }
        })
        .then(function (data) {
            /*
                1. if the search doesn't return any articles, let the user know. adjust css of parent div. otherwise ->
                2. create an object by grabbing the title, description, and url for the first 3 articles
                3. add the created object to the array of articles
                4. reset css of parent div
                5. pass the array of articles to the function that will build the article UI
           */
            if (data.articles.length === 0) {
                noNews.style.display = 'block';
                lessPadding();
            } else if (data.articles.length > 3) {
                for (let i = 0; i < 3; i++) {
                    let tempObj = {};
                    tempObj.title = data.articles[i].title;
                    tempObj.description = data.articles[i].description;
                    tempObj.url = data.articles[i].url;
                    articles.push(tempObj);
                }
                resetPadding()
                appendArticleElements(articles);

            } else {
                data.articles.forEach(function (value) {
                    let tempObj = {};
                    tempObj.title = value.title;
                    tempObj.description = value.description;
                    tempObj.url = value.url;
                    articles.push(tempObj);
                })
                resetPadding();
                appendArticleElements(articles);
            }
        })
}


// remove the old articles when the user submits a new search query
function clearPreviousNews() {
    const parentDiv = document.querySelector('.articles-wrapper');
    parentDiv.innerHTML = '';
}


/*
    1. remove the old news articles
    2. grab the search term value & run the new search 
    3. clear the search input field
*/
function getNewNews(e) {
    e.preventDefault();
    const searchInput = document.querySelector('.search-term');
    let searchValue = searchInput.value;

    // account for user not entering a search term
    if (!searchValue) {
        alert('Please enter a search term');
        return;
    }

    clearPreviousNews();
    getNews(searchValue);

    searchInput.value = '';

    // set the global variable to true, so we can make a new fetch request with the new search term
    newNews = true;
}


// reset the news div to display aviation news
function resetNews() {
    clearPreviousNews();
    getAviationNews();

    // set the global variable to false after the aviation news has been fetched
    newNews = false;
}


/* Adjust top padding of div when no search results are returned */
function lessPadding() {
    document.querySelector('.alternate-search').classList.add('less-padding');
}


/* Reset top padding of div. Also hide 'no news' paragraph */
function resetPadding() {
    const noNews = document.querySelector('.no-news');
    noNews.style.display = 'none';

    document.querySelector('.alternate-search').classList.remove('less-padding');
}


// create an article element, with the necessary element children and their classes
function buildArticleElement(article) {
    const articleElement = `
        <div class='news-card-outer'>
            <article class='news-card'>
                <h1 class='news-title'>${article.title}</h1>
                <p class='news-description'>${article.description}</p>
                <p class='read-more'><span class='bold'>Read the full article:</span>
                    <a class='news-url' rel='noopener' href=${article.url} target='_blank'>${article.url}</a>
                </p>
            </article>
        </div>
    `;

    return articleElement;
}


/*
   1. loop over the array of news articles, and create an article element for each news article
   2. append each populated article element to the page, via it's parent element
*/
function appendArticleElements(newsArticles) {
    const parentDiv = document.querySelector('.articles-wrapper');

    newsArticles.forEach(function (article) {
        let articleElement = buildArticleElement(article);
        parentDiv.innerHTML += articleElement;
    });
}


// animate the split screen div when user chooses a restaurant
function handleRestaurantChoice(e) {
    // make sure the click was on the button, not the parent div
    if (e.target !== e.currentTarget && e.target.classList.contains('jsButton')) {
        // which restaurant specifically was clicked
        let restaurant = e.target.innerHTML;

        // insert the selected restaraunt name into the html
        let restaurantChoice = document.querySelector('.restaurant-choice');
        restaurantChoice.innerHTML = restaurant;

        // the split screen divs and height animation
        const restaurantChoiceRight = document.querySelector('.restaurant-choice-right');
        const restaurantChoiceLeft = document.querySelector('.restaurant-choice-left');
        restaurantChoiceRight.classList.add('full-height');
        restaurantChoiceLeft.classList.add('full-height');

        // right side opacity animation
        const restaurantNumber = document.querySelector('.restaurant-number');
        const goBack = document.querySelector('.go-back');
        restaurantNumber.classList.add('full-opacity');
        goBack.classList.add('full-opacity');

        // get & set the phone number for the aria label and the href attributes
        let phoneNumber = e.target.getAttribute('data-number');
        let href = `tel:${phoneNumber.split('.').join('')}`;
        restaurantNumber.setAttribute('aria-label', phoneNumber);
        restaurantNumber.setAttribute('href', href);
    }
}

// reverse the split screen div animation so user can see all restaurant options again
function goBack(e) {
    // don't let the event bubble up to the parent
    if (e) {
        e.stopPropagation();
    }

    // remove the restaurant name from the html
    document.querySelector('.restaurant-choice').innerHTML = '';

    // the split screen divs and height animation
    document.querySelector('.restaurant-choice-right').classList.remove('full-height');
    document.querySelector('.restaurant-choice-left').classList.remove('full-height');;

    // right side opacity animation
    document.querySelector('.restaurant-number').classList.remove('full-opacity');
    document.querySelector('.go-back').classList.remove('full-opacity');
}


// call the functions necessary to load initial content on the page
function main() {
    displayDate(getHeaderText);
    getPicOfDay();
    getAviationNews();
}

/******** EVENT LISTENERS ********/

goBackButton.addEventListener('click', goBack);

restaurantChoices.addEventListener('click', handleRestaurantChoice);

activitySumbitButton.addEventListener('click', chooseActivity);

languageSubmitButton.addEventListener('click', chooseLanguage);

newSearchSubmitButton.addEventListener('click', getNewNews);

textToBeTranslated.addEventListener('focus', clearTranslationDiv);


main();


