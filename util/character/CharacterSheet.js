export default class CharacterSheet {
  constructor(abilityScores, skills, level, proficiencyBonus) {
    this.stats = {
      level,
      health: 0,
      abilityScores: false,
      skills: false,
      proficiencyBonus: proficiencyBonus || 2,
    };

    (abilityScores) && this.#createAbilityScores(abilityScores);
    (skills) && this.#createSkills(skills);

  }

  #createAbilityScores(abilityScoreNames) {
    let tempScore = {};
    Object.entries(abilityScoreNames).forEach(([ key, value ]) => {
      tempScore[key] = {
        displayName: key.charAt(0).toUpperCase() + key.slice(1),
        score: value,
      };
      tempScore[key].modifier = () => {
        return Math.floor((tempScore[key].score - 10) / 2);
      };
    });
    this.stats.abilityScores = tempScore;
  }

  #createSkills(skills) {
    let tempSkills = {};
    Object.entries(skills).forEach(([ key, value ]) => {
      let displayName = value.displayName || key;
      tempSkills[key] = value;
      tempSkills[key].displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      tempSkills[key].modifier = () => {
        let modifier = this.stats.abilityScores[value.abilityScore].modifier();
        let proficiency = (this.stats.skills[key].proficiency) ? this.stats.proficiencyBonus : 0;
        let expertise = (this.stats.skills[key].expertise) ? 2 : 1;
        // console.log(`${key} -> StatMod:${modifier} + ProficientMod:${proficiency} * IsExpert:${expertise}`);
        return modifier + proficiency * expertise;
      };
    });
    this.stats.skills = tempSkills;
  }
}
