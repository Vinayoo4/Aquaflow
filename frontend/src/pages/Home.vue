<template>
  <div class="space-y-8 animate-fade-in">
    <section class="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-100">
      <h1 class="text-4xl font-extrabold text-emerald-900 mb-4">Cultivate Your Life</h1>
      <p class="text-lg text-emerald-700 max-w-xl mx-auto">
        Join the Urban Gardening Club and Herbal Living Community.
        Access premium guides, organize your meal plans, and grow with SALTEDHASH.
      </p>
      <div class="mt-8">
        <router-link to="/guides" class="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 shadow-md transition">Explore Guides</router-link>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-emerald-900 mb-2">Gardening Guides</h3>
        <p class="text-gray-600 mb-4">Expert tips on growing vegetables, herbs, and flowers in urban spaces.</p>
        <router-link to="/guides" class="text-emerald-600 font-semibold hover:underline">Read more &rarr;</router-link>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-emerald-900 mb-2">Meal Planning</h3>
        <p class="text-gray-600 mb-4">Organize your weekly meals and gardening tasks in one place.</p>
        <router-link to="/plans" class="text-emerald-600 font-semibold hover:underline">Start planning &rarr;</router-link>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-emerald-900 mb-2">Community</h3>
        <p class="text-gray-600 mb-4">Connect with fellow enthusiasts, share your progress, and ask questions.</p>
        <router-link to="/community" class="text-emerald-600 font-semibold hover:underline">Join discussion &rarr;</router-link>
      </div>
    </section>
  </div>
</template>
