<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import useScene from './Scene.js';

export default {
  setup() {
    return useScene();
  },
}
</script>
