// ==UserScript==
// @name         Падающий снег
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет эффект падающего снега на любую страницу
// @author       Nelikkkl
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const SNOWFLAKE_COUNT = 50; // Количество снежинок одновременно
    const MIN_SIZE = 5;         // Минимальный размер (px)
    const MAX_SIZE = 15;        // Максимальный размер (px)
    const MIN_DURATION = 5;     // Минимальная длительность падения (сек)
    const MAX_DURATION = 12;    // Максимальная длительность падения (сек)

    // Создаем контейнер для снега, чтобы он был поверх всего, но не мешал кликам
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    Object.assign(snowContainer.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Пропускает клики сквозь снег
        zIndex: 2147483647,    // Максимальный z-index
        overflow: 'hidden'
    });
    document.body.appendChild(snowContainer);

    // Функция создания одной снежинки
    function createSnowflake() {
        const flake = document.createElement('div');
        flake.textContent = '❄';
        
        // Случайные параметры
        const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
        const leftPos = Math.random() * 100; // Позиция по горизонтали (0-100%)
        const duration = Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION;
        const opacity = Math.random() * 0.5 + 0.3; // Прозрачность 0.3 - 0.8
        const delay = Math.random() * 5; // Задержка перед началом

        // Стилизация
        Object.assign(flake.style, {
            position: 'absolute',
            top: '-20px', // Начинаем чуть выше экрана
            left: leftPos + '%',
            fontSize: size + 'px',
            color: 'white',
            opacity: opacity,
            textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
            animation: `fall ${duration}s linear ${delay}s forwards`
        });

        // Добавляем ключевые кадры анимации динамически, если они еще не добавлены
        if (!document.getElementById('snow-animation-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'snow-animation-style';
            styleSheet.textContent = `
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(styleSheet);
        }

        snowContainer.appendChild(flake);

        // Удаляем снежинку после завершения анимации, чтобы не засорять DOM
        setTimeout(() => {
            flake.remove();
        }, (duration + delay) * 1000);
    }

    // Запускаем создание снежинок
    setInterval(createSnowflake, 200); // Новая снежинка каждые 200мс

    // Инициализация: создаем сразу несколько снежинок при загрузке
    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        createSnowflake();
    }

})();