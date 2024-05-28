/*:
 * @plugindesc Evita que el líder del equipo sea removido o cambiado de la primera posición.
 * @help Este plugin bloquea al primer actor en el equipo para que no pueda ser removido ni cambiado de posición.
 */

(function() {
  var _Game_Party_swapOrder = Game_Party.prototype.swapOrder;
  Game_Party.prototype.swapOrder = function(index1, index2) {
      if (index1 === 0 || index2 === 0) {
          return; // Evita que el primer actor sea intercambiado
      }
      _Game_Party_swapOrder.call(this, index1, index2);
  };

  var _Game_Party_removeActor = Game_Party.prototype.removeActor;
  Game_Party.prototype.removeActor = function(actorId) {
      if (this.members()[0].actorId() === actorId) {
          return; // Evita que el primer actor sea removido
      }
      _Game_Party_removeActor.call(this, actorId);
  };

  var _Game_Party_addActor = Game_Party.prototype.addActor;
  Game_Party.prototype.addActor = function(actorId) {
      _Game_Party_addActor.call(this, actorId);
      this._actors = this._actors.filter((actorId, index) => {
          // Evita duplicados en la primera posición, manteniendo al líder
          return index === 0 ? true : this._actors.indexOf(actorId) === index;
      });
  };

})();
