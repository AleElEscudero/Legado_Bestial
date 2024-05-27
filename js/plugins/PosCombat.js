/*:
 * @target MZ
 * @plugindesc Personaliza la posición de los actores en la escena de batalla en una resolución de 1280x720.
 * @help Este plugin posiciona a los actores en un patrón de zigzag en la escena de batalla.
 */

(() => {
    const _Game_Actor_prototype_screenX = Game_Actor.prototype.screenX;
    const _Game_Actor_prototype_screenY = Game_Actor.prototype.screenY;

    Game_Actor.prototype.screenX = function() {
        const index = $gameParty.battleMembers().indexOf(this);
        const baseX = 1280 - 30; // 30 píxeles de margen desde el borde derecho
        const offsetX = 100; // Desplazamiento horizontal para el zigzag
        const x = (index % 2 === 0) ? baseX - offsetX : baseX;
        return x;
    };

    Game_Actor.prototype.screenY = function() {
        const index = $gameParty.battleMembers().indexOf(this);
        const baseY = 150; // Posición base Y
        const offsetY = 50; // Desplazamiento vertical entre actores
        const y = baseY + index * offsetY;
        return y;
    };
})();
