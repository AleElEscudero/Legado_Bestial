/*:
 * @plugindesc Controla diferentes aspectos logicos del videojuego LegadoBestial
 * @param GlobalSwitchId
 * @text ID del Interruptor Global
 * @type switch
 * @desc El ID del interruptor que controla globalmente los encuentros aleatorios.
 * @default 1
 * 
 * @param MapSpecificSwitches
 * @text Interruptores Específicos del Mapa
 * @type struct<MapSwitch>[]
 * @desc Configura interruptores específicos para habilitar/deshabilitar encuentros en ciertos mapas.
 * @default []
 * 
 * @help
 * Este plugin permite controlar si los encuentros aleatorios están activos en los mapas basados en un interruptor global o específico del mapa.
 * 
 * Configuración:
 * - Establece el ID del interruptor global en los parámetros del plugin.
 * - Añade interruptores específicos para mapas individuales en los parámetros del plugin.
 */
/*~struct~MapSwitch:
 * @param MapId
 * @text ID del Mapa
 * @type number
 * @desc El ID del mapa al que se aplica el interruptor.
 * @default 1
 * 
 * @param SwitchId
 * @text ID del Interruptor
 * @type switch
 * @desc El ID del interruptor que controla los encuentros en este mapa.
 * @default 1
 */

(function() {
    var parameters = PluginManager.parameters('EncounterControl');
    var globalSwitchId = Number(parameters['GlobalSwitchId'] || 1);
    var mapSpecificSwitches = JSON.parse(parameters['MapSpecificSwitches'] || '[]').map(function(switchObj) {
        return JSON.parse(switchObj);
    });

    var _Game_Player_canEncounter = Game_Player.prototype.canEncounter;
    Game_Player.prototype.canEncounter = function() {
        // Verificar el interruptor global
        if (!$gameSwitches.value(globalSwitchId)) {
            return false;
        }

        // Verificar los interruptores específicos del mapa
        for (var i = 0; i < mapSpecificSwitches.length; i++) {
            var mapSwitch = mapSpecificSwitches[i];
            if (Number(mapSwitch.MapId) === $gameMap.mapId() && !$gameSwitches.value(Number(mapSwitch.SwitchId))) {
                return false;
            }
        }

        return _Game_Player_canEncounter.call(this);
    };
})();

(function() {
    const targetHour = 17; // Hora objetivo para ejecutar la cinemática
    const timeVariableId = 10; // ID de la variable que guarda la hora
    const targetMapId = 4; // ID del mapa CasaInicio
    const targetX = 9; // Coordenada X del destino en el mapa CasaInicio
    const targetY = 4; // Coordenada Y del destino en el mapa CasaInicio
    const cinematicSwitchId = 3; // ID del switch que controla si la cinemática ya se ha ejecutado

    // Alias del método update de Scene_Map para comprobar la hora cada frame
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.checkTimeForCinematic();
    };

    Scene_Map.prototype.checkTimeForCinematic = function() {
        const currentHour = $gameVariables.value(timeVariableId);
        const cinematicExecuted = $gameSwitches.value(cinematicSwitchId);

        if (currentHour === targetHour && !cinematicExecuted) {
            this.startCinematic();
        }
    };

    Scene_Map.prototype.startCinematic = function() {
        // Establecer el switch para indicar que la cinemática ya se ha ejecutado
        $gameSwitches.setValue(cinematicSwitchId, true);

        // Empezar la transición de pantalla
        $gameScreen.startFadeOut(30, false); // Duración de 30 frames

        // Esperar a que la transición termine antes de trasladar al jugador
        setTimeout(() => {
            $gamePlayer.reserveTransfer(targetMapId, targetX, targetY, 0, 0); // Coordenadas (9,4) y dirección abajo
            $gameScreen.startFadeIn(30, false); // Duración de 30 frames
        }, 60); // Espera de 500 ms antes de trasladar al jugador
    };
})();
