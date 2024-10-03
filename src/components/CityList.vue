<template>
  <div v-for="location in savedLocations" :key="location.id">
    <CityCard :location="location" @click="goToLocationView(location)" />
  </div>

  <p v-if="savedLocations.length === 0">
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; 
import axios from "axios";
import CityCard from "./CityCard.vue";

const savedLocations = ref([]);
const router = useRouter(); 

const getLocation = async () => {
  if (localStorage.getItem("savedLocations")) {
    savedLocations.value = JSON.parse(localStorage.getItem("savedLocations"));

    const requests = [];
    savedLocations.value.forEach((location) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.lat}&lon=${location.coords.lon}&appid=e055eb67cff657fb882953619330b5a7`
        )
      );
    });

    const weatherData = await Promise.all(requests);

    await new Promise((res) => setTimeout(res, 600));

    weatherData.forEach((value, index) => {
      savedLocations.value[index].weather = value.data;
    });
  }
};

await getLocation();

const goToLocationView = (location) => {
  router.push({
    name: "CityView",
    params: { location: location.location }, 
    query: {
      id: location.id,
      lat: location.coords.lat,
      lon: location.coords.lon,
    },
  });
};
</script>

