<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid menu">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <router-link to="products" class="nav-link" aria-current="page">Products</router-link>
                </li>
                <li class="nav-item">
                <router-link to="orders" class="nav-link">Orders</router-link>
                </li>
                <li class="nav-item">
                <router-link to="create-order" class="nav-link">Create order</router-link>
                </li>
            </ul>
            </div>
        </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App',

  };
</script>

<style>
  /* Estilos globales */
  .navbar{
    padding: 0;
  }
  .nav-link{
    color: rgb(255, 255, 255);
  }
</style>