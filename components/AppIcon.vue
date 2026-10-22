<script setup lang="ts">
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  Coffee,
  Command,
  Download,
  Github,
  Layers,
  Menu,
  Monitor,
  Moon,
  Network,
  Package,
  PackageOpen,
  Palette,
  Plus,
  ShieldCheck,
  Shirt,
  Sparkles,
  Sun,
  Terminal,
  UserRound,
  X
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{ name: string; size?: number | string; stroke?: number }>(),
  { size: 18, stroke: 1.7 }
)

const MAP: Record<string, any> = {
  layers: Layers,
  boxes: Boxes,
  package: Package,
  packageOpen: PackageOpen,
  userRound: UserRound,
  shirt: Shirt,
  network: Network,
  coffee: Coffee,
  shield: ShieldCheck,
  palette: Palette,
  monitor: Monitor,
  command: Command,
  terminal: Terminal,
  sun: Sun,
  moon: Moon,
  github: Github,
  arrowRight: ArrowRight,
  arrowUp: ArrowUpRight,
  download: Download,
  chevron: ChevronDown,
  plus: Plus,
  check: Check,
  menu: Menu,
  close: X,
  sparkles: Sparkles
}

const comp = computed(() => MAP[props.name] ?? Sparkles)
</script>

<template>
  <component :is="comp" :size="size" :stroke-width="stroke" aria-hidden="true" focusable="false" />
</template>
