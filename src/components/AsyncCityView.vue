<template>
  <div class="flex flex-col flex-1 items-center">
    
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ weatherData.name }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="text-8xl mb-8">
        {{ Math.round(weatherData.main.temp - 273.15) }}&deg; C
      </p>
      <p>
        Feels like {{ Math.round(weatherData.main.feels_like - 273.15) }}&deg; C
      </p>
      <p class="capitalize">
        {{ weatherData.weather[0].description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
        alt=""
      />
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

   
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white text-center">
        <!-- Added text-center class -->
        <h2 class="mb-4">Weather Details</h2>
        <p>Humidity: {{ weatherData.main.humidity }}%</p>
        <p>Pressure: {{ weatherData.main.pressure }} hPa</p>
        <p>Wind Speed: {{ weatherData.wind.speed }} m/s</p>
        <p>
          Rain (last hour):
          {{ weatherData.rain ? weatherData.rain["1h"] : 0 }} mm
        </p>
      </div>
    </div>
    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150"
      @click="removeLocation"
    >
      <i class="fa-solid fa-trash hover:text-red-500"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>



<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lon}&appid=e055eb67cff657fb882953619330b5a7`
    );

   
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.dt * 1000 + localOffset; 
    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone; 
    await new Promise((res) => setTimeout(res, 600));

    return weatherData.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const weatherData = await getWeatherData();
// console.log(weatherData);

const router = useRouter();
const removeLocation = () => {
  const locations = JSON.parse(localStorage.getItem("savedLocations"));
  const updatedLocations = locations.filter(
    (location) => location.id !== route.query.id
  );
  localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
  router.push({
    name: "home",
  });
};
</script>
