<template>
  <div class="ui-table-wrap">
    <table class="ui-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="ui-table__state">Cargando...</td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length" class="ui-table__state">{{ emptyText }}</td>
        </tr>
        <tr v-for="row in rows" :key="row.id ?? row.key" v-else>
          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true }, 
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'No hay datos para mostrar.' },
})
</script>
