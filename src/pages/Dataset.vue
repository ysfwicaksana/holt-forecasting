<template>
  <div>
    <h1 class="font-bold text-gray-800 text-2xl mb-4">Generate Dataset</h1>

    <button
      class="bg-blue-500 p-1 rounded text-white lg:w-32 hover:bg-blue-600"
      @click="setRealDataset"
    >
      <div class="flex items-center justify-center gap-3">
        <span>Generate</span>
        <span v-show="delayGenerate">
          <Spinner />
        </span>
      </div>
    </button>

    <Table :columns="['Jumlah']" :data="realDataset" />

    <div class="flex justify-center" v-show="realDataset.length > 0">
      <button
        @click="setMinMaxNormalization"
        class="bg-blue-500 w-40 p-3 lg:w-60 lg:p-3 rounded text-white tracking-wide hover:bg-blue-600 shadow"
      >
        <div class="flex items-center justify-center gap-3">
          <span>Normalisasi</span>
          <span v-show="delayNormalize">
            <Spinner />
          </span>
        </div>
      </button>
    </div>

    <Table :columns="['Jumlah']" :data="normalizeDataset">
      <div class="flex justify-center my-5" v-show="normalizeStep">
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
      </div>
      <div
        class="flex flex-col gap-2 font-semibold text-lg"
        v-if="alphaValue != 0 && betaValue != 0"
      >
        <span>Alpha: {{ alphaValue }}</span>
        <span>Beta: {{ betaValue }}</span>
      </div>
      <div
        class="flex flex-col justify-center my-5 gap-1"
        v-show="forecastStep"
      >
        <label for="predict">Prediksi beberapa langkah ke depan</label>
        <input
          type="number"
          v-model="predictSteps"
          class="border-1 p-1"
          placeholder="ramal beberapa data kedepan"
        />
        <button
          @click="forecast"
          class="bg-green-500 w-40 p-3 lg:w-60 lg:p-3 rounded text-white tracking-wide hover:bg-green-600 shadow"
        >
          <div class="flex items-center justify-center gap-3">
            <span>Peramalan</span>
            <span v-show="delayForecast">
              <Spinner />
            </span>
          </div>
        </button>
      </div>
    </Table>

    <div class="overflow-x-auto mt-10 mb-4" v-show="resultData.length > 0">
      <h1 class="font-bold text-gray-800 text-2xl mb-4">
        RMSE: {{ errorResult }}
      </h1>
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border border-gray-800">Iterasi</th>
            <th class="px-4 py-2 border border-gray-800">Jumlah</th>
            <th class="px-4 py-2 border border-gray-800">Level</th>
            <th class="px-4 py-2 border border-gray-800">Trend</th>
            <th class="px-4 py-2 border border-gray-800">Peramalan</th>
            <th class="px-4 py-2 border border-gray-800">Error</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in resultData" :key="i">
            <td class="px-4 py-2 border border-gray-800">
              {{ i }}
            </td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.normalize }}
            </td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.level }}
            </td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.trend }}
            </td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.forecast }}
            </td>
            <td class="px-4 py-2 border border-gray-800">
              {{ row.error }}
            </td>
          </tr>
          <tr v-for="(row, i) in predict" :key="i">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="px-4 py-2 border border-gray-800">{{ row }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { dataset } from "../libs/datasets/RealDataset";
import { minMaxNormalization } from "../libs/normalize/minMax";
import { alpha, beta } from "../libs/datasets/constant";
import { DesHolt } from "../libs/forecasting/Forecast";
import Spinner from "./../components/Spinner.vue";
import Table from "../components/Table.vue";

const delayGenerate = ref(false);
const delayNormalize = ref(false);
const delayOptimize = ref(false);
const delayForecast = ref(false);
const normalizeStep = ref(false);
const forecastStep = ref(false);

const realDataset = ref([]);
const normalizeDataset = ref([]);
const resultData = ref([]);
const predict = ref([]);

const predictSteps = ref(0);
const alphaValue = ref(0);
const betaValue = ref(0);
const errorResult = ref(0);

const setRealDataset = () => {
  delayGenerate.value = true;
  setTimeout(function () {
    realDataset.value = dataset;
    delayGenerate.value = false;
  }, 2000);
};

const setMinMaxNormalization = () => {
  delayNormalize.value = true;
  setTimeout(function () {
    normalizeDataset.value = minMaxNormalization(realDataset.value);
    delayNormalize.value = false;
    normalizeStep.value = true;
  }, 2000);
};

const setGoldenSection = () => {
  delayOptimize.value = true;
  setTimeout(function () {
    alphaValue.value = alpha;
    betaValue.value = beta;
    delayOptimize.value = false;
    forecastStep.value = true;
  }, 1000);
};

const forecast = () => {
  const { result, predictDump, RMSE } = DesHolt(
    normalizeDataset.value,
    alphaValue.value,
    betaValue.value,
    predictSteps.value
  );

  resultData.value = result;
  predict.value = predictDump;
  errorResult.value = RMSE;
};
</script>
