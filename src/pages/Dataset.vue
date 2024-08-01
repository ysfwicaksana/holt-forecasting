<template>
  <div>
    <h1 class="font-bold text-gray-800 text-2xl mb-4">
      Peramalan jumlah mahasiswa baru UBP Karawang DES Holt
    </h1>

    <div class="flex flex-col">
      <label for="predict">Masukkan jumlah beberapa prediksi ke depan</label>
      <input
        type="number"
        v-model="predictSteps"
        class="border-1 p-1 w-1/4 border-2 border-black rounded"
        placeholder="ramal beberapa data kedepan"
      />
    </div>

    <Table :columns="['Jumlah']" :data="realDataset" />

    <button
      @click="setGoldenSection"
      class="bg-blue-500 w-40 p-3 lg:w-60 lg:p-3 rounded text-white tracking-wide hover:bg-blue-600 shadow"
    >
      <div class="flex items-center justify-center gap-3">
        <span>Optimasi Golden Section</span>
        <span v-show="delayOptimize">
          <Spinner />
        </span>
      </div>
    </button>
    <div
      class="flex flex-col gap-2 font-semibold text-lg"
      v-if="alphaValue != 0 && betaValue != 0"
    >
      <span>Alpha: {{ alphaValue }}</span>
      <span>Beta: {{ betaValue }}</span>
    </div>

    <button
      @click="forecast"
      class="bg-green-500 w-40 p-3 lg:w-60 lg:p-3 rounded text-white tracking-wide hover:bg-green-600 shadow"
      v-show="alphaValue != 0 && betaValue != 0"
    >
      <div class="flex items-center justify-center gap-3">
        <span>Peramalan</span>
        <span v-show="delayForecast">
          <Spinner />
        </span>
      </div>
    </button>

    <div class="overflow-x-auto mt-10 mb-4" v-show="resultData.length > 0">
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border border-gray-800">Iterasi</th>
            <th class="px-4 py-2 border border-gray-800">Jumlah</th>
            <th class="px-4 py-2 border border-gray-800">
              Peramalan (Normalisasi)
            </th>
            <th class="px-4 py-2 border border-gray-800">Denormalisasi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in resultData" :key="i">
            <td class="px-4 py-2 border border-gray-800">{{ i }}</td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.normalize }}
            </td>
            <td class="px-4 py-2 border border-gray-800">{{ row.forecast }}</td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.denormalize }}
            </td>
          </tr>
          <tr v-for="(row, i) in predict" :key="i">
            <td></td>
            <td></td>
            <td class="px-4 py-2 border border-gray-800">{{ row.forecast }}</td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.denormalize }}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
      v-show="resultData.length > 0"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { dataset } from "../libs/datasets/RealDataset";
import { minMaxNormalization, getMax, getMin } from "../libs/normalize/minMax";
import { alpha, beta } from "../libs/datasets/constant";
import { DesHolt } from "../libs/forecasting/Forecast";
import Spinner from "./../components/Spinner.vue";
import Table from "../components/Table.vue";

const delayOptimize = ref(false);
const delayForecast = ref(false);
const forecastStep = ref(false);

const realDataset = ref([]);
const normalizeDataset = ref([]);
const resultData = ref([]);
const predict = ref([]);
const chartOptions = ref({});
const chartSeries = ref([]);

const predictSteps = ref(0);
const alphaValue = ref(0);
const betaValue = ref(0);

onMounted(() => {
  realDataset.value = dataset;
  normalizeDataset.value = minMaxNormalization(realDataset.value);
});

const setGoldenSection = () => {
  delayOptimize.value = true;
  setTimeout(function () {
    alphaValue.value = alpha;
    betaValue.value = beta;
    forecastStep.value = true;
    delayOptimize.value = false;
  }, 1000);
};

const forecast = () => {
  const { result, predictDump } = DesHolt(
    realDataset.value,
    normalizeDataset.value,
    alphaValue.value,
    betaValue.value,
    predictSteps.value
  );

  resultData.value = result;

  const predict2 = [];
  predictDump.forEach((predict) => {
    predict2.push({
      forecast: predict,
      denormalize: Math.round(
        predict * (getMax(realDataset.value) - getMin(realDataset.value)) +
          getMin(realDataset.value)
      ),
    });
  });

  predict.value = predict2;

  const combinedDenormalize = [
    ...resultData.value.map((d) => d.denormalize),
    ...predict.value.map((d) => d.denormalize),
  ];

  chartSeries.value = [
    {
      name: "Data PMB",
      data: realDataset.value,
    },
    {
      name: "Peramalan PMB",
      data: combinedDenormalize,
    },
  ];

  chartOptions.value = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Grafik Perbandingan Data Asli Dengan Peramalan PMB",
      align: "left",
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5, // Adjust the size of the markers
    },
    xaxis: {
      categories: combinedDenormalize.map((_, index) => index + 1),
    },
    yaxis: {
      title: {
        text: "Value",
      },
    },
    legend: {
      position: "top",
    },
  };
};
</script>
