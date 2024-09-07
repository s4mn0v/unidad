<template>
  <div class="flex relative min-h-screen">
    <!-- Botón de hamburguesa para móviles -->
    <button @click="toggleSidebar" class="lg:hidden fixed top-1 left-2 z-20 text-gray-500 hover:text-gray-600"
      :class="{ 'hidden': isSidebarOpen }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </button>

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-10 w-64 bg-dark text-white p-4 transition-transform duration-300 ease-in-out lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <nav class="space-y-2">
        <header class="text-white">
          <div class="flex items-center">
            <RouterLink to="/" @click="isSidebarOpen = false">
              <h1 class="text-3xl font-bold uppercase text-gold">Uni<span class="text-white">dad</span></h1>
            </RouterLink>
          </div>
        </header>
        <RouterLink to="/" class="block rounded-lg" @click="isSidebarOpen = false">
          <div
            :class="['flex items-center p-4 rounded-lg group', isActive('/') ? 'bg-darkness' : 'hover:bg-darkness', 'text-white']">
            <svg
              class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
              <path
                d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path
                d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">Dashboard</span>
          </div>
        </RouterLink>
        <RouterLink to="/convert" class="block rounded-lg" @click="isSidebarOpen = false">
          <div
            :class="['flex items-center p-4 rounded-lg group', isActive('/convert') ? 'bg-darkness' : 'hover:bg-darkness', 'text-white']">
            <svg
              class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
              viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
            </svg>
            <span class="ms-3">Conversor</span>
          </div>
        </RouterLink>
        <div class="relative">
          <button @click="toggleDropdown" type="button"
            class="flex items-center w-full p-4 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-darkness dark:text-white dark:hover:bg-drakness">
            <svg
              class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
              viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2"
                d="M3 11h18M3 15h18m-9-4v8m-8 0h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
            </svg>
            <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Registros</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <ul v-show="isDropdownOpen" class="py-2 space-y-2 mx-2">
            <li>
              <RouterLink to="/students" class="block rounded-lg" @click="isSidebarOpen = false">
                <div :class="['flex items-center p-4 group', isActive('/students') ? 'border-y-2 border-gold' : 'border-y-2 border-stone-700', 'hover:bg-darkness', 'text-white']">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm3 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1Z"
                      clip-rule="evenodd" />
                  </svg>
                  <span class="ms-3">Estudiantes</span>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/active_students" class="block rounded-lg" @click="isSidebarOpen = false">
                <div :class="['flex items-center p-4 group', isActive('/active_students') ? 'border-y-2 border-gold' : 'border-y-2 border-stone-700', 'hover:bg-darkness', 'text-white']">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                      clip-rule="evenodd" />
                  </svg>
                  <span class="ms-3">Estudiantes Activos</span>
                </div>

              </RouterLink>
            </li>
            <li>
              <RouterLink to="/graduate_students" class="block rounded-lg" @click="isSidebarOpen = false">
                <div :class="['flex items-center p-4 group', isActive('/graduate_students') ? 'border-y-2 border-gold' : 'border-y-2 border-stone-700', 'hover:bg-darkness', 'text-white']">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z"
                      clip-rule="evenodd" />
                  </svg>
                  <span class="ms-3">Egresados</span>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/moodle_students" class="block rounded-lg" @click="isSidebarOpen = false">
                <div :class="['flex items-center p-4 group', isActive('/moodle_students') ? 'border-y-2 border-gold' : 'border-y-2 border-stone-700', 'hover:bg-darkness', 'text-white']">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gold"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z"
                      clip-rule="evenodd" />
                  </svg>
                  <span class="ms-3">Estudiantes Moodle</span>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Overlay para cerrar el sidebar en móviles -->
    <div v-if="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden">
    </div>

    <!-- Contenido principal -->
    <main class="flex-1 p-8 lg:ml-64 bg-darkness min-h-screen">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const isSidebarOpen = ref(false)
const isDropdownOpen = ref(false)
const route = useRoute()

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const isActive = (path: string) => computed(() => route.path === path).value
</script>

<style scoped>
@media (max-width: 1023px) {
  main {
    margin-left: 0;
  }
}
</style>