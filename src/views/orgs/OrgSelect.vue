<template>
  <el-tree-select v-model="innerValue" :data="data" :render-after-expand="false" 
  @update:model-value="handleChange" check-strictly="true" :placeholder="placeholder"/>
</template>

<script setup name="OrgSelect">
import { ref, onMounted, watch } from 'vue'
import { getOrgList } from '@/views/orgs/OrgApi'

const props = defineProps({
  modelValue: { 
    type: [String, Number],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Please select organization'
  },
  // IDs that should be disabled (string or number)
  disabledIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = ref(props.modelValue)
const data = ref([])
// keep raw tree from backend so we can re-apply disabled state when props change
const rawTree = ref([])

const handleChange = (value) => {
  innerValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  console.log('OrgSelect changed:', value)
}

// Find first available node id in tree
const findFirstNodeId = (nodes) => {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return null
  }
  const firstNode = nodes[0]
  if (firstNode && firstNode.id) {
    return firstNode.id
  }
  return null
}

const formatTree = (tree) => {
  const disabledIdSet = new Set(
    Array.isArray(props.disabledIds)
      ? props.disabledIds.map(id => String(id))
      : []
  )

  return Array.isArray(tree)
    ? tree.map(node => {
        const formatted = {
          ...node,
          label: node.name || node.label,
          value: node.id,
          // normalize both sides to string to avoid 1 vs '1' 比较不上的问题
          disabled: disabledIdSet.has(String(node.id))
        }
        if (node.children && node.children.length) {
          formatted.children = formatTree(node.children)
        }
        return formatted
      })
    : []
}

onMounted(() => {
  getOrgList().then(res => {
    rawTree.value = res || []
    const formattedData = formatTree(rawTree.value)
    data.value = formattedData
    
    // If parent component has passed a value, use it; otherwise select the first one
    if (props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '') {
      // Parent component has passed a value, use it
      innerValue.value = props.modelValue
    } else {
      // No value from parent, default to first organization
      const firstId = findFirstNodeId(formattedData)
      if (firstId) {
        innerValue.value = firstId
        emit('update:modelValue', firstId)
        emit('change', firstId)
      }
    }
  })
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal !== innerValue.value) {
    innerValue.value = newVal
  }
})

// When disabledIds changes, re-apply disabled state to tree nodes
watch(
  () => props.disabledIds,
  () => {
    data.value = formatTree(rawTree.value)
  },
  { deep: true }
)
</script>

<style scoped></style>