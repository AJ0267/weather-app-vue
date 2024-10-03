<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="locationIQSearchResults.length > 0 || searchError"
      >
        <p class="py-2" v-if="searchError">
          Something went wrong, or no places found. Please try again.
        </p>
        <p
          class="py-2"
          v-if="!searchError && locationIQSearchResults.length === 0"
        >
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in locationIQSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.name }}
            <!-- Updated to use the correct property -->
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
        <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "@/components/CityList.vue";
import CityCardSkeleton from "@/components/CityCardSkeleton.vue";

const router = useRouter();

const previewCity = (searchResult) => {
  // console.log(searchResult);
  // console.log(searchResult.lat);
  // console.log(searchResult.lon);
  const [location] = searchResult.name.split(",");
  router.push({
    name: "CityView",
    params: { location: location },
    query: {
      lat: searchResult.lat,
      lon: searchResult.lon,
      preview: true,
    },
  });
};

const locationIQAPIKey = "pk.0707941cecef5f4aafbce3f91e2b21d2";
const searchQuery = ref("");
const queryTimeout = ref(null);
const locationIQSearchResults = ref([]);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    searchError.value = null; 

    if (searchQuery.value !== "") {
      const options = {
        method: "GET",
        url: "https://us1.locationiq.com/v1/autocomplete.php",
        params: {
          q: searchQuery.value,
          tag: "place:*",
          key: locationIQAPIKey,
        },
        headers: { accept: "application/json" },
      };

      try {
        const result = await axios.request(options);

        
        locationIQSearchResults.value = result.data.map((place) => ({
          id: place.place_id,
          lon: place.lon,
          lat: place.lat,
          name: place.display_name,
          display_address: place.display_address,
          address: place.address, 
        }));
      } catch (error) {
        console.error(error);
        searchError.value = true; 
      }

      return;
    }
    locationIQSearchResults.value = []; 
  }, 300);
};
</script>
