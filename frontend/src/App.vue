<template>
  <div class="container">
    <my-header />
    <router-view />
    <my-footer />
  </div>
</template>

<script>
import myHeader from '@/components/header'
import myFooter from '@/components/footer'
export default {
  components: { myHeader, myFooter },
}
</script>

<style lang="scss"></style>
