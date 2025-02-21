class Ability {
  constructor(name, value) {
    this.name = name;
    this.value = Number(value); // Ensure value is stored as a number
    this.modifier = Math.floor((this.value - 10) / 2);
    this.abbreviation = name.slice(0, 3); // No .toUpperCase() per request
  }
}

class Skill {
  constructor(name, ability, proficiencyLevel, character) {
    this.name = name;
    this.ability = ability;
    this.proficiencyLevel = proficiencyLevel; // 0 = untrained, 1 = proficient, etc.
    this.character = character;

    // Ensure the associated ability exists in the character
    if (!character.abilities[ability]) {
      throw new Error(`Ability [${ability}] does not exist on character.`);
    }

    this.updateModifier();
  }

  updateModifier() {
    this.modifier =
      this.character.abilities[this.ability].modifier +
      this.proficiencyLevel * this.character.proficiencyBonus;
  }
}

class Character {
  constructor(name = 'no-name', level = {}, abilities = {}, stats = {}) {
    this.name = name;
    this.level = level;
    this.abilities = abilities;
    this.stats = stats;

    // Calculate proficiency bonus based on level (D&D 5E progression)
    this.proficiencyBonus = Math.floor((this.level.total - 1) / 4) + 1;

    // Initialize skills
    this.skills = {
      acrobatics: new Skill("acrobatics", "dexterity", 0, this),
      animalHandling: new Skill("animal handling", "wisdom", 0, this),
      arcana: new Skill("arcana", "intelligence", 0, this),
      athletics: new Skill("athletics", "strength", 1, this), // Example: proficient in athletics
      deception: new Skill("deception", "charisma", 0, this),
      history: new Skill("history", "intelligence", 0, this),
      insight: new Skill("insight", "wisdom", 0, this),
      intimidation: new Skill("intimidation", "charisma", 0, this),
      investigation: new Skill("investigation", "intelligence", 0, this),
      medicine: new Skill("medicine", "wisdom", 0, this),
      nature: new Skill("nature", "intelligence", 0, this),
      perception: new Skill("perception", "wisdom", 2, this), // Example: expert in perception
      performance: new Skill("performance", "charisma", 0, this),
      persuasion: new Skill("persuasion", "charisma", 0, this),
      religion: new Skill("religion", "intelligence", 0, this),
      sleightOfHand: new Skill("sleight of hand", "dexterity", 0, this),
      stealth: new Skill("stealth", "dexterity", 0, this),
      survival: new Skill("survival", "wisdom", 0, this),
    };

    // Initialize derived stats
    this.stats.armorClass = this.calculateArmorClass();
    this.stats.initiative = this.abilities.dexterity.modifier;
    this.stats.speed = 30; // Default speed, can be adjusted
    this.stats.hitPoints = this.calculateHitPoints();
    this.stats.hitDice = [[1, 10]]; // 1d10 for Fighter
    this.stats.deathSaves = [0, 0]; // Successes, Failures
  }

  calculateArmorClass() {
    return 10 + this.abilities.dexterity.modifier; // Basic unarmored AC
  }

  calculateHitPoints() {
    return {
      current: 10 + this.abilities.constitution.modifier, // Base HP + CON mod
      maximum: 10 + this.abilities.constitution.modifier,
      temporary: 0,
    };
  }
}

// Create the character
const steve = new Character(
  'Guy Guy',
  { total: 1, classLevels: [['fighter', 1]] },
  {
    strength: new Ability('strength', 15),
    dexterity: new Ability('dexterity', 14),
    constitution: new Ability('constitution', 13),
    intelligence: new Ability('intelligence', 12),
    wisdom: new Ability('wisdom', 10),
    charisma: new Ability('charisma', 8),
  }
);

console.log(steve);
