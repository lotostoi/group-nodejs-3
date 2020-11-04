<template>
  <nav
    class="navbar navbar-light bg-light justify-content-between blue rounded"
  >
    <a class="navbar-brand title" href="/">title </a>
    <form class="form-inline ml-auto mr-1">
      <input
        class="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button class="btn btn-outline-light my-2 my-sm-0" type="submit">
        Search
      </button>
    </form>

    <router-link
      v-if="user"
      type="button"
      :to="{}"
      class="btn btn-outline-light"
    >
      {{ user.login }}
    </router-link>

    <router-link
      v-else
      type="button"
      :to="{ name: 'auth' }"
      class="btn btn-outline-light"
      >sign in</router-link
    >
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { http } from '@/api/http'
export default {
  components: {},
  async craeted() {
   // await 
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
    }),
  },
}
</script>

<style scoped lang="scss"></style>
