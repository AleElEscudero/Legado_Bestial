/*:
 * @plugindesc Custom key bindings for movement, action, cancel, and sprint.
 * @help This plugin reassigns the default key bindings.
 */

(function() {
    // Restablecer el mapeo de teclas por defecto
    Input.keyMapper = {};

    // Asignar teclas personalizadas
    Input.keyMapper[87] = 'up';       // W
    Input.keyMapper[65] = 'left';     // A
    Input.keyMapper[83] = 'down';     // S
    Input.keyMapper[68] = 'right';    // D
    Input.keyMapper[70] = 'ok';       // F (Botón de acción)
    Input.keyMapper[67] = 'cancel';   // C (Botón de cancelar)
    Input.keyMapper[16] = 'shift';    // Shift (Botón de esprintar)
    Input.keyMapper[27] = 'menu';     // Esc (Abrir menú)

    // Asignar teclas adicionales para que las teclas originales sigan funcionando
    Input.keyMapper[38] = 'up';       // Flecha arriba
    Input.keyMapper[37] = 'left';     // Flecha izquierda
    Input.keyMapper[40] = 'down';     // Flecha abajo
    Input.keyMapper[39] = 'right';    // Flecha derecha

    Input.keyMapper[13] = 'ok';       // Enter
    Input.keyMapper[32] = 'ok';       // Espacio

    // Asegurarse de que 'X' ya no abre el menú
    Input.keyMapper[88] = null;       // X (deshabilitar abrir menú)
      // Configurar el comportamiento del menú para la tecla Esc
      const _SceneManager_onKeyDown = SceneManager.onKeyDown;
      SceneManager.onKeyDown = function(event) {
          if (!event.repeat) {
              this._onKeyDown(event);
          }
      };
  
      SceneManager._onKeyDown = function(event) {
          const key = event.keyCode;
          if (key === 27) { // Esc
              if ($gameMessage.isBusy()) {
                  return;
              }
              if ($gameMap.isEventRunning()) {
                  return;
              }
              if (SceneManager._scene instanceof Scene_Map) {
                  SceneManager.push(Scene_Menu);
              } else if (SceneManager._scene instanceof Scene_Menu) {
                  SceneManager.pop();
              }
          } else {
              _SceneManager_onKeyDown.call(this, event);
          }
      };
      Input.keyMapper[120] = 'debug'; // 120 is the keycode for F9
      // Asegúrate de que la función de depuración esté presente y correcta
SceneManager.checkDebug = function() {
    if (Input.isTriggered('debug') && $gameTemp.isPlaytest()) {
        SceneManager.push(Scene_Debug);
    }
};

// Llama a la función checkDebug en tu loop de actualización, por ejemplo en SceneManager.update
var _SceneManager_update = SceneManager.update;
    SceneManager.update = function() {
    _SceneManager_update.call(this);
    this.checkDebug();
};

})();
