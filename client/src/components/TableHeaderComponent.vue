<script setup lang="ts">
import { reactive, type Reactive } from 'vue';

export type HeaderType = {
    label: string,
    sortable: boolean,
    sort_field: string
}

export type SortingType = {
    field: string,
    direction: string
}

const props = defineProps<{
    items: HeaderType[],
    default_sort: SortingType
}>()

const emit = defineEmits<{
    (e: 'sorting', payload: SortingType): void
}>()

const sorting: Reactive<SortingType> = reactive(props.default_sort)

function isOrderingActive(field: string, direction: string): boolean {

    return sorting.field == field && sorting.direction == direction

}

function setOrder(field: string, direction: string) {

    sorting.field = field
    sorting.direction = direction

    emit('sorting', sorting)

}

</script>

<template>
    <thead>
        <tr>
            <th class="text-left py-2 px-3 border border-stone-100" v-for="item in items">
                <span :class="{'text-blue-500': item.sortable}">{{ item.label }}</span>
                <svg v-if="item.sortable"
                    version="1.1" 
                    viewBox="0 0 7.9375 14.552" 
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline-block w-7 h-7">
                    <g fill="#ccc">
                    <path d="m7.9375 7.9375-3.9687 6.6146-3.9688-6.6146z" class="cursor-pointer"
                        :class="{'fill-blue-500': isOrderingActive(item.sort_field, 'desc')}"
                        @click="setOrder(item.sort_field,'desc')" />
                    <path d="m0 6.6146 3.9687-6.6146 3.9688 6.6146z" class="cursor-pointer"
                        :class="{'fill-blue-500': isOrderingActive(item.sort_field, 'asc')}"
                        @click="setOrder(item.sort_field,'asc')" />
                    </g>
                </svg>                                
            </th>
        </tr>
    </thead>
</template>