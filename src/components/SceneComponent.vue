<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import useScene from './SceneComponent.js';

export default {
  setup() {
    return useScene();
  },
}
</script>
