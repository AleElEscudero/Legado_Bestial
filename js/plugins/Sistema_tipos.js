/*:
 * @plugindesc Implements a type system with bonuses and weaknesses for skills and actors.
 * @help This plugin allows you to set up a type system for skills and actors.
 * 
 * @param TypeEffects
 * @text Type Effects
 * @type struct<TypeEffect>[]
 * @desc Define the type effectiveness for each type combination.
 * @default []
 */

/*~struct~TypeEffect:
 * @param attackType
 * @text Attack Type
 * @type string
 * @desc The type of the attacking skill.
 * 
 * @param targetType
 * @text Target Type
 * @type string
 * @desc The type of the target actor.
 * 
 * @param multiplier
 * @text Damage Multiplier
 * @type number
 * @desc The damage multiplier for this type combination.
 * @default 1.0
 */

(function() {
    const parameters = PluginManager.parameters('TypeSystem');
    const typeEffects = JSON.parse(parameters['TypeEffects']).map(effect => JSON.parse(effect));
console.log("json", parameters);
    // Sobrescribimos el método elementRate para incluir nuestra lógica de tipos.
    Game_BattlerBase.prototype.elementRate = function(elementId) {
        const baseRate = this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
        const elementType = $dataSystem.elements[elementId];
        const actorType = this.actorType();

        // Buscamos la combinación de tipo de ataque y tipo de objetivo en typeEffects.
        const effect = typeEffects.find(effect => effect.attackType === elementType && effect.targetType === actorType);

        // Si no se encuentra la combinación, asumimos un multiplicador por defecto de 1.
        const multiplier = effect ? parseFloat(effect.multiplier) : 1.0;

        return baseRate * multiplier;
    };

    // Método para obtener el tipo de actor/enemigo a partir de los metadatos.
    Game_BattlerBase.prototype.actorType = function() {
        if (this.isActor()) {
            return this.actor().meta.type || 'none';
        } else if (this.isEnemy()) {
            return this.enemy().meta.type || 'none';
        } else {
            return 'none';
        }
    };

    // Sobrescribimos evalDamageFormula para incluir la tasa de elementos.
    Game_Action.prototype.evalDamageFormula = function(target) {
        try {
            const item = this.item();
            const a = this.subject();
            const b = target;
            const v = $gameVariables._data;
            const sign = [3, 4].contains(item.damage.type) ? -1 : 1;
            const baseValue = Math.max(eval(item.damage.formula), 0) * sign;
            const elementRate = target.elementRate(this.item().damage.elementId);
            return Math.round(baseValue * elementRate);
        } catch (e) {
            return 0;
        }
    };
})();