<template>
  <div class="code-editor">
    <textarea
      ref="editor"
      v-model="localValue"
      @input="updateValue"
      class="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
      :placeholder="getPlaceholder()"
      spellcheck="false"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
const editor = ref(null)

const updateValue = () => {
  emit('update:modelValue', localValue.value)
}

const getPlaceholder = () => {
  const placeholders = {
    javascript: '// Write your JavaScript code here...',
    python: '# Write your Python code here...',
    java: '// Write your Java code here...',
    cpp: '// Write your C++ code here...'
  }
  return placeholders[props.language] || '// Write your code here...'
}

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
  }
})

// Auto-resize functionality
const autoResize = () => {
  if (editor.value) {
    editor.value.style.height = 'auto'
    editor.value.style.height = editor.value.scrollHeight + 'px'
  }
}

onMounted(() => {
  if (editor.value) {
    editor.value.addEventListener('input', autoResize)
    autoResize()
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.removeEventListener('input', autoResize)
  }
})
</script>

<style scoped>
.code-editor {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

textarea {
  tab-size: 2;
  line-height: 1.5;
}

textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #1f2937;
}

textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}