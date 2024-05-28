/*:
 * @target MZ
 * @plugindesc Personaliza la posición de los actores en la escena de batalla lateral en una resolución de 1280x720.
 * @param Actor1X
 * @text Actor 1 X
 * @type number
 * @default 1150
 * @desc La posición X del primer actor.
 *
 * @param Actor1Y
 * @text Actor 1 Y
 * @type number
 * @default 200
 * @desc La posición Y del primer actor.
 *
 * @param Actor2X
 * @text Actor 2 X
 * @type number
 * @default 1050
 * @desc La posición X del segundo actor.
 *
 * @param Actor2Y
 * @text Actor 2 Y
 * @type number
 * @default 300
 * @desc La posición Y del segundo actor.
 *
 * @param Actor3X
 * @text Actor 3 X
 * @type number
 * @default 1150
 * @desc La posición X del tercer actor.
 *
 * @param Actor3Y
 * @text Actor 3 Y
 * @type number
 * @default 400
 * @desc La posición Y del tercer actor.
 *
 * @param Actor4X
 * @text Actor 4 X
 * @type number
 * @default 1050
 * @desc La posición X del cuarto actor.
 *
 * @param Actor4Y
 * @text Actor 4 Y
 * @type number
 * @default 500
 * @desc La posición Y del cuarto actor.
 *
 * @help Este plugin posiciona a los actores en un patrón de zigzag en la escena de batalla lateral.
 */

(() => {
    const parameters = PluginManager.parameters('NombreDelPlugin'); // Cambia 'NombreDelPlugin' por el nombre del archivo del plugin.
    const actorPositions = [
        { x: Number(parameters['Actor1X'] || 1150), y: Number(parameters['Actor1Y'] || 200) },
        { x: Number(parameters['Actor2X'] || 1050), y: Number(parameters['Actor2Y'] || 300) },
        { x: Number(parameters['Actor3X'] || 1150), y: Number(parameters['Actor3Y'] || 400) },
        { x: Number(parameters['Actor4X'] || 1050), y: Number(parameters['Actor4Y'] || 500) }
    ];

    Game_Actor.prototype.screenX = function() {
        const index = $gameParty.battleMembers().indexOf(this);
        if (index >= 0 && index < actorPositions.length) {
            return actorPositions[index].x;
        }
        return _Game_Actor_prototype_screenX.call(this); // Posición por defecto si no hay configuraciones
    };

    Game_Actor.prototype.screenY = function() {
        const index = $gameParty.battleMembers().indexOf(this);
        if (index >= 0 && index < actorPositions.length) {
            return actorPositions[index].y;
        }
        return _Game_Actor_prototype_screenY.call(this); // Posición por defecto si no hay configuraciones
    };
})();
