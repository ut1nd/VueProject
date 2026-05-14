<template>
  <div class="app">
    <!-- Верхняя плашка -->
    <div class="top-bar">
      <!-- Кнопка, открывающая 3 функциональные кнопки -->
      <div class="button-group">
        <button @click="toggleFirstGroup" class="main-btn">
          ☰ Показать группу 1
        </button>
        <transition name="slide">
          <div v-if="showFirstGroup" class="dropdown-buttons">
            <button class="func-btn">Функция 1.1</button>
            <button class="func-btn">Функция 1.2</button>
            <button class="func-btn">Функция 1.3</button>
          </div>
        </transition>
      </div>

      <!-- Ещё 3 кнопки (статичные, без выдвижения) -->
      <button class="plain-btn">Кнопка A</button>
      <button class="plain-btn">Кнопка B</button>
      <button class="plain-btn">Кнопка C</button>

      <!-- Кнопка с плюсом -->
      <button @click="onPlusClick" class="plus-btn">+</button>
    </div>

    <!-- Нижняя плашка -->
    <div class="bottom-bar">
      <p>Нижняя плашка (контент)</p>
    </div>
  </div>
</template>