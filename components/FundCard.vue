<script setup lang="ts">
import { computed } from 'vue';
import { ExternalLink, CheckSquare, Square } from 'lucide-vue-next';
import type { Fund } from '~/types';

const props = withDefaults(defineProps<{
  fund: Fund;
  isSelected: boolean;
  externalLink?: string;
  isSelectable?: boolean;
}>(), {
  isSelectable: true
});

const emit = defineEmits<{
  (e: 'toggle', code: string): void;
}>();

const handleClick = () => {
  if (props.externalLink) {
    window.open(props.externalLink, '_blank');
  } else if (props.isSelectable) {
    emit('toggle', props.fund.code);
  }
};

const openFundDetails = () => {
  if (props.externalLink) {
    window.open(props.externalLink, '_blank');
  } else {
    window.open(`https://dev-fund.cmoneyfund.com.tw/fund-introduction/${props.fund.code}/performance-nav`, '_blank');
  }
};

const formattedNameParts = computed(() => {
  const name = props.fund.name;
  // Match parentheses that contain "基金" or "配息" or "收益"
  const regex = /([\(（][^)）]*(?:基金|配息|收益)[^)）]*[\)）])/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(name)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: name.substring(lastIndex, match.index), isWarning: false });
    }
    parts.push({ text: match[0], isWarning: true });
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < name.length) {
    parts.push({ text: name.substring(lastIndex), isWarning: false });
  }
  
  return parts.length > 0 ? parts : [{ text: name, isWarning: false }];
});
</script>

<template>
  <div 
    @click="handleClick"
    class="group relative bg-white border rounded-[2.5rem] p-8 sm:p-10 transition-all duration-300 hover:shadow-xl cursor-pointer w-full"
    :class="isSelected ? 'border-[#D21118] ring-1 ring-[#D21118]/10' : 'border-slate-100 shadow-sm'"
  >
    <div class="flex flex-col gap-8">
      <div class="flex gap-8 items-start">
        <div 
          class="shrink-0 h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300"
          :class="isSelected ? 'bg-[#D21118] text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-[#D21118]/5 group-hover:text-[#D21118]'"
        >
          <ExternalLink v-if="externalLink" :size="24" />
          <CheckSquare v-else-if="isSelected" :size="28" :stroke-width="3" />
          <Square v-else :size="28" :stroke-width="3" />
        </div>
        <div class="space-y-4 flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-[12px] font-black px-3 py-1 bg-[#1E293B] text-white rounded-md tracking-wider uppercase">{{ fund.code }}</span>
            <span class="text-[12px] font-bold px-3 py-1 border border-slate-200 text-slate-500 rounded-md bg-white">{{ fund.currency }}</span>
            <span class="text-[12px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">風險 RR{{ fund.risk }}</span>
          </div>
          <h4 
            @click.stop="openFundDetails"
            class="font-extrabold text-[22px] sm:text-[30px] text-slate-900 leading-tight group-hover:text-[#D21118] hover:underline transition-colors inline-block"
          >
            <template v-for="(part, index) in formattedNameParts" :key="index">
              <span v-if="part.isWarning" class="text-orange-500">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </h4>
          <p class="text-base text-slate-500 leading-relaxed font-medium max-w-4xl">{{ fund.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
