<template>
  <div class="overflow-x-auto mt-10 mb-4 lg:w-[720px]">
    <table class="table-auto w-full border-collapse" v-show="data.length > 0">
      <thead>
        <tr>
          <th class="px-4 py-2 border border-gray-800 w-10">No</th>
          <th
            class="px-4 py-2 border border-gray-800"
            v-for="(col, i) in columns"
            :key="i"
          >
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <td class="px-4 py-2 border border-gray-800">{{ i + 1 }}</td>
          <td class="px-4 py-2 border border-gray-800">{{ row }}</td>
        </tr>
      </tbody>
    </table>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Array,
  columns: Array,
});
</script>
