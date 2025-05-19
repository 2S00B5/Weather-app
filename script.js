const container      = document.querySelector('.container');
const search         = document.querySelector('.search-box button');
const weatherBox     = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const err            = document.querySelector('.not-found');
const cityHide       = document.querySelector('.city-hide');
const input          = document.querySelector('.search-box input');


input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    search.click(); 
  }
});

function resetAnimations() {
  container.classList.remove('active');
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');

  const oldCloneW = document.getElementById('clone-info-weather');
  const oldCloneH = document.getElementById('clone-info-humidity');
  const oldCloneI = document.getElementById('clone-info-wind');
  if (oldCloneW) oldCloneW.remove();
  if (oldCloneH) oldCloneH.remove();
  if (oldCloneI) oldCloneI.remove();
}

search.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) {
    return;
  }

  resetAnimations();
  void container.offsetWidth;

  
  fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`)
    .then(response => {
      if (response.status === 404) {
        showCityNotFoundUI(city);
        return null; 
    }

      if (!response.ok) {
        return response.json()
          .then(errJson => {
            const message = errJson.error || `Server returned ${response.status}`;
            showGenericErrorUI(message);
            return null;
          })
          .catch(() => {
            showGenericErrorUI(`Server returned ${response.status} with no JSON`);
            return null;
          });
      }

      return response.json();
    })
    .then(json => {
      if (!json) {
        return;
      }

      displayWeatherUI(json, city);
    })
    .catch(error => {
      console.error("Fetch or parse error:", error);
      showGenericErrorUI("Network or server error. Please try again.");
    });
});


function showCityNotFoundUI(city) {
  
    err.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('box');
  const img = document.createElement('img');
  img.src = 'images/error.jpg';     
  img.alt = 'Error';
  img.classList.add('active'); 
  err.appendChild(img);

  const msg = document.createElement('p');
  msg.textContent = `"${city}" not found.`;
  msg.classList.add('active');  
  err.appendChild(msg);

  err.appendChild(wrapper);
  cityHide.textContent = city;      
  container.style.height = '400px';
  container.classList.remove('active'); 
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  err.classList.add('active');; 
}


function showGenericErrorUI(message) {
  err.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.classList.add('box');
  const img = document.createElement('img');
  img.src = 'images/error.jpg';
  img.alt = 'Error';
  wrapper.appendChild(img);
  const msg = document.createElement('p');
  msg.textContent = `⚠️ ${message}`;
  wrapper.appendChild(msg);
  err.appendChild(wrapper);

  cityHide.textContent = '';
  container.style.height = '400px';
  container.classList.remove('active');
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  err.classList.add('active');
}


function displayWeatherUI(json, city) {
  
  err.classList.remove('active');
  err.innerHTML = '';
  cityHide.textContent = city;
  container.style.height = '555px';
  container.classList.add('active');
  weatherBox.classList.add('active');
  weatherDetails.classList.add('active');

  const image       = document.querySelector('.weather-box img');
  const temperature = document.querySelector('.weather-box .temperature');
  const desc        = document.querySelector('.weather-box .desc');
  const humidity    = document.querySelector('.weather-details .info-humidity span');
  const wind        = document.querySelector('.weather-details .info-wind span');

  switch (json.weather[0].main) {
    case 'Clear':
      image.src = 'images/clear.png';
      break;
    case 'Cloud':
      image.src = 'images/cloud.png';
      break;
    case 'Rain':
      image.src = 'images/rain.png';
      break;
    case 'Snow':
      image.src = 'images/snow.png';
      break;
    case 'Mist':
      image.src = 'images/mist.png';
      break;
    default:
      image.src = 'images/cloud.png';
      break;
  }

  temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
  desc.innerHTML        = json.weather[0].description;
  humidity.innerHTML    = `${json.main.humidity}%`;
  wind.innerHTML        = `${parseInt(json.wind.speed)}Km/h`;

  const infoWeather  = document.querySelector('.info-weather');
  const infoHumidity = document.querySelector('.info-humidity');
  const infoWind     = document.querySelector('.info-wind');

  const elCloneWeather  = infoWeather.cloneNode(true);
  const elCloneHumidity = infoHumidity.cloneNode(true);
  const elCloneWind     = infoWind.cloneNode(true);

  elCloneWeather.id  = 'clone-info-weather';
  elCloneHumidity.id = 'clone-info-humidity';
  elCloneWind.id     = 'clone-info-wind';

  elCloneWeather.classList.add('active-clone');
  elCloneHumidity.classList.add('active-clone');
  elCloneWind.classList.add('active-clone');

  setTimeout(() => {
    infoWeather.insertAdjacentElement('afterend', elCloneWeather);
    infoHumidity.insertAdjacentElement('afterend', elCloneHumidity);
    infoWind.insertAdjacentElement('afterend', elCloneWind);
  }, 500);

  const clonesW  = document.querySelectorAll('.info-weather.active-clone');
  const clonesH  = document.querySelectorAll('.info-humidity.active-clone');
  const clonesWi = document.querySelectorAll('.info-wind.active-clone');

  if (clonesW.length > 0) {
    const firstW = clonesW[0];
    const firstH = clonesH[0];
    const firstI = clonesWi[0];

    firstW.classList.remove('active-clone');
    firstH.classList.remove('active-clone');
    firstI.classList.remove('active-clone');

    setTimeout(() => {
      firstW.remove();
      firstH.remove();
      firstI.remove();
    }, 2200);
  }
}
