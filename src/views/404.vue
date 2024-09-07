<template>
    <main class="h-screen w-full flex flex-col justify-center items-center">
        <h1 class="text-9xl font-extrabold text-gold tracking-widest">404</h1>
        <div class="bg-white px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
        </div>
        <button class="mt-5">
            <a class="relative inline-block text-sm font-medium text-gold group active:text-orange-500 focus:outline-none focus:ring">
                <span class="relative block px-8 py-3 bg-dark border border-current">
                    <router-link to="/">Go Home</router-link>
                </span>
            </a>
        </button>
    </main>
</template>